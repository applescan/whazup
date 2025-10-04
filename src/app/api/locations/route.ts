import { NextResponse, NextRequest } from "next/server";

const EVENTFINDA_BASE_URL = "https://api.eventfinda.co.nz/v2";
const API_USERNAME = process.env.EVENTFINDA_USERNAME!;
const API_PASSWORD = process.env.EVENTFINDA_PASSWORD!;

async function makeEventfindaRequest(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${EVENTFINDA_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Eventfinda API error: ${res.status} - ${text}`);
  }

  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rows = searchParams.get("rows") || "1";
  const levels = searchParams.get("levels") || "2";

  try {
    const response = await makeEventfindaRequest("/locations.json", {
      rows,
      levels,
      fields: "location:(id,name,summary,url_slug,is_venue,count_current_events,children)",
    });

    const locations = response.locations || [];

    return NextResponse.json({
      locations,
      count: response.count || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
