import { NextRequest, NextResponse } from "next/server";
import { getCategoryHints, getLocationHints, searchEvents } from "@/server/eventCatalog";
import { AgentRequest, AgentRecommendation } from "@/types/Agent";
import { resetMemory, updateMemory } from "@/utils/agent/memory";
import { getGeminiIntent } from "@/utils/agent/gemini";
import { runAgent } from "@/utils/agent/runner";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

async function fetchEventsFromCatalog(params: {
  location: string;
  dateFilter: string;
  query?: string;
  limit?: number;
  categoryIds?: string;
}): Promise<AgentRecommendation[]> {
  try {
    const { events } = await searchEvents({
      location: params.location,
      dateFilter: params.dateFilter,
      query: params.query,
      limit: params.limit,
      category: params.categoryIds,
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      location: event.location,
      datetime: event.datetime,
      category: event.category,
      description: event.fullDescription || event.description,
      url: event.url,
      image: event.image,
      price: event.price,
      priceValue: event.priceValue,
      isFree: event.isFree,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      latitude: event.latitude,
      longitude: event.longitude,
      whyThis: event.whyThis,
    }));
  } catch (error) {
    console.warn("[agent] event search failed", error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AgentRequest;
    const sessionId = body.sessionId || "anonymous";
    const message = body.message || "";

    if (!message.trim()) {
      return NextResponse.json(
        { assistantMessage: "Tell me what you want to do and I can suggest events." },
        { status: 400 }
      );
    }

    if (body.memory) {
      updateMemory(sessionId, body.memory);
    }

    const locationHints = await getLocationHints();
    const categoryHints = await getCategoryHints();
    const aiIntent = GEMINI_API_KEY
      ? await getGeminiIntent({
          apiKey: GEMINI_API_KEY,
          model: GEMINI_MODEL,
          message,
          context: body.context,
          locationHints,
          categoryHints,
        })
      : null;

    if (!GEMINI_API_KEY) {
      console.warn("[agent] GEMINI_API_KEY missing - using rule-based intent only");
    } else if (!aiIntent) {
      console.warn("[agent] Gemini intent unavailable - falling back to rule-based parsing");
    }

    const response = await runAgent(
      sessionId,
      message,
      body.context,
      (params) =>
        fetchEventsFromCatalog({
          location: params.location,
          dateFilter: params.dateFilter,
          query: params.query,
          limit: params.limit,
          categoryIds: params.categoryIds,
        }),
      locationHints,
      categoryHints,
      aiIntent || undefined
    );

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { assistantMessage: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { sessionId?: string };

    if (body.sessionId) {
      resetMemory(body.sessionId);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not reset chat session." },
      { status: 500 }
    );
  }
}
