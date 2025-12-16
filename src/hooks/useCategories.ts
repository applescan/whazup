import { mapEventfindaEventToEvent } from "@/utils/eventMapper";
import { useCallback, useEffect, useState } from "react";

export interface Category {
  imageUrl: string;
  id: number;
  name: string;
  url_slug: string;
  parent_id: number | null;
  count_current_events: number;
}

interface CategoriesApiResponse {
  success?: boolean;
  categories?: Category[];
  error?: string;
}

const PLACEHOLDER_IMAGE = "/placeholder-category.jpg";
const EVENT_FETCH_TIMEOUT = 5000;
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const unsplashCache = new Map<string, string>();

interface UnsplashPhoto {
  urls?: {
    regular?: string;
    full?: string;
    small?: string;
  };
}

async function fetchEventImageForCategory(category: Category, location?: string): Promise<string | null> {
  if (!category.count_current_events) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), EVENT_FETCH_TIMEOUT);

    const params = new URLSearchParams({
      category: String(category.id),
      limit: "1",
    });

    if (location) {
      params.append("location", location);
    }

    const eventRes = await fetch(`/api/events?${params.toString()}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });

    clearTimeout(timeoutId);

    if (eventRes.ok) {
      const eventData = await eventRes.json();

      if (eventData.success && eventData.data?.events?.length > 0) {
        const mappedEvent = mapEventfindaEventToEvent(eventData.data.events[0]);
        return mappedEvent.image || null;
      }
    } else {
      console.warn(`Failed to fetch events for category ${category.name}: ${eventRes.status}`);
    }
  } catch (imageErr) {
    if (imageErr instanceof Error && imageErr.name === 'AbortError') {
      console.warn(`Image fetch timeout for category ${category.name}`);
    } else {
      console.warn(`Image fetch error for category ${category.name}:`, imageErr);
    }
  }

  return null;
}

async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    return null;
  }

  const cacheKey = query.toLowerCase();
  if (unsplashCache.has(cacheKey)) {
    return unsplashCache.get(cacheKey) ?? null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&content_filter=high`
    );

    if (!response.ok) {
      console.warn(`Unsplash request failed for ${query}: ${response.status}`);
      return null;
    }

    const data: UnsplashPhoto = await response.json();
    const imageUrl = data.urls?.regular || data.urls?.full || data.urls?.small || null;

    if (imageUrl) {
      unsplashCache.set(cacheKey, imageUrl);
    }

    return imageUrl;
  } catch (err) {
    console.warn(`Unsplash fetch error for ${query}:`, err);
  }

  return null;
}

interface LoadCategoriesOptions {
  clearCache?: boolean;
}

export function useCategories(location?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedLocation, setLoadedLocation] = useState<string | undefined>(undefined);

  const loadCategories = useCallback(async (options?: LoadCategoriesOptions) => {
    if (options?.clearCache) {
      unsplashCache.clear();
    }

    setLoading(true);
    setError(null);
    setCategories([]);
    setLoadedLocation(undefined);

    try {
      const res = await fetch("/api/categories");

      if (!res.ok) {
        throw new Error(`Categories API failed: ${res.status} ${res.statusText}`);
      }

      const data: CategoriesApiResponse = await res.json();

      let categories: Category[] = [];

      if (data.success && data.categories) {
        categories = data.categories;
      } else if (Array.isArray(data)) {
        categories = data as Category[];
      } else if (data.categories) {
        categories = data.categories;
      } else {
        throw new Error("No categories found in API response");
      }

      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("Categories data is empty or invalid");
      }

      const categoriesWithImages = await Promise.all(
        categories.map(async (cat) => {
          const imageFromEvents = await fetchEventImageForCategory(cat, location);
          const imageFromUnsplash = imageFromEvents ? null : await fetchUnsplashImage(cat.name);

          return {
            ...cat,
            imageUrl: imageFromEvents || imageFromUnsplash || PLACEHOLDER_IMAGE,
          };
        })
      );

      setCategories(categoriesWithImages);
      setLoadedLocation(location || "");

    } catch (err: any) {
      console.error("Error in loadCategories:", err);

      let errorMessage = "Failed to load categories";

      if (err.message.includes("fetch")) {
        errorMessage = "Unable to connect to categories service";
      } else if (err.message.includes("invalid") || err.message.includes("empty")) {
        errorMessage = "Categories data is unavailable";
      } else if (err.name === 'TypeError') {
        errorMessage = "Network error - please check your connection";
      }

      setError(errorMessage);

      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const reloadCategories = useCallback(() => loadCategories({ clearCache: true }), [loadCategories]);

  return { categories, loading, error, reloadCategories, loadedLocation };
}
