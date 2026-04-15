import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";
import { fetchEventfindaCategories, fetchEventfindaLocations } from "@/server/eventfinda";
import { getCategoryHints, getLocationHints, searchEvents } from "@/server/eventCatalog";
import { AgentRecommendation } from "@/types/Agent";
import { EventDateFilter } from "@/types/Event";
import { getGeminiIntent } from "@/utils/agent/gemini";
import { runAgent } from "@/utils/agent/runner";

const DATE_FILTER_VALUES = [
  "future",
  "today",
  "this_week",
  "this_weekend",
] as const satisfies readonly EventDateFilter[];

type LoadEnvFileFn = (path?: string) => void;

function loadLocalEnvFiles() {
  const loadEnvFile = (
    process as NodeJS.Process & { loadEnvFile?: LoadEnvFileFn }
  ).loadEnvFile;

  if (!loadEnvFile) {
    return;
  }

  for (const filename of [".env.local", ".env"]) {
    const fullPath = resolve(process.cwd(), filename);
    if (existsSync(fullPath)) {
      loadEnvFile(fullPath);
    }
  }
}

function assertRequiredEnv() {
  if (!process.env.EVENTFINDA_USERNAME || !process.env.EVENTFINDA_PASSWORD) {
    throw new Error(
      "Missing Eventfinda credentials. Set EVENTFINDA_USERNAME and EVENTFINDA_PASSWORD."
    );
  }
}

function asTextResponse(summary: string, payload: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: `${summary}\n\n${JSON.stringify(payload, null, 2)}`,
      },
    ],
  };
}

async function fetchRecommendations(params: {
  location: string;
  dateFilter: EventDateFilter;
  query?: string;
  limit?: number;
  categoryIds?: string;
}): Promise<AgentRecommendation[]> {
  const { events } = await searchEvents({
    location: params.location,
    dateFilter: params.dateFilter,
    query: params.query,
    limit: params.limit,
    category: params.categoryIds,
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    location: event.location,
    datetime: event.datetime,
    category: event.category,
    description: event.fullDescription || event.description,
    url: event.url,
    image: event.image,
    price: event.price,
    priceValue: event.priceValue,
    isFree: event.isFree,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    latitude: event.latitude,
    longitude: event.longitude,
    whyThis: event.whyThis,
  }));
}

function createServer() {
  const server = new McpServer({
    name: "whazup-event-agent",
    version: "1.0.0",
  });

  server.registerTool(
    "recommend_events",
    {
      description:
        "Use the Whazup event agent to recommend New Zealand events from a natural-language request.",
      inputSchema: {
        message: z.string().min(1).describe("What the user wants to do."),
        sessionId: z
          .string()
          .optional()
          .describe("Optional session ID to preserve memory across calls."),
        location: z
          .string()
          .optional()
          .describe("Optional NZ city or region to seed the agent context."),
        dateFilter: z
          .enum(DATE_FILTER_VALUES)
          .optional()
          .describe("Optional date filter: future, today, this_week, or this_weekend."),
      },
    },
    async ({ message, sessionId, location, dateFilter }) => {
      const locationHints = await getLocationHints();
      const categoryHints = await getCategoryHints();
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const geminiModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

      const aiIntent = geminiApiKey
        ? await getGeminiIntent({
            apiKey: geminiApiKey,
            model: geminiModel,
            message,
            context: { location, dateFilter },
            locationHints,
            categoryHints,
          })
        : null;

      const response = await runAgent(
        sessionId || "mcp-session",
        message,
        { location, dateFilter },
        fetchRecommendations,
        locationHints,
        categoryHints,
        aiIntent || undefined
      );

      return asTextResponse(
        `Agent returned ${response.recommendations?.length || 0} recommendation(s).`,
        response
      );
    }
  );

  server.registerTool(
    "search_events",
    {
      description: "Search Eventfinda events in New Zealand.",
      inputSchema: {
        location: z
          .string()
          .optional()
          .describe("Optional NZ city or region."),
        dateFilter: z
          .enum(DATE_FILTER_VALUES)
          .optional()
          .describe("Optional date filter."),
        query: z
          .string()
          .optional()
          .describe("Optional free-text event search."),
        category: z
          .string()
          .optional()
          .describe("Optional comma-separated Eventfinda category IDs."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("Maximum number of events to return."),
        offset: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe("Pagination offset."),
      },
    },
    async ({ location, dateFilter, query, category, limit, offset }) => {
      const result = await searchEvents({
        location,
        dateFilter,
        query,
        category,
        limit,
        offset,
      });

      return asTextResponse(
        `Found ${result.events.length} event(s) out of ${result.raw.count || 0}.`,
        {
          count: result.raw.count || 0,
          page_count: result.raw.page_count || 0,
          page_size: result.raw.page_size || 0,
          page_number: result.raw.page_number || 0,
          events: result.events,
        }
      );
    }
  );

  server.registerTool(
    "list_locations",
    {
      description: "List available Eventfinda locations in New Zealand.",
      inputSchema: {
        rows: z
          .number()
          .int()
          .min(1)
          .max(300)
          .optional()
          .describe("Maximum number of locations to return."),
        levels: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional()
          .describe("Depth of child locations to include."),
      },
    },
    async ({ rows, levels }) => {
      const result = await fetchEventfindaLocations({ rows, levels });

      return asTextResponse(
        `Returned ${result.count || 0} location(s).`,
        {
          count: result.count || 0,
          locations: result.locations || [],
        }
      );
    }
  );

  server.registerTool(
    "list_categories",
    {
      description: "List Eventfinda event categories.",
      inputSchema: {},
    },
    async () => {
      const categories = await fetchEventfindaCategories();

      return asTextResponse("Returned Eventfinda categories.", categories);
    }
  );

  return server;
}

async function main() {
  loadLocalEnvFiles();
  assertRequiredEnv();

  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("[mcp] whazup-event-agent running on stdio");
}

main().catch((error) => {
  console.error("[mcp] server error", error);
  process.exit(1);
});
