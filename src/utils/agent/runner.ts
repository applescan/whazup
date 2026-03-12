import { AgentContext, AgentMemory, AgentRecommendation, AgentResponse } from "@/types/Agent";
import { EventDateFilter } from "@/types/Event";
import { getMemory, updateMemory } from "@/utils/agent/memory";

interface AgentIntent {
  location?: string;
  dateFilter?: EventDateFilter;
  budget?: number;
  vibe?: string;
  query?: string;
  planMode?: boolean;
  categoryIds?: string;
  categoryNames?: string[];
}

export interface AgentIntentOverride {
  location?: string;
  dateFilter?: EventDateFilter;
  budget?: number;
  vibe?: string;
  query?: string;
  categoryNames?: string[];
}

interface FetchEventsParams {
  location: string;
  dateFilter: EventDateFilter;
  query?: string;
  limit?: number;
  categoryIds?: string;
}

type FetchEvents = (params: FetchEventsParams) => Promise<AgentRecommendation[]>;

const LOCATION_KEYWORDS: Array<{ name: string; slug: string }> = [
  { name: "Northland", slug: "northland" },
  { name: "Auckland", slug: "auckland" },
  { name: "Waikato", slug: "waikato" },
  { name: "Bay of Plenty", slug: "bay-of-plenty" },
  { name: "Hawke's Bay", slug: "hawkes-bay" },
  { name: "Wellington", slug: "wellington" },
  { name: "Otago", slug: "otago" },
  { name: "Canterbury", slug: "canterbury" },
  { name: "Southland", slug: "southland" },
  { name: "Christchurch", slug: "christchurch" },
  { name: "Hamilton", slug: "hamilton" },
  { name: "Dunedin", slug: "dunedin" },
  { name: "Tauranga", slug: "tauranga" },
  { name: "Queenstown", slug: "queenstown" },
  { name: "Rotorua", slug: "rotorua" },
  { name: "Napier", slug: "napier" },
  { name: "Hastings", slug: "hastings" },
  { name: "Palmerston North", slug: "palmerston-north" },
  { name: "Nelson", slug: "nelson" },
  { name: "New Plymouth", slug: "new-plymouth" },
  { name: "Whangārei", slug: "whangarei" },
  { name: "Invercargill", slug: "invercargill" },
  { name: "Gisborne", slug: "gisborne" },
];

function toLocationSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeLocationName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLocation(
  message: string,
  locationHints: Array<{ name: string; slug: string }>
): string | undefined {
  const lower = message.toLowerCase();
  for (const loc of locationHints) {
    const nameLower = loc.name.toLowerCase();
    const pattern = new RegExp(`\\b${escapeRegExp(nameLower)}\\b`, "i");
    if (pattern.test(lower)) return loc.slug;
  }

  const taggedMatch = message.match(/\b(in|near|around|at)\s+([a-zA-Z'’\-\s]{3,40})/i);
  if (taggedMatch) {
    const raw = taggedMatch[2].trim();
    if (!/(town|city|area|here|there)\b/i.test(raw)) {
      const normalized = normalizeLocationName(raw);
      const exactHint = locationHints.find(
        (loc) => normalizeLocationName(loc.name) === normalized
      );
      if (exactHint) return exactHint.slug;
      return toLocationSlug(raw);
    }
  }

  return undefined;
}

function detectDateFilter(message: string): EventDateFilter | undefined {
  const lower = message.toLowerCase();
  if (/(today|tonight)/.test(lower)) return "today";
  if (/(tomorrow)/.test(lower)) return "this_week";
  if (/(this\s+weekend|weekend)/.test(lower)) return "this_weekend";
  if (/(this\s+week)/.test(lower)) return "this_week";
  if (/(future|upcoming|next\s+week)/.test(lower)) return "future";
  return undefined;
}

function detectBudget(message: string): number | undefined {
  const match = message.match(/(?:\$|under|below|less\s+than)\s*(\d{1,4})/i);
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

function detectVibe(message: string): string | undefined {
  const lower = message.toLowerCase();
  const vibes = [
    "chill",
    "low key",
    "lively",
    "family",
    "romantic",
    "outdoor",
    "indoor",
    "free",
    "comedy",
    "jazz",
    "rock",
    "dance",
    "market",
  ];
  const found = vibes.find((v) => lower.includes(v));
  return found;
}

const CATEGORY_KEYWORDS = [
  "food",
  "drink",
  "dining",
  "cuisine",
  "restaurant",
  "tasting",
  "market",
  "festival",
  "wine",
  "beer",
  "cocktail",
  "brunch",
  "comedy",
  "music",
  "concert",
  "gig",
  "theatre",
  "play",
  "musical",
  "dance",
  "art",
  "exhibition",
  "workshop",
  "class",
  "family",
  "sports",
  "outdoor",
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function detectCategories(
  message: string,
  categories: Array<{ id: number | string; name: string; url_slug?: string }>
): { ids?: string; names?: string[] } {
  if (!categories || categories.length === 0) return {};

  const normalizedMessage = normalizeText(message);
  const tokens = new Set(normalizedMessage.split(" ").filter(Boolean));
  const wantedKeywords = CATEGORY_KEYWORDS.filter((kw) => tokens.has(kw));

  if (tokens.has("food") || tokens.has("drink") || tokens.has("dining")) {
    wantedKeywords.push("festival", "lifestyle", "market");
  }

  const scored = categories
    .map((category) => {
      const name = normalizeText(category.name);
      let score = 0;

      if (name && normalizedMessage.includes(name)) score += 5;
      for (const kw of wantedKeywords) {
        if (name.includes(kw)) score += 2;
      }
      for (const token of tokens) {
        if (token.length > 3 && name.includes(token)) score += 1;
      }

      return {
        category,
        score,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return {};

  return {
    ids: scored.map((entry) => String(entry.category.id)).join(","),
    names: scored.map((entry) => entry.category.name),
  };
}

function matchCategoriesFromNames(
  names: string[] | undefined,
  categories: Array<{ id: number | string; name: string; url_slug?: string }>
): { ids?: string; names?: string[] } | null {
  if (!names || names.length === 0) return null;
  const normalizedNames = names.map(normalizeText);
  const matched = categories.filter((category) =>
    normalizedNames.includes(normalizeText(category.name))
  );
  if (matched.length === 0) return null;
  return {
    ids: matched.map((cat) => String(cat.id)).join(","),
    names: matched.map((cat) => cat.name),
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripNoise(message: string, locationHints: Array<{ name: string; slug: string }>): string {
  let cleaned = message;
  for (const loc of locationHints) {
    const pattern = new RegExp(`\\b${escapeRegExp(loc.name)}\\b`, "ig");
    cleaned = cleaned.replace(pattern, " ");
  }

  return cleaned
    .replace(/\b(in|near|around)\b/g, " ")
    .replace(/\b(today|tonight|this\s+week|this\s+weekend|weekend|future|upcoming|next\s+week)\b/g, " ")
    .replace(/\b(under|below|less\s+than)\s*\$?\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildWhyThis(intent: AgentIntent): string {
  const reasons: string[] = [];
  if (intent.location) reasons.push("near you");
  if (intent.dateFilter === "today") reasons.push("happening today");
  if (intent.dateFilter === "this_weekend") reasons.push("this weekend");
  if (intent.dateFilter === "this_week") reasons.push("this week");
  if (intent.categoryNames?.length) reasons.push(`in ${intent.categoryNames[0]}`);
  if (intent.vibe) reasons.push(`matches ${intent.vibe} vibes`);
  if (intent.budget) reasons.push(`within ~$${intent.budget}`);
  if (reasons.length === 0) return "Recommended based on your chat";
  return `Picked because it's ${reasons.join(" and ")}.`;
}

function buildAssistantMessage(recommendations: AgentRecommendation[], intent: AgentIntent): string {
  if (recommendations.length === 0) {
    return "I couldn't find a strong match yet. Want me to broaden the search or try another vibe?";
  }

  const base = intent.planMode
    ? "Here are a few options that could make a great night."
    : "Here are a few events that fit your vibe.";
  return base;
}

function buildFollowUpQuestion(memory: AgentMemory, intent: AgentIntent): string | undefined {
  if (!memory.location && !intent.location) {
    return "Which city or region in NZ should I look in?";
  }
  if (!memory.dateFilter && !intent.dateFilter) {
    return "When should this happen? (today, this week, this weekend, or upcoming)";
  }
  return undefined;
}

function mergeIntent(
  memory: AgentMemory,
  context: AgentContext | undefined,
  message: string,
  locationHints: Array<{ name: string; slug: string }>,
  categoryHints: Array<{ id: number | string; name: string; url_slug?: string }>,
  override?: AgentIntentOverride
): AgentIntent {
  const location =
    override?.location ||
    detectLocation(message, locationHints) ||
    context?.location ||
    memory.location;
  const dateFilter =
    override?.dateFilter ||
    detectDateFilter(message) ||
    context?.dateFilter ||
    memory.dateFilter ||
    "future";
  const budget = override?.budget ?? detectBudget(message) ?? memory.budget;
  const vibe = override?.vibe || detectVibe(message) || memory.vibe;
  const query = override?.query || stripNoise(message, locationHints) || memory.query || message;
  const categoryMatch =
    matchCategoriesFromNames(override?.categoryNames, categoryHints) ??
    detectCategories(message, categoryHints);
  const planMode = /plan\s+my\s+(night|evening|friday)/i.test(message);

  return {
    location,
    dateFilter,
    budget,
    vibe,
    query,
    planMode,
    categoryIds: categoryMatch.ids || memory.lastCategoryIds,
    categoryNames: categoryMatch.names,
  };
}

export async function runAgent(
  sessionId: string,
  message: string,
  context: AgentContext | undefined,
  fetchEvents: FetchEvents,
  locationHints: Array<{ name: string; slug: string }> = LOCATION_KEYWORDS,
  categoryHints: Array<{ id: number | string; name: string; url_slug?: string }> = [],
  override?: AgentIntentOverride
): Promise<AgentResponse> {
  const memory = getMemory(sessionId);
  const intent = mergeIntent(memory, context, message, locationHints, categoryHints, override);

  const nextMemory = updateMemory(sessionId, {
    location: intent.location,
    dateFilter: intent.dateFilter,
    budget: intent.budget,
    vibe: intent.vibe,
    query: intent.query,
    lastCategoryIds: intent.categoryIds,
  });

  const followUpQuestion = buildFollowUpQuestion(memory, intent);
  if (followUpQuestion && !intent.location) {
    return {
      assistantMessage: "I can help with that.",
      followUpQuestion,
      recommendations: [],
      memory: nextMemory,
    };
  }

  if (!intent.location) {
    return {
      assistantMessage: "Tell me which city or region in NZ to search.",
      followUpQuestion,
      recommendations: [],
      memory: nextMemory,
    };
  }

  const recommendations = await fetchEvents({
    location: intent.location,
    dateFilter: intent.dateFilter || "future",
    query: intent.query,
    limit: 10,
    categoryIds: intent.categoryIds,
  });

  const withWhy = recommendations.map((rec) => ({
    ...rec,
    whyThis: rec.whyThis || buildWhyThis(intent),
  }));

  return {
    assistantMessage: buildAssistantMessage(withWhy, intent),
    recommendations: withWhy,
    followUpQuestion,
    memory: nextMemory,
  };
}
