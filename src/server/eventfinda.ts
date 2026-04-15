import { EventDateFilter, EventfindaResponse } from "@/types/Event";

const EVENTFINDA_BASE_URL = "https://api.eventfinda.co.nz/v2";
const EVENTFINDA_EVENT_FIELDS =
  "id,name,url,description,datetime_start,datetime_end,location_summary,address,venue,category,images,point,is_free,price_display,ticket_types";
const LOCATION_FIELDS =
  "location:(id,name,summary,url_slug,is_venue,count_current_events,children)";

export interface EventfindaLocationRecord {
  id?: number;
  name: string;
  summary?: string;
  url_slug: string;
  is_venue?: boolean;
  count_current_events?: number;
  children?: EventfindaLocationRecord[];
}

export interface EventfindaLocationsResponse {
  locations?: EventfindaLocationRecord[];
  count?: number;
}

export interface EventfindaCategoryRecord {
  id: number;
  name: string;
  url_slug?: string;
  children?: EventfindaCategoryRecord[];
}

export interface EventfindaCategoriesEnvelope {
  categories?: EventfindaCategoryRecord[];
}

function getEventfindaCredentials() {
  const username = process.env.EVENTFINDA_USERNAME;
  const password = process.env.EVENTFINDA_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Missing Eventfinda credentials. Set EVENTFINDA_USERNAME and EVENTFINDA_PASSWORD."
    );
  }

  return Buffer.from(`${username}:${password}`).toString("base64");
}

export function toLocationSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

function formatDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", DATE_FORMAT_OPTIONS)
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function buildDateFilter(
  dateFilter: EventDateFilter | string | null | undefined
) {
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  switch (dateFilter) {
    case "today":
      return { start_date: formatDate(todayUtc), end_date: formatDate(todayUtc) };
    case "this_week": {
      const day = todayUtc.getUTCDay();
      const daysUntilSunday = (7 - day) % 7;
      const end = addDays(todayUtc, daysUntilSunday);
      return { start_date: formatDate(todayUtc), end_date: formatDate(end) };
    }
    case "this_weekend": {
      const day = todayUtc.getUTCDay();
      let start: Date;
      let end: Date;

      if (day === 6) {
        start = todayUtc;
        end = addDays(todayUtc, 1);
      } else if (day === 0) {
        start = todayUtc;
        end = todayUtc;
      } else {
        const daysUntilSaturday = 6 - day;
        start = addDays(todayUtc, daysUntilSaturday);
        end = addDays(start, 1);
      }

      return { start_date: formatDate(start), end_date: formatDate(end) };
    }
    case "future": {
      const tomorrow = addDays(todayUtc, 1);
      return { start_date: formatDate(tomorrow) };
    }
    default:
      return { start_date: formatDate(todayUtc) };
  }
}

export async function makeEventfindaRequest<T>(
  endpoint: string,
  params: Record<string, string | undefined> = {},
  init: RequestInit = {}
): Promise<T> {
  const url = new URL(`${EVENTFINDA_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    ...init,
    method: init.method || "GET",
    cache: init.cache || "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${getEventfindaCredentials()}`,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Eventfinda API error: ${response.status} ${response.statusText}${
        errorText ? ` - ${errorText.slice(0, 200)}` : ""
      }`
    );
  }

  return response.json() as Promise<T>;
}

interface FetchEventfindaEventsParams {
  location?: string | null;
  limit?: number | string;
  offset?: number | string;
  category?: string | null;
  query?: string | null;
  dateFilter?: EventDateFilter | string | null;
}

export async function fetchEventfindaEvents(
  params: FetchEventfindaEventsParams
): Promise<EventfindaResponse> {
  return makeEventfindaRequest<EventfindaResponse>("/events.json", {
    rows: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
    order: "date",
    fields: EVENTFINDA_EVENT_FIELDS,
    ...buildDateFilter(params.dateFilter),
    location_slug: params.location ? toLocationSlug(params.location) : undefined,
    category: params.category || undefined,
    q: params.query || undefined,
  });
}

interface FetchEventfindaLocationsParams {
  rows?: number | string;
  levels?: number | string;
}

export async function fetchEventfindaLocations(
  params: FetchEventfindaLocationsParams = {}
): Promise<EventfindaLocationsResponse> {
  return makeEventfindaRequest<EventfindaLocationsResponse>("/locations.json", {
    rows: String(params.rows ?? 1),
    levels: String(params.levels ?? 2),
    fields: LOCATION_FIELDS,
  });
}

export async function fetchEventfindaCategories(): Promise<
  EventfindaCategoryRecord[] | EventfindaCategoriesEnvelope
> {
  return makeEventfindaRequest<EventfindaCategoryRecord[] | EventfindaCategoriesEnvelope>(
    "/categories.json"
  );
}
