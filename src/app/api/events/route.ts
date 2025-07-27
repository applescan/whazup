import { NextRequest, NextResponse } from "next/server";
import { EventfindaResponse } from "@/types/Event";

const EVENTFINDA_BASE_URL = "https://api.eventfinda.co.nz/v2";
const API_USERNAME = process.env.EVENTFINDA_USERNAME!;
const API_PASSWORD = process.env.EVENTFINDA_PASSWORD!;

async function makeEventfindaRequest(
  endpoint: string,
  params: Record<string, string> = {}
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

  console.log("Requesting:", url.toString());

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

  const params: Record<string, string> = {
    rows: limit,
    offset: offset,
    order: "date",
    start_date: new Date().toISOString().split("T")[0],
    fields:
      "id,name,url,description,datetime_start,datetime_end,location_summary,address,venue,category,images,point,is_free,price_display,ticket_types",
  };

  if (location) {
    params.location_slug = location.toLowerCase();
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
