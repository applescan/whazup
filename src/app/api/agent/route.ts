import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/utils/agent/runner";
import { AgentRequest, AgentRecommendation } from "@/types/Agent";
import { mapEventfindaEventsToEvents } from "@/utils/eventMapper";
import { Event } from "@/types/Event";
import { getGeminiIntent } from "@/utils/agent/gemini";

interface EventsApiResponse {
  success: boolean;
  data: {
    events: any[];
    count: number;
    page_count: number;
    page_size: number;
    page_number: number;
  };
  fallback: boolean;
  error?: string;
}

async function fetchEventsFromApi(
  baseUrl: string,
  params: { location: string; dateFilter: string; query?: string; limit?: number; categoryIds?: string }
): Promise<AgentRecommendation[]> {
  const searchParams = new URLSearchParams({
    location: params.location,
    dateFilter: params.dateFilter,
    limit: String(params.limit ?? 10),
  });

  if (params.query) {
    searchParams.append("q", params.query);
  }
  if (params.categoryIds) {
    searchParams.append("category", params.categoryIds);
  }

  const response = await fetch(`${baseUrl}/api/events?${searchParams.toString()}`);
  if (!response.ok) {
    return [];
  }

  const result: EventsApiResponse = await response.json();
  if (!result.success || !result.data?.events) {
    return [];
  }

  const mapped: Event[] = mapEventfindaEventsToEvents(result.data.events);
  return mapped.map((event) => ({
    id: event.id,
    title: event.title,
    location: event.location,
    datetime: event.datetime,
    url: event.url,
    image: event.image,
    whyThis: event.whyThis,
  }));
}

interface LocationRecord {
  name: string;
  url_slug: string;
}

interface CategoryRecord {
  id: number;
  name: string;
  url_slug?: string;
}

let cachedLocations: Array<{ name: string; slug: string }> | null = null;
let cachedAt = 0;
const LOCATION_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
let cachedCategories: Array<{ id: number; name: string; url_slug?: string }> | null = null;
let cachedCategoriesAt = 0;
const CATEGORY_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

async function fetchLocationHints(baseUrl: string): Promise<Array<{ name: string; slug: string }>> {
  const now = Date.now();
  if (cachedLocations && now - cachedAt < LOCATION_CACHE_TTL_MS) {
    return cachedLocations;
  }

  try {
    const response = await fetch(`${baseUrl}/api/locations?rows=300&levels=2`);
    if (!response.ok) {
      return cachedLocations || [];
    }

    const data = await response.json();
    const locations: LocationRecord[] = Array.isArray(data.locations) ? data.locations : [];
    cachedLocations = locations
      .filter((loc) => loc?.name && loc?.url_slug)
      .map((loc) => ({ name: loc.name, slug: loc.url_slug }));
    cachedAt = now;
    return cachedLocations;
  } catch {
    return cachedLocations || [];
  }
}

async function fetchCategoryHints(
  baseUrl: string
): Promise<Array<{ id: number; name: string; url_slug?: string }>> {
  const now = Date.now();
  if (cachedCategories && now - cachedCategoriesAt < CATEGORY_CACHE_TTL_MS) {
    return cachedCategories;
  }

  try {
    const response = await fetch(`${baseUrl}/api/categories`);
    if (!response.ok) {
      return cachedCategories || [];
    }

    const data = await response.json();
    const categories: CategoryRecord[] = Array.isArray(data)
      ? data
      : Array.isArray(data.categories)
        ? data.categories
        : [];

    cachedCategories = categories
      .filter((cat) => cat?.id && cat?.name)
      .map((cat) => ({ id: cat.id, name: cat.name, url_slug: cat.url_slug }));
    cachedCategoriesAt = now;
    return cachedCategories;
  } catch {
    return cachedCategories || [];
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

    const baseUrl = request.nextUrl.origin;
    const locationHints = await fetchLocationHints(baseUrl);
    const categoryHints = await fetchCategoryHints(baseUrl);
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
        fetchEventsFromApi(baseUrl, {
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
  } catch (error: any) {
    return NextResponse.json(
      { assistantMessage: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
