import { NextResponse } from "next/server";
import { fetchEventfindaCategories } from "@/server/eventfinda";

export async function GET() {
  try {
    const data = await fetchEventfindaCategories();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
