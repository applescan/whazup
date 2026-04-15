import { NextRequest, NextResponse } from "next/server";
import { fetchEventfindaLocations } from "@/server/eventfinda";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rows = searchParams.get("rows") || "1";
  const levels = searchParams.get("levels") || "2";

  try {
    const response = await fetchEventfindaLocations({ rows, levels });

    return NextResponse.json({
      locations: response.locations || [],
      count: response.count || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
