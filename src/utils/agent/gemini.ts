import { AgentIntentOverride } from "@/utils/agent/runner";
import { AgentContext } from "@/types/Agent";

interface GeminiIntentRequest {
  apiKey: string;
  model: string;
  message: string;
  context?: AgentContext;
  locationHints: Array<{ name: string; slug: string }>;
  categoryHints: Array<{ id: number | string; name: string }>;
}

export async function getGeminiIntent({
  apiKey,
  model,
  message,
  context,
  locationHints,
  categoryHints,
}: GeminiIntentRequest): Promise<AgentIntentOverride | null> {
  let lastStatus = 0;
  let lastText = "";
  const locationList = locationHints
    .slice(0, 120)
    .map((loc) => `${loc.name} (${loc.slug})`)
    .join("; ");
  const categoryList = categoryHints
    .slice(0, 80)
    .map((cat) => `${cat.name} [${cat.id}]`)
    .join("; ");

  const systemInstruction = `You are an intent extraction assistant for an event discovery app in New Zealand.
Return ONLY valid JSON with keys: location, dateFilter, budget, vibe, query, categoryNames.
Rules:
- location must be a location slug from the list when possible.
- dateFilter must be one of: today, this_week, this_weekend, future.
- budget is a number without currency symbol.
- categoryNames must be a list of category names from the list when possible.
- If a field is not specified, return null.
- Keep query short and specific.`;

  const userPrompt = `User message: "${message}"
Context location: ${context?.location ?? "unknown"}
Context dateFilter: ${context?.dateFilter ?? "unknown"}
Known locations: ${locationList}
Known categories: ${categoryList}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 256,
        },
      }),
    }
  );

  lastStatus = response.status;
  const rawText = await response.text();
  lastText = rawText.slice(0, 300);

  if (!response.ok) {
    console.warn("[agent] gemini http error", { status: lastStatus, body: lastText });
    return null;
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
    console.warn("[agent] gemini json parse error", { status: lastStatus, body: lastText });
    return null;
  }
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || "").join("") || "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn("[agent] gemini no json in response", { status: lastStatus, body: lastText });
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      location: parsed.location || undefined,
      dateFilter: parsed.dateFilter || undefined,
      budget: typeof parsed.budget === "number" ? parsed.budget : undefined,
      vibe: parsed.vibe || undefined,
      query: parsed.query || undefined,
      categoryNames: Array.isArray(parsed.categoryNames) ? parsed.categoryNames : undefined,

    };
  } catch {
    return null;
  }
}
