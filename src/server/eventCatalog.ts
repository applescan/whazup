import { Event, EventDateFilter, EventfindaResponse } from "@/types/Event";
import {
  EventfindaCategoryRecord,
  fetchEventfindaCategories,
  fetchEventfindaEvents,
  fetchEventfindaLocations,
  type EventfindaLocationRecord,
} from "@/server/eventfinda";
import { mapEventfindaEventsToEvents } from "@/utils/eventMapper";

export interface LocationHint {
  name: string;
  slug: string;
}

export interface CategoryHint {
  id: number;
  name: string;
  url_slug?: string;
}

interface SearchEventsParams {
  location?: string;
  dateFilter?: EventDateFilter | string;
  query?: string;
  limit?: number;
  offset?: number;
  category?: string;
}

interface SearchEventsResult {
  events: Event[];
  raw: EventfindaResponse;
}

type RawLocationChildren =
  | EventfindaLocationRecord[]
  | {
      children?: EventfindaLocationRecord[];
    };

let cachedLocations: LocationHint[] | null = null;
let cachedLocationsAt = 0;
let cachedCategories: CategoryHint[] | null = null;
let cachedCategoriesAt = 0;

const LOCATION_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const CATEGORY_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

export async function searchEvents(
  params: SearchEventsParams
): Promise<SearchEventsResult> {
  const raw = await fetchEventfindaEvents({
    location: params.location,
    dateFilter: params.dateFilter,
    query: params.query,
    limit: params.limit,
    offset: params.offset,
    category: params.category,
  });

  return {
    events: mapEventfindaEventsToEvents(raw.events || []),
    raw,
  };
}

export async function getLocationHints(): Promise<LocationHint[]> {
  const now = Date.now();
  if (cachedLocations && now - cachedLocationsAt < LOCATION_CACHE_TTL_MS) {
    return cachedLocations;
  }

  try {
    const response = await fetchEventfindaLocations({ rows: 300, levels: 2 });
    const locations: EventfindaLocationRecord[] = Array.isArray(response.locations)
      ? response.locations
      : [];

    const flattenLocations = (
      input: EventfindaLocationRecord | EventfindaLocationRecord[] | undefined | null
    ): EventfindaLocationRecord[] => {
      if (!input) return [];
      if (Array.isArray(input)) {
        return input.flatMap((item) => flattenLocations(item));
      }

      const rawChildren = input.children as RawLocationChildren | undefined;
      const nestedChildren = Array.isArray(rawChildren)
        ? rawChildren
        : Array.isArray(rawChildren?.children)
          ? rawChildren.children
          : [];

      return [input, ...nestedChildren.flatMap((child) => flattenLocations(child))];
    };

    cachedLocations = flattenLocations(locations)
      .filter((location) => location?.name && location?.url_slug)
      .map((location) => ({
        name: location.name,
        slug: location.url_slug,
      }));
    cachedLocationsAt = now;

    return cachedLocations;
  } catch {
    return cachedLocations || [];
  }
}

export async function getCategoryHints(): Promise<CategoryHint[]> {
  const now = Date.now();
  if (cachedCategories && now - cachedCategoriesAt < CATEGORY_CACHE_TTL_MS) {
    return cachedCategories;
  }

  try {
    const data = await fetchEventfindaCategories();
    const categories: EventfindaCategoryRecord[] = Array.isArray(data)
      ? data
      : Array.isArray(data.categories)
        ? data.categories
        : [];

    cachedCategories = categories
      .filter((category) => category?.id && category?.name)
      .map((category) => ({
        id: category.id,
        name: category.name,
        url_slug: category.url_slug,
      }));
    cachedCategoriesAt = now;

    return cachedCategories;
  } catch {
    return cachedCategories || [];
  }
}
