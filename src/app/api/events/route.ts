import { NextRequest, NextResponse } from "next/server";
import { fetchEventfindaEvents } from "@/server/eventfinda";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const location = searchParams.get("location");
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  const dateFilter = searchParams.get("dateFilter");

  try {
    const data = await fetchEventfindaEvents({
      location,
      limit,
      offset,
      category,
      query,
      dateFilter,
    });

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
