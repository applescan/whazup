import { NextResponse } from "next/server";

const EVENTFINDA_BASE_URL = "https://api.eventfinda.co.nz/v2";
const API_USERNAME = process.env.EVENTFINDA_USERNAME!;
const API_PASSWORD = process.env.EVENTFINDA_PASSWORD!;

export async function GET() {
  try {
    const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64");

    const response = await fetch(`${EVENTFINDA_BASE_URL}/categories.json`, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${credentials}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Eventfinda API error: ${response.status}`);
      return NextResponse.json(
        { error: `API returned ${response.status}` },
        {
          status: response.status,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error: any) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  }
}
