import {
  AgentContext,
  AgentMemory,
  AgentQuickAction,
  AgentRecommendation,
  AgentResponse,
} from "@/types/Agent";
import { EventDateFilter } from "@/types/Event";
import { getMemory, updateMemory } from "@/utils/agent/memory";

interface AgentIntent {
  location?: string;
  dateFilter: EventDateFilter;
  budget?: number;
  vibe?: string;
  query?: string;
  planMode: boolean;
  categoryIds?: string;
  categoryNames?: string[];
  excludeTerms: string[];
  indoorPreference?: "indoor" | "outdoor";
  freeOnly?: boolean;
}

export interface AgentIntentOverride {
  location?: string;
  dateFilter?: EventDateFilter;
  budget?: number;
  vibe?: string;
  query?: string;
  categoryNames?: string[];
  excludeTerms?: string[];
  indoorPreference?: "indoor" | "outdoor";
  freeOnly?: boolean;
  planMode?: boolean;
}

interface FetchEventsParams {
  location: string;
  dateFilter: EventDateFilter;
  query?: string;
  limit?: number;
  categoryIds?: string;
}

type FetchEvents = (params: FetchEventsParams) => Promise<AgentRecommendation[]>;

type LocationHint = { name: string; slug: string };
type CategoryHint = { id: number | string; name: string; url_slug?: string };
type SearchConcept =
  | "arts"
  | "comedy"
  | "dance"
  | "family"
  | "food_drink"
  | "live_music"
  | "markets"
  | "outdoor"
  | "performance"
  | "sports"
  | "workshops";

interface SearchAttemptResult {
  recommendations: AgentRecommendation[];
  fallbackApplied: boolean;
  fallbackReason?: string;
}

const LOCATION_KEYWORDS: LocationHint[] = [
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
  "arts",
  "exhibition",
  "gallery",
  "galleries",
  "culture",
  "workshop",
  "class",
  "family",
  "sports",
  "outdoor",
];

const QUERY_STOP_WORDS = new Set([
  "a",
  "actually",
  "also",
  "an",
  "and",
  "any",
  "anyway",
  "around",
  "at",
  "bit",
  "but",
  "can",
  "could",
  "dollar",
  "dollars",
  "etc",
  "event",
  "events",
  "find",
  "for",
  "get",
  "i",
  "im",
  "in",
  "instead",
  "it",
  "just",
  "keep",
  "kind",
  "kinda",
  "like",
  "looking",
  "make",
  "maybe",
  "me",
  "more",
  "my",
  "night",
  "of",
  "only",
  "or",
  "plan",
  "please",
  "rather",
  "related",
  "same",
  "show",
  "something",
  "sort",
  "still",
  "switch",
  "that",
  "the",
  "them",
  "those",
  "to",
  "too",
  "want",
  "with",
  "would",
  "yeah",
  "yes",
]);

const OUTDOOR_HINTS = [
  "outdoor",
  "park",
  "garden",
  "beach",
  "waterfront",
  "street",
  "festival",
  "market",
  "trail",
  "hike",
  "walk",
  "stadium",
  "reserve",
  "harbour",
  "harbor",
];

const CONCEPT_RULES: Array<{
  concept: SearchConcept;
  patterns: RegExp[];
  categoryKeywords: string[];
  queryCandidates: string[];
  useTextQuery: boolean;
}> = [
  {
    concept: "live_music",
    patterns: [/\blive music\b/i, /\bgigs?\b/i, /\bconcerts?\b/i, /\bbands?\b/i, /\bjazz\b/i],
    categoryKeywords: ["concert", "gig", "music", "performing", "festival"],
    queryCandidates: ["live music", "concert", "gig"],
    useTextQuery: true,
  },
  {
    concept: "arts",
    patterns: [/\barts?\b/i, /\bgaller(?:y|ies)\b/i, /\bexhibitions?\b/i, /\bculture\b/i, /\bmuseum\b/i],
    categoryKeywords: ["art", "arts", "culture", "exhibition", "gallery", "museum"],
    queryCandidates: ["art", "exhibition", "gallery"],
    useTextQuery: false,
  },
  {
    concept: "comedy",
    patterns: [/\bcomedy\b/i, /\bcomedian\b/i, /\bfunny\b/i, /\bstand[-\s]?up\b/i],
    categoryKeywords: ["comedy", "performing"],
    queryCandidates: ["comedy", "stand up"],
    useTextQuery: true,
  },
  {
    concept: "food_drink",
    patterns: [
      /\bfood\b/i,
      /\bdrink(?:s)?\b/i,
      /\bdining\b/i,
      /\bwine\b/i,
      /\bbeer\b/i,
      /\bcocktails?\b/i,
      /\bbrunch\b/i,
      /\btastings?\b/i,
    ],
    categoryKeywords: ["food", "wine", "beer", "gourmet", "lifestyle", "market", "festival"],
    queryCandidates: ["food", "wine", "beer"],
    useTextQuery: false,
  },
  {
    concept: "family",
    patterns: [/\bfamily\b/i, /\bkids?\b/i, /\bchildren\b/i, /\bwhanau\b/i, /\bwhānau\b/i],
    categoryKeywords: ["family", "kids", "children", "workshop", "festival"],
    queryCandidates: ["family", "kids"],
    useTextQuery: false,
  },
  {
    concept: "markets",
    patterns: [/\bmarkets?\b/i, /\bstalls?\b/i, /\bcraft fair\b/i],
    categoryKeywords: ["market", "fair", "festival", "lifestyle"],
    queryCandidates: ["market"],
    useTextQuery: true,
  },
  {
    concept: "outdoor",
    patterns: [/\boutdoors?\b/i, /\boutside\b/i, /\bopen[-\s]?air\b/i, /\bparks?\b/i, /\bgardens?\b/i],
    categoryKeywords: ["festival", "market", "sport", "outdoor", "lifestyle", "garden", "walk"],
    queryCandidates: ["festival", "market", "garden"],
    useTextQuery: false,
  },
  {
    concept: "sports",
    patterns: [/\bsports?\b/i, /\bfitness\b/i, /\brun(?:ning)?\b/i, /\bwalk(?:ing)?\b/i, /\bhik(?:e|ing)\b/i],
    categoryKeywords: ["sport", "outdoor", "fitness", "race", "walk"],
    queryCandidates: ["sport", "walk"],
    useTextQuery: false,
  },
  {
    concept: "performance",
    patterns: [/\btheat(?:re|er)\b/i, /\bplays?\b/i, /\bmusicals?\b/i, /\bperformances?\b/i, /\bshows?\b/i],
    categoryKeywords: ["performing", "theatre", "musical", "dance"],
    queryCandidates: ["theatre", "performance"],
    useTextQuery: false,
  },
  {
    concept: "dance",
    patterns: [/\bdance\b/i, /\bclub\b/i, /\bdj\b/i, /\brave\b/i],
    categoryKeywords: ["dance", "music", "performing"],
    queryCandidates: ["dance", "dj"],
    useTextQuery: true,
  },
  {
    concept: "workshops",
    patterns: [/\bworkshops?\b/i, /\bclasses?\b/i, /\blearn\b/i],
    categoryKeywords: ["workshop", "class", "education"],
    queryCandidates: ["workshop", "class"],
    useTextQuery: false,
  },
];

