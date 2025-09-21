import { mapEventfindaEventToEvent } from "@/utils/eventMapper";
import { useEffect, useState } from "react";

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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
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
            if (!cat.count_current_events || cat.count_current_events === 0) {
              return {
                ...cat,
                imageUrl: "/placeholder-category.jpg"
              };
            }

            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000);

              const eventRes = await fetch(
                `/api/events?category=${cat.id}&limit=1`,
                {
                  signal: controller.signal,
                  headers: {
                    'Accept': 'application/json',
                  }
                }
              );

              clearTimeout(timeoutId);

              if (eventRes.ok) {
                const eventData = await eventRes.json();

                if (eventData.success && eventData.data?.events?.length > 0) {
                  const mappedEvent = mapEventfindaEventToEvent(eventData.data.events[0]);
                  return {
                    ...cat,
                    imageUrl: mappedEvent.image || "/placeholder-category.jpg"
                  };
                }
              } else {
                console.warn(`Failed to fetch events for category ${cat.name}: ${eventRes.status}`);
              }
            } catch (imageErr) {
              if (imageErr instanceof Error && imageErr.name === 'AbortError') {
                console.warn(`Image fetch timeout for category ${cat.name}`);
              } else {
                console.warn(`Image fetch error for category ${cat.name}:`, imageErr);
              }
            }

            return {
              ...cat,
              imageUrl: "/placeholder-category.jpg"
            };
          })
        );

        console.log("Categories loaded successfully with images");
        setCategories(categoriesWithImages);

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
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Concerts & Live Music",
    url_slug: "concerts-gig-guide",
    parent_id: null,
    count_current_events: 50,
    imageUrl: "/placeholder-category.jpg"
  },
  {
    id: 2,
    name: "Performing Arts",
    url_slug: "arts",
    parent_id: null,
    count_current_events: 30,
    imageUrl: "/placeholder-category.jpg"
  },
  {
    id: 3,
    name: "Theatre",
    url_slug: "theatre",
    parent_id: null,
    count_current_events: 25,
    imageUrl: "/placeholder-category.jpg"
  },
  {
    id: 4,
    name: "Sports & Outdoors",
    url_slug: "sports",
    parent_id: null,
    count_current_events: 40,
    imageUrl: "/placeholder-category.jpg"
  },
  {
    id: 5,
    name: "Festivals & Lifestyle",
    url_slug: "lifestyle",
    parent_id: null,
    count_current_events: 35,
    imageUrl: "/placeholder-category.jpg"
  },
  {
    id: 6,
    name: "Dance",
    url_slug: "dance",
    parent_id: null,
    count_current_events: 20,
    imageUrl: "/placeholder-category.jpg"
  },
  {
    id: 7,
    name: "Exhibitions",
    url_slug: "exhibitions",
    parent_id: null,
    count_current_events: 15,
    imageUrl: "/placeholder-category.jpg"
  },
  {
    id: 8,
    name: "Workshops & Classes",
    url_slug: "workshops-conferences-classes",
    parent_id: null,
    count_current_events: 45,
    imageUrl: "/placeholder-category.jpg"
  }
];

export function useCategoriesWithFallback() {
  const { categories, loading, error } = useCategories();

  const finalCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  const finalError = categories.length === 0 && error ? error : null;

  return {
    categories: finalCategories,
    loading,
    error: finalError,
    isUsingFallback: categories.length === 0,
  };
}
