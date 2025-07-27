import { NextRequest, NextResponse } from "next/server";

const EVENTFINDA_BASE_URL = "https://api.eventfinda.co.nz/v2";
const API_USERNAME = process.env.EVENTFINDA_USERNAME!;
const API_PASSWORD = process.env.EVENTFINDA_PASSWORD!;

async function fetchCategories(): Promise<any> {
  const url = `${EVENTFINDA_BASE_URL}/categories.json`;

  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString(
    "base64"
  );

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch categories:", errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function GET(_req: NextRequest) {
  try {
    const data = await fetchCategories();

    return NextResponse.json({
      success: true,
      categories: data.categories,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch categories",
        categories: [],
      },
      { status: 200 }
    );
  }
}