const QUERY_AS_CONSTRAINT_ONLY = new Set([
  "art",
  "arts",
  "cheap",
  "chill",
  "family",
  "free",
  "indoor",
  "indoors",
  "low key",
  "low-key",
  "outdoor",
  "outdoors",
  "quiet",
  "relaxed",
]);

const VIBE_PATTERNS: Array<{ value: string; patterns: RegExp[] }> = [
  {
    value: "low-key",
    patterns: [/\blow[\s-]?key\b/i, /\bchill\b/i, /\brelaxed\b/i, /\bquiet\b/i],
  },
  {
    value: "live music",
    patterns: [/\blive music\b/i, /\bgig\b/i, /\bconcert\b/i, /\bmusic\b/i],
  },
  {
    value: "comedy",
    patterns: [/\bcomedy\b/i, /\bfunny\b/i],
  },
  {
    value: "family",
    patterns: [/\bfamily\b/i, /\bkids\b/i, /\bchildren\b/i],
  },
  {
    value: "romantic",
    patterns: [/\bromantic\b/i, /\bdate night\b/i, /\bdate\b/i],
  },
  {
    value: "outdoor",
    patterns: [/\boutdoor\b/i, /\boutdoors\b/i],
  },
  {
    value: "indoor",
    patterns: [/\bindoor\b/i, /\bindoors\b/i, /\binside\b/i],
  },
  {
    value: "dance",
    patterns: [/\bdance\b/i, /\bclub\b/i],
  },
  {
    value: "art",
    patterns: [/\bart\b/i, /\bexhibition\b/i, /\bgallery\b/i],
  },
];

function toLocationSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeLocationName(value: string): string {
  return normalizeText(value).replace(/-/g, " ");
}

