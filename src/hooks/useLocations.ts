import { useState, useEffect, useCallback } from "react";

export interface Location {
  summary: string;
  count_current_events: number;
  url_slug: string;
  is_venue: boolean;
  id: number;
  name: string;
  slug: string;
  country: string;
  region?: string;
  parent_id?: number;
  type?: string;
}

interface LocationsResponse {
  locations: Location[];
  count: number;
  page_count: number;
  page_size: number;
  page_number: number;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    const allLocations: Location[] = [];
    let page = 1;
    const pageSize = 100;

    try {
      while (true) {
        const res = await fetch(`/api/locations?rows=${pageSize}&page=${page}`);
        const data: LocationsResponse = await res.json();

        if (!res.ok) {
          throw new Error(`Failed to fetch locations: ${res.statusText}`);
        }

        allLocations.push(...data.locations);

        if (page >= data.page_count) break;
        page++;
      }

      setLocations(allLocations);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLocations();
  }, [fetchAllLocations]);

  return { locations, loading, error, refetch: fetchAllLocations };
}


import { NextResponse, NextRequest } from "next/server";

const EVENTFINDA_BASE_URL = "https://api.eventfinda.co.nz/v2";
const API_USERNAME = process.env.EVENTFINDA_USERNAME!;
const API_PASSWORD = process.env.EVENTFINDA_PASSWORD!;

async function makeEventfindaRequest(
  endpoint: string,
  params: Record<string, string>
) {
  const url = new URL(`${EVENTFINDA_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString(
    "base64"
  );

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
  const rows = Math.min(
    parseInt(searchParams.get("rows") || "50", 10),
    100
  ).toString();
  const page = Math.max(
    parseInt(searchParams.get("page") || "1", 10),
    1
  ).toString();

  try {
    const response = await makeEventfindaRequest("/locations.json", {
      rows,
      page,
    });

    return NextResponse.json({
      locations: response.locations || [],
      count: response.count || 0,
      page_count: response.page_count || 1,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
