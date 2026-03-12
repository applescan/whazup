import { NextRequest, NextResponse } from "next/server";
import { EventfindaResponse } from "@/types/Event";

const EVENTFINDA_BASE_URL = "https://api.eventfinda.co.nz/v2";
const API_USERNAME = process.env.EVENTFINDA_USERNAME!;
const API_PASSWORD = process.env.EVENTFINDA_PASSWORD!;

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

function toLocationSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", DATE_FORMAT_OPTIONS)
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function buildDateFilter(dateFilter: string | null) {
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

async function makeEventfindaRequest(
  endpoint: string,
  params: Record<string, string | undefined> = {}
): Promise<any> {
  const url = new URL(`${EVENTFINDA_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString(
    "base64"
  );


  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error Response:", errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const location = searchParams.get("location");
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  const dateFilter = searchParams.get("dateFilter");

  const params: Record<string, string | undefined> = {
    rows: limit,
    offset: offset,
    order: "date",
    fields:
      "id,name,url,description,datetime_start,datetime_end,location_summary,address,venue,category,images,point,is_free,price_display,ticket_types",
    ...buildDateFilter(dateFilter),
  };

  if (location) {
    params.location_slug = toLocationSlug(location);
  }

  if (category) {
    params.category = category;
  }

  if (query) {
    params.q = query;
  }

  try {
    const data: EventfindaResponse = await makeEventfindaRequest(
      "/events.json",
      params
    );

    return NextResponse.json({
      success: true,
      data,
      fallback: false,
    });
  } catch (error) {
    console.warn(
      "Eventfinda API unavailable, returning fallback response:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Eventfinda API unavailable",
        fallback: true,
        data: {
          events: [],
          count: 0,
          page_count: 0,
          page_size: 0,
          page_number: 0,
        },
      },
      { status: 200 }
    );
  }
}