function buildLocationAliases(name: string): string[] {
  const normalized = normalizeLocationName(name);
  const aliases = new Set<string>([normalized]);

  aliases.add(
    normalized
      .replace(/\b(region|district|city)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

  for (const part of normalized.split("/")) {
    const cleaned = part.trim();
    if (cleaned) {
      aliases.add(cleaned);
    }
  }

  return Array.from(aliases).filter(Boolean);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    const normalized = normalizeText(value);
    if (!normalized) continue;
    seen.add(normalized);
  }
  return Array.from(seen);
}

function uniqueConcepts(values: Array<SearchConcept | undefined | null>): SearchConcept[] {
  const seen = new Set<SearchConcept>();
  for (const value of values) {
    if (value) {
      seen.add(value);
    }
  }
  return Array.from(seen);
}

function detectSearchConcepts(text: string): SearchConcept[] {
  if (!text.trim()) {
    return [];
  }

  return CONCEPT_RULES.filter((rule) =>
    rule.patterns.some((pattern) => pattern.test(text))
  ).map((rule) => rule.concept);
}

function conceptsFromCategoryNames(names: string[] | undefined): SearchConcept[] {
  if (!names?.length) {
    return [];
  }

  return detectSearchConcepts(names.join(" "));
}

function conceptsFromVibe(vibe?: string): SearchConcept[] {
  if (!vibe) {
    return [];
  }

  if (vibe === "outdoor") {
    return ["outdoor"];
  }
  if (vibe === "indoor") {
    return [];
  }
  if (vibe === "art") {
    return ["arts"];
  }
  if (vibe === "live music") {
    return ["live_music"];
  }

  return detectSearchConcepts(vibe);
}

function detectLocation(
  message: string,
  locationHints: LocationHint[]
): string | undefined {
  const lower = message.toLowerCase();
  for (const loc of locationHints) {
    for (const alias of buildLocationAliases(loc.name)) {
      const pattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i");
      if (pattern.test(lower)) return loc.slug;
    }
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
  if (/(this\s+weekend|weekend|friday night|saturday night)/.test(lower)) {
    return "this_weekend";
  }
  if (/(this\s+week)/.test(lower)) return "this_week";
  if (/(future|upcoming|next\s+week)/.test(lower)) return "future";
  return undefined;
}

function detectBudget(message: string): number | undefined {
  const match = message.match(
    /(?:\$|under|below|less\s+than|max|maximum|budget\s+of)\s*\$?(\d{1,4})/i
  );
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

function detectVibe(message: string): string | undefined {
  const normalized = normalizeText(message);
  for (const entry of VIBE_PATTERNS) {
    const negativePattern = new RegExp(
      `\\b(?:no|not|without|avoid|skip)\\s+${escapeRegExp(normalizeText(entry.value))}\\b`,
      "i"
    );
    if (negativePattern.test(normalized)) {
      continue;
    }

    if (entry.patterns.some((pattern) => pattern.test(message))) {
      return entry.value;
    }
  }
  return undefined;
}

function detectPlanMode(message: string): boolean {
  return /(plan\s+my\s+(night|evening|friday|saturday)|night\s+plan|build\s+me\s+a\s+night|date\s+night)/i.test(
    message
  );
}

function detectFreeOnly(message: string): boolean | undefined {
  if (/\bfree only\b/i.test(message)) return true;
  if (/\bfree\b/i.test(message)) return true;
  return undefined;
}

function detectIndoorPreference(
  message: string
): "indoor" | "outdoor" | undefined {
  if (
    /(no\s+outdoor|avoid\s+outdoor|not\s+outdoor|indoors?\s+only|inside\s+only)/i.test(
      message
    )
  ) {
    return "indoor";
  }

  if (/(no\s+indoor|avoid\s+indoor|outdoors?\s+only|outside\s+only)/i.test(message)) {
    return "outdoor";
  }

  if (/\b(outdoors?|outside|open[-\s]?air|al fresco|alfresco)\b/i.test(message)) {
    return "outdoor";
  }

  if (/\b(indoors?|inside)\b/i.test(message)) {
    return "indoor";
  }

  return undefined;
}

function cleanExcludedTerm(value: string): string | null {
  const tokens = normalizeText(value)
    .split(" ")
    .filter(
      (token) =>
        token &&
        ![
          "event",
          "events",
          "please",
          "thanks",
          "thank",
          "you",
          "anything",
          "something",
          "options",
          "option",
          "under",
          "over",
          "with",
          "without",
          "only",
          "budget",
          "around",
          "about",
        ].includes(token)
    )
    .slice(0, 2);

  return tokens.length > 0 ? tokens.join(" ") : null;
}

function detectExcludeTerms(message: string): string[] {
  const normalized = normalizeText(message);
  const found = new Set<string>();
  const patterns = [
    /\b(?:no|not|without|avoid|skip)\s+([a-z0-9-]+(?:\s+[a-z0-9-]+){0,2})/g,
    /\banything but\s+([a-z0-9-]+(?:\s+[a-z0-9-]+){0,2})/g,
  ];

  for (const pattern of patterns) {
    for (const match of normalized.matchAll(pattern)) {
      const value = cleanExcludedTerm(match[1]);
      if (value) {
        found.add(value);
      }
    }
  }

  if (/no outdoor|avoid outdoor|not outdoor/i.test(message)) {
    found.add("outdoor");
  }
  if (/no indoor|avoid indoor|not indoor/i.test(message)) {
    found.add("indoor");
  }

  return Array.from(found);
}

function detectCategories(
  message: string,
  categories: CategoryHint[]
): { ids?: string; names?: string[] } {
  if (!categories || categories.length === 0) return {};

  const normalizedMessage = normalizeText(message);
  const tokens = new Set(normalizedMessage.split(" ").filter(Boolean));
  const wantedKeywords = CATEGORY_KEYWORDS.filter((keyword) => tokens.has(keyword));

  if (tokens.has("food") || tokens.has("drink") || tokens.has("dining")) {
    wantedKeywords.push("festival", "lifestyle", "market");
  }

  const scored = categories
    .map((category) => {
      const name = normalizeText(category.name);
      let score = 0;

      if (name && normalizedMessage.includes(name)) score += 5;
      for (const keyword of wantedKeywords) {
        if (name.includes(keyword)) score += 2;
      }
      for (const token of tokens) {
        if (token.length > 3 && name.includes(token)) score += 1;
      }

      return { category, score };
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
  categories: CategoryHint[]
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

function stripNoise(message: string, locationHints: LocationHint[]): string {
  let cleaned = message;
  for (const loc of locationHints) {
    for (const alias of buildLocationAliases(loc.name)) {
      const pattern = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "ig");
      cleaned = cleaned.replace(pattern, " ");
    }
  }

  return cleaned
    .replace(/\b(in|near|around|at)\b/g, " ")
    .replace(
      /\b(today|tonight|this\s+week|this\s+weekend|weekend|future|upcoming|next\s+week|tomorrow)\b/g,
      " "
    )
    .replace(/\b(under|below|less\s+than|max|maximum)\s*\$?\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanQueryText(value: string): string | undefined {
  const meaningfulTokens = normalizeText(value)
    .split(" ")
    .filter((token) => token && !QUERY_STOP_WORDS.has(token));

  return meaningfulTokens.length > 0 ? meaningfulTokens.join(" ") : undefined;
}

function buildQuery(
  message: string,
  locationHints: LocationHint[],
  previousQuery?: string
): string | undefined {
  const cleaned = stripNoise(message, locationHints)
    .replace(
      /\b(plan my night|night plan|show me|find me|looking for|i want|id like|i'd like|please|events?)\b/gi,
      " "
    )
    .replace(
      /\b(actually|instead|rather|same but|but actually|also|can you|could you|maybe|just|make it|keep it|switch to|change to|more|less|still|related|etc)\b/gi,
      " "
    )
    .replace(
      /\b(no|not|without|avoid|skip)\s+(outdoor|indoor|family|kids|children|sports|market|markets|dance|comedy|loud|crowded|alcohol|drinking)\b/gi,
      " "
    )
    .replace(/\b(outdoors?|outside|indoors?|inside|open[-\s]?air|al fresco|alfresco)\b/gi, " ")
    .replace(/\b(indoors?\s+only|outdoors?\s+only|free only)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanQueryText(cleaned) || previousQuery;
}

function formatLocationLabel(location?: string): string {
  if (!location) return "NZ";
  return location
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateLabel(dateFilter: EventDateFilter): string {
  switch (dateFilter) {
    case "today":
      return "today";
    case "this_week":
      return "this week";
    case "this_weekend":
      return "this weekend";
    default:
      return "upcoming";
  }
}

function buildHaystack(rec: AgentRecommendation): string {
  return normalizeText(
    [rec.title, rec.location, rec.category, rec.description, rec.datetime]
      .filter(Boolean)
      .join(" ")
  );
}

function looksOutdoor(rec: AgentRecommendation): boolean {
  const haystack = buildHaystack(rec);
  return OUTDOOR_HINTS.some((hint) => haystack.includes(hint));
}

function parseStartDate(rec: AgentRecommendation): Date | null {
  if (!rec.startsAt) return null;
  const date = new Date(rec.startsAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseEndDate(rec: AgentRecommendation): Date | null {
  if (!rec.endsAt) return null;
  const date = new Date(rec.endsAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parsePrice(rec: AgentRecommendation): number | undefined {
  if (typeof rec.priceValue === "number" && Number.isFinite(rec.priceValue)) {
    return rec.priceValue;
  }

  if (!rec.price) return undefined;
  const matches = Array.from(rec.price.matchAll(/\d+(?:\.\d+)?/g)).map((match) =>
    Number(match[0])
  );
  if (matches.length === 0) return undefined;
  return Math.min(...matches);
}

function sharesQuerySignal(rec: AgentRecommendation, query?: string): boolean {
  if (!query) return false;
  const haystack = buildHaystack(rec);
  const tokens = normalizeText(query)
    .split(" ")
    .filter((token) => token.length > 2 && !QUERY_STOP_WORDS.has(token));
  return tokens.some((token) => haystack.includes(token));
}

function recommendationMatchesIntent(rec: AgentRecommendation, intent: AgentIntent): boolean {
  if (intent.freeOnly && !rec.isFree) {
    return false;
  }

  const price = parsePrice(rec);
  if (
    typeof intent.budget === "number" &&
    typeof price === "number" &&
    price > intent.budget
  ) {
    return false;
  }

  if (intent.indoorPreference === "indoor" && looksOutdoor(rec)) {
    return false;
  }

  if (intent.indoorPreference === "outdoor" && !looksOutdoor(rec)) {
    return false;
  }

  const haystack = buildHaystack(rec);
  if (intent.excludeTerms.some((term) => haystack.includes(normalizeText(term)))) {
    return false;
  }

  return true;
}

function scoreRecommendation(rec: AgentRecommendation, intent: AgentIntent): number {
  let score = 0;
  const haystack = buildHaystack(rec);

  if (intent.query) {
    for (const token of normalizeText(intent.query)
      .split(" ")
      .filter((value) => value.length > 2 && !QUERY_STOP_WORDS.has(value))) {
      if (haystack.includes(token)) {
        score += token.length > 5 ? 2 : 1;
      }
    }
  }

  if (intent.categoryNames?.length) {
    for (const categoryName of intent.categoryNames) {
      if (normalizeText(rec.category || "").includes(normalizeText(categoryName))) {
        score += 4;
      }
    }
  }

  if (intent.vibe && haystack.includes(normalizeText(intent.vibe))) {
    score += 3;
  }

  if (intent.freeOnly && rec.isFree) {
    score += 4;
  }

  const price = parsePrice(rec);
  if (
    typeof intent.budget === "number" &&
    typeof price === "number" &&
    price <= intent.budget
  ) {
    score += 2;
  }

  if (intent.indoorPreference === "indoor" && !looksOutdoor(rec)) {
    score += 2;
  }

  if (intent.indoorPreference === "outdoor" && looksOutdoor(rec)) {
    score += 2;
  }

  if (rec.isFree) score += 1;
  if (rec.image) score += 0.5;
  if (rec.url) score += 0.5;

  return score;
}

function rankRecommendations(
  recommendations: AgentRecommendation[],
  intent: AgentIntent
): AgentRecommendation[] {
  return [...recommendations].sort((a, b) => {
    const scoreDiff = scoreRecommendation(b, intent) - scoreRecommendation(a, intent);
    if (scoreDiff !== 0) return scoreDiff;

    const startA = parseStartDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const startB = parseStartDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return startA - startB;
  });
}

function dedupeRecommendations(
  recommendations: AgentRecommendation[]
): AgentRecommendation[] {
  const seen = new Set<string>();
  return recommendations.filter((rec) => {
    if (seen.has(rec.id)) return false;
    seen.add(rec.id);
    return true;
  });
}

function findCategoriesByKeywords(
  keywords: string[],
  categoryHints: CategoryHint[]
): { ids?: string; names?: string[] } {
  const scored = categoryHints
    .map((category) => {
      const name = normalizeText(category.name);
      let score = 0;

      for (const keyword of keywords.map(normalizeText)) {
        if (!keyword) continue;
        if (name.includes(keyword)) score += 3;
        if (keyword.includes(name)) score += 1;
      }

      return { category, score };
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

function findCategoriesByConcepts(
  concepts: SearchConcept[],
  categoryHints: CategoryHint[]
): { ids?: string; names?: string[] } {
  const keywords = concepts.flatMap((concept) => {
    const rule = CONCEPT_RULES.find((entry) => entry.concept === concept);
    return rule?.categoryKeywords || [];
  });

  return findCategoriesByKeywords(keywords, categoryHints);
}

function queryIsOnlySoftPreference(query: string, concepts: SearchConcept[]): boolean {
  const tokens = normalizeText(query)
    .split(" ")
    .filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  if (tokens.every((token) => QUERY_AS_CONSTRAINT_ONLY.has(token))) {
    return true;
  }

  const conceptWords = concepts.flatMap((concept) => {
    const rule = CONCEPT_RULES.find((entry) => entry.concept === concept);
    return [
      concept.replace(/_/g, " "),
      ...(rule?.categoryKeywords || []),
      ...(rule?.queryCandidates || []),
    ].flatMap((value) => normalizeText(value).split(" "));
  });

  const conceptWordSet = new Set(conceptWords.filter(Boolean));
  return tokens.every((token) => conceptWordSet.has(token));
}

function chooseSemanticQuery(params: {
  explicitQuery?: string;
  concepts: SearchConcept[];
  hasCategoryMatch: boolean;
}): string | undefined {
  const explicitQuery = params.explicitQuery ? cleanQueryText(params.explicitQuery) : undefined;
  if (explicitQuery && (!params.hasCategoryMatch || !queryIsOnlySoftPreference(explicitQuery, params.concepts))) {
    return explicitQuery;
  }

  const queryConcept = params.concepts
    .map((concept) => CONCEPT_RULES.find((rule) => rule.concept === concept))
    .find((rule) => rule?.useTextQuery && rule.queryCandidates.length > 0);

  if (queryConcept && !params.hasCategoryMatch) {
    return queryConcept.queryCandidates[0];
  }

  return undefined;
}

function getFallbackCategories(
  intent: AgentIntent,
  categoryHints: CategoryHint[]
): { ids?: string; names?: string[] } {
  const text = normalizeText(
    [intent.query, intent.vibe, ...(intent.categoryNames || [])].filter(Boolean).join(" ")
  );
  const concepts = uniqueConcepts([
    ...detectSearchConcepts(text),
    ...conceptsFromVibe(intent.vibe),
    ...conceptsFromCategoryNames(intent.categoryNames),
  ]);
  const semanticMatch = findCategoriesByConcepts(concepts, categoryHints);
  if (semanticMatch.ids) {
    return semanticMatch;
  }

  const keywords: string[] = [];

  if (/(music|gig|concert|jazz|rock)/.test(text)) {
    keywords.push("concert", "music", "performing", "festival");
  }
  if (/(comedy|funny)/.test(text)) {
    keywords.push("comedy", "performing", "festival");
  }
  if (/(food|drink|dining|wine|beer|cocktail|brunch)/.test(text)) {
    keywords.push("food", "festival", "lifestyle", "market");
  }
  if (/(art|gallery|exhibition)/.test(text)) {
    keywords.push("art", "exhibition", "workshop");
  }
  if (/(family|kids|children)/.test(text)) {
    keywords.push("family", "festival", "workshop", "exhibition");
  }

  if (keywords.length === 0 && intent.categoryNames?.length) {
    keywords.push(...intent.categoryNames);
  }

  return findCategoriesByKeywords(keywords, categoryHints);
}

function buildBroadQuery(intent: AgentIntent): string | undefined {
  const text = normalizeText([intent.query, intent.vibe].filter(Boolean).join(" "));
  const concepts = uniqueConcepts([
    ...detectSearchConcepts(text),
    ...conceptsFromVibe(intent.vibe),
  ]);
  const queryConcept = concepts
    .map((concept) => CONCEPT_RULES.find((rule) => rule.concept === concept))
    .find((rule) => rule?.useTextQuery && rule.queryCandidates.length > 0);

  if (queryConcept) {
    return queryConcept.queryCandidates[0];
  }

  if (/(music|gig|concert|jazz|rock)/.test(text)) return "live music";
  if (/(comedy|funny)/.test(text)) return "comedy";
  return undefined;
}

async function searchWithFallbacks(
  intent: AgentIntent,
  fetchEvents: FetchEvents,
  categoryHints: CategoryHint[]
): Promise<SearchAttemptResult> {
  const targetCount = intent.planMode ? 3 : 4;
  const limit = intent.planMode ? 18 : 12;
  const fallbackCategories = getFallbackCategories(intent, categoryHints);
  const broadQuery = buildBroadQuery(intent);

  const attempts: Array<{
    params: FetchEventsParams;
    fallbackReason?: string;
  }> = [
    {
      params: {
        location: intent.location!,
        dateFilter: intent.dateFilter,
        query: intent.query,
        limit,
        categoryIds: intent.categoryIds,
      },
    },
  ];

  if (intent.categoryIds) {
    attempts.push({
      params: {
        location: intent.location!,
        dateFilter: intent.dateFilter,
        query: intent.query,
        limit,
      },
      fallbackReason: "I dropped the narrow category filter to avoid a dead end.",
    });
  }

  if (fallbackCategories.ids && fallbackCategories.ids !== intent.categoryIds) {
    attempts.push({
      params: {
        location: intent.location!,
        dateFilter: intent.dateFilter,
        query: broadQuery,
        limit,
        categoryIds: fallbackCategories.ids,
      },
      fallbackReason: `I widened the search into nearby categories like ${fallbackCategories.names?.join(
        ", "
      )}.`,
    });
  }

  if (broadQuery && broadQuery !== intent.query) {
    attempts.push({
      params: {
        location: intent.location!,
        dateFilter: intent.dateFilter,
        query: broadQuery,
        limit,
      },
      fallbackReason: `Exact matches were thin, so I broadened it to ${broadQuery}.`,
    });
  }

  if (intent.dateFilter === "today") {
    attempts.push({
      params: {
        location: intent.location!,
        dateFilter: "this_week",
        query: broadQuery || intent.query,
        limit,
        categoryIds: intent.categoryIds,
      },
      fallbackReason: "Nothing strong showed up for today, so I widened it to this week.",
    });
  }

  let allRecommendations: AgentRecommendation[] = [];
  let fallbackApplied = false;
  let fallbackReason: string | undefined;

  for (const attempt of attempts) {
    const fetched = await fetchEvents(attempt.params);
    const filtered = fetched.filter((rec) => recommendationMatchesIntent(rec, intent));
    const ranked = rankRecommendations(filtered, intent);
    allRecommendations = dedupeRecommendations([...allRecommendations, ...ranked]);

    if (attempt.fallbackReason && ranked.length > 0) {
      fallbackApplied = true;
      fallbackReason = attempt.fallbackReason;
    }

    if (allRecommendations.length >= targetCount) {
      break;
    }
  }

  return {
    recommendations: allRecommendations,
    fallbackApplied,
    fallbackReason,
  };
}

function haversineKm(a: AgentRecommendation, b: AgentRecommendation): number | undefined {
  if (
    typeof a.latitude !== "number" ||
    typeof a.longitude !== "number" ||
    typeof b.latitude !== "number" ||
    typeof b.longitude !== "number"
  ) {
    return undefined;
  }

  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return earthRadiusKm * c;
}

function estimateEndTime(rec: AgentRecommendation): Date | null {
  const end = parseEndDate(rec);
  if (end) return end;

  const start = parseStartDate(rec);
  if (!start) return null;

  const fallback = new Date(start);
  fallback.setHours(fallback.getHours() + 2);
  return fallback;
}

function getGapMinutes(previous: AgentRecommendation, next: AgentRecommendation): number | null {
  const previousEnd = estimateEndTime(previous);
  const nextStart = parseStartDate(next);
  if (!previousEnd || !nextStart) return null;
  return Math.round((nextStart.getTime() - previousEnd.getTime()) / 60000);
}

function scorePlanTransition(previous: AgentRecommendation, next: AgentRecommendation): number {
  const gapMinutes = getGapMinutes(previous, next);
  if (gapMinutes === null) return 0;
  if (gapMinutes < 15) return -6;
  if (gapMinutes < 45) return -2;
  if (gapMinutes <= 180) return 4;
  if (gapMinutes <= 300) return 2;
  return -1;
}

function scorePlanTravel(previous: AgentRecommendation, next: AgentRecommendation): number {
  const distanceKm = haversineKm(previous, next);
  if (typeof distanceKm !== "number") return 0;
  if (distanceKm <= 1) return 3;
  if (distanceKm <= 3) return 2;
  if (distanceKm <= 6) return 1;
  if (distanceKm <= 10) return -1;
  return -3;
}

function formatPlanTime(dateValue?: string): string {
  if (!dateValue) return "Time TBC";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Time TBC";
  return date.toLocaleTimeString("en-NZ", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildWhyThis(
  recommendation: AgentRecommendation,
  intent: AgentIntent,
  options?: { fallbackApplied?: boolean }
): string {
  const reasons: string[] = [];
  const haystack = buildHaystack(recommendation);

  if (intent.query && sharesQuerySignal(recommendation, intent.query)) {
    reasons.push("it lines up with what you asked for");
  }

  if (
    intent.categoryNames?.length &&
    normalizeText(recommendation.category || "").includes(
      normalizeText(intent.categoryNames[0])
    )
  ) {
    reasons.push(`it stays close to ${intent.categoryNames[0].toLowerCase()}`);
  }

  if (intent.vibe && haystack.includes(normalizeText(intent.vibe))) {
    reasons.push(`it keeps the ${intent.vibe} vibe`);
  }

  const price = parsePrice(recommendation);
  if (intent.freeOnly && recommendation.isFree) {
    reasons.push("it stays free");
  } else if (
    typeof intent.budget === "number" &&
    typeof price === "number" &&
    price <= intent.budget
  ) {
    reasons.push(`it stays under about $${intent.budget}`);
  }

  if (intent.indoorPreference === "indoor" && !looksOutdoor(recommendation)) {
    reasons.push("it leans indoor");
  }

  if (intent.indoorPreference === "outdoor" && looksOutdoor(recommendation)) {
    reasons.push("it keeps the outdoor feel");
  }

  if (options?.fallbackApplied) {
    reasons.push("it came from a broader backup search");
  }

  if (reasons.length === 0) {
    return "Picked because it fits the timing and location you gave me.";
  }

  return `Picked because ${reasons.slice(0, 3).join(" and ")}.`;
}

function buildNightPlan(
  recommendations: AgentRecommendation[],
  intent: AgentIntent,
  fallbackReason?: string
): { recommendations: AgentRecommendation[]; summary: string } {
  const candidates = rankRecommendations(
    recommendations.filter((rec) => parseStartDate(rec)),
    intent
  ).slice(0, 10);

  let bestPlan: AgentRecommendation[] = [];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < candidates.length; i += 1) {
    const first = candidates[i];
    const firstScore = scoreRecommendation(first, intent);
    if (firstScore > bestScore) {
      bestPlan = [first];
      bestScore = firstScore;
    }

    for (let j = i + 1; j < candidates.length; j += 1) {
      const second = candidates[j];
      const pairScore =
        firstScore +
        scoreRecommendation(second, intent) +
        scorePlanTransition(first, second) +
        scorePlanTravel(first, second);

      if (pairScore > bestScore) {
        bestPlan = [first, second];
        bestScore = pairScore;
      }

      for (let k = j + 1; k < candidates.length; k += 1) {
        const third = candidates[k];
        const tripleScore =
          pairScore +
          scoreRecommendation(third, intent) +
          scorePlanTransition(second, third) +
          scorePlanTravel(second, third) +
          2;

        if (tripleScore > bestScore) {
          bestPlan = [first, second, third];
          bestScore = tripleScore;
        }
      }
    }
  }

  const selected =
    bestPlan.length >= 2 ? bestPlan : rankRecommendations(recommendations, intent).slice(0, 3);

  const planned = selected.map((rec, index) => {
    const previous = index > 0 ? selected[index - 1] : undefined;
    const distanceKm = previous ? haversineKm(previous, rec) : undefined;
    return {
      ...rec,
      planOrder: index + 1,
      distanceFromPreviousKm: distanceKm,
      whyThis: [
        `Works as stop ${index + 1} in the night.`,
        previous && typeof distanceKm === "number"
          ? `Travel from the previous stop is about ${distanceKm.toFixed(1)} km.`
          : null,
        buildWhyThis(rec, intent),
      ]
        .filter(Boolean)
        .join(" "),
    };
  });

  const lines = ["Here is a simple night plan:"];
  for (const rec of planned) {
    const parts = [
      `${rec.planOrder}. ${formatPlanTime(rec.startsAt)} - ${rec.title}`,
      rec.location,
      rec.price || "price TBC",
    ];
    if (rec.planOrder && rec.planOrder > 1 && typeof rec.distanceFromPreviousKm === "number") {
      parts.push(`${rec.distanceFromPreviousKm.toFixed(1)} km from the last stop`);
    }
    lines.push(parts.join(" | "));
  }

  if (typeof intent.budget === "number") {
    lines.push(`I kept an eye on your budget target of about $${intent.budget}.`);
  }
  if (intent.indoorPreference === "indoor") {
    lines.push("I kept it on the indoor side where possible.");
  }
  if (fallbackReason) {
    lines.push(fallbackReason);
  }

  return {
    recommendations: planned,
    summary: lines.join("\n"),
  };
}

function buildAssistantMessage(
  recommendations: AgentRecommendation[],
  intent: AgentIntent,
  options?: { fallbackReason?: string }
): string {
  if (recommendations.length === 0) {
    if (options?.fallbackReason) {
      return `${options.fallbackReason} I still did not find a strong fit.`;
    }
    return "I couldn't find a strong match yet. Want me to widen the search or switch the vibe?";
  }

  if (intent.planMode) {
    return options?.fallbackReason
      ? `I mapped out a night plan and used a wider backup search to keep it useful.\n${options.fallbackReason}`
      : "I mapped out a simple night plan for you.";
  }

  if (options?.fallbackReason) {
    return `Exact matches were thin, so I widened the search and found these. ${options.fallbackReason}`;
  }

  return "Here are a few events that fit what you asked for.";
}

function buildFollowUpQuestion(
  intent: AgentIntent,
  recommendations: AgentRecommendation[]
): string | undefined {
  if (!intent.location) {
    return "Which city or region in NZ should I look in?";
  }

  if (!intent.query && !intent.categoryIds && !intent.vibe && recommendations.length === 0) {
    return "What kind of night are you after: live music, comedy, food, markets, or something quieter?";
  }

  if (intent.planMode && typeof intent.budget !== "number") {
    return "Do you want me to keep the plan under a specific budget?";
  }

  return undefined;
}

function buildQuickActions(
  intent: AgentIntent,
  recommendations: AgentRecommendation[],
  fallbackApplied: boolean
): AgentQuickAction[] {
  const locationLabel = formatLocationLabel(intent.location);
  const dateLabel = formatDateLabel(intent.dateFilter);
  const actions: AgentQuickAction[] = [];

  const push = (label: string, prompt: string) => {
    if (!actions.some((action) => action.prompt === prompt)) {
      actions.push({ label, prompt });
    }
  };

  if (recommendations.length === 0) {
    push("Live music", `Live music in ${locationLabel} ${dateLabel}`);
    push("Free options", `Free events in ${locationLabel} ${dateLabel}`);
    push("Plan my night", `Plan my night in ${locationLabel} ${dateLabel}`);
    push("Indoor only", `Indoor events only in ${locationLabel} ${dateLabel}`);
    return actions.slice(0, 4);
  }

  if (intent.planMode) {
    push("Make it cheaper", `Plan my night in ${locationLabel} ${dateLabel} under $30`);
    push("Indoor version", `Plan my night in ${locationLabel} ${dateLabel} with no outdoor events`);
    push("Live music plan", `Plan my night around live music in ${locationLabel} ${dateLabel}`);
    return actions.slice(0, 3);
  }

  push("Plan my night", `Plan my night in ${locationLabel} ${dateLabel}`);
  push("Free only", `Free events in ${locationLabel} ${dateLabel}`);
  push("Indoor only", `No outdoor events in ${locationLabel} ${dateLabel}`);

  if (!intent.vibe || intent.vibe !== "live music") {
    push("Live music", `Low-key live music in ${locationLabel} ${dateLabel}`);
  }

  if (fallbackApplied) {
    push("Try comedy", `Comedy in ${locationLabel} ${dateLabel}`);
  }

  return actions.slice(0, 4);
}

function mergeIntent(
  memory: AgentMemory,
  context: AgentContext | undefined,
  message: string,
  locationHints: LocationHint[],
  categoryHints: CategoryHint[],
  override?: AgentIntentOverride
): AgentIntent {
  const location =
    override?.location ||
    detectLocation(message, locationHints) ||
    memory.location ||
    context?.location;

  const dateFilter =
    override?.dateFilter ||
    detectDateFilter(message) ||
    memory.dateFilter ||
    context?.dateFilter ||
    "future";

  const budget = override?.budget ?? detectBudget(message) ?? memory.budget;
  const vibe = override?.vibe || detectVibe(message) || memory.vibe;
  const freeOnly =
    override?.freeOnly ?? detectFreeOnly(message) ?? memory.freeOnly ?? undefined;
  const indoorPreference =
    override?.indoorPreference ||
    detectIndoorPreference(message) ||
    memory.indoorPreference;
  const excludeTerms = uniqueStrings([
    ...(memory.excludeTerms || []),
    ...detectExcludeTerms(message),
    ...(override?.excludeTerms || []),
  ]);

  const concepts = uniqueConcepts([
    ...detectSearchConcepts(message),
    ...conceptsFromVibe(vibe),
    ...conceptsFromCategoryNames(override?.categoryNames),
  ]);
  const explicitCategoryMatch =
    matchCategoriesFromNames(override?.categoryNames, categoryHints) ??
    detectCategories(message, categoryHints);
  const semanticCategoryMatch = findCategoriesByConcepts(concepts, categoryHints);
  const categoryMatch = explicitCategoryMatch.ids
    ? explicitCategoryMatch
    : semanticCategoryMatch.ids
      ? semanticCategoryMatch
      : {};

  const categoryIds = categoryMatch.ids || memory.lastCategoryIds;
  const categoryNames = categoryMatch.names || memory.lastCategoryNames;
  const currentQuery = override?.query
    ? cleanQueryText(override.query)
    : buildQuery(message, locationHints);
  const hasNewThemeSignal = concepts.length > 0 || Boolean(categoryMatch.ids);
  const query = chooseSemanticQuery({
    explicitQuery:
      currentQuery || (!hasNewThemeSignal ? memory.query : undefined),
    concepts: uniqueConcepts([
      ...concepts,
      ...conceptsFromCategoryNames(categoryNames),
    ]),
    hasCategoryMatch: Boolean(categoryIds),
  });
  const planMode = override?.planMode ?? detectPlanMode(message);

  return {
    location,
    dateFilter,
    budget,
    vibe,
    query,
    planMode,
    categoryIds,
    categoryNames,
    excludeTerms,
    indoorPreference,
    freeOnly,
  };
}

export async function runAgent(
  sessionId: string,
  message: string,
  context: AgentContext | undefined,
  fetchEvents: FetchEvents,
  locationHints: LocationHint[] = LOCATION_KEYWORDS,
  categoryHints: CategoryHint[] = [],
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
    lastCategoryNames: intent.categoryNames,
    excludeTerms: intent.excludeTerms,
    indoorPreference: intent.indoorPreference,
    freeOnly: intent.freeOnly,
  });

  if (!intent.location) {
    return {
      assistantMessage: "I can help with that.",
      followUpQuestion: "Which city or region in NZ should I look in?",
      recommendations: [],
      quickActions: [
        { label: "Auckland", prompt: "Show me something fun in Auckland" },
        { label: "Wellington", prompt: "Show me something fun in Wellington" },
        { label: "Christchurch", prompt: "Show me something fun in Christchurch" },
      ],
      memory: nextMemory,
    };
  }

  const searchResult = await searchWithFallbacks(intent, fetchEvents, categoryHints);
  let recommendations = searchResult.recommendations;
  let assistantMessage = buildAssistantMessage(recommendations, intent, {
    fallbackReason: searchResult.fallbackReason,
  });

  if (intent.planMode && recommendations.length > 0) {
    const plan = buildNightPlan(recommendations, intent, searchResult.fallbackReason);
    recommendations = plan.recommendations;
    assistantMessage = plan.summary;
  } else {
    recommendations = recommendations.slice(0, 5).map((rec) => ({
      ...rec,
      whyThis: buildWhyThis(rec, intent, {
        fallbackApplied: searchResult.fallbackApplied,
      }),
    }));
  }

  const followUpQuestion = buildFollowUpQuestion(intent, recommendations);
  const quickActions = buildQuickActions(
    intent,
    recommendations,
    searchResult.fallbackApplied
  );

  return {
    assistantMessage,
    recommendations,
    followUpQuestion,
    quickActions,
    memory: nextMemory,
    fallbackApplied: searchResult.fallbackApplied,
  };
}
