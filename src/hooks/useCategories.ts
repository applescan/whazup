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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.success || !data.categories) {
          throw new Error("Invalid categories response");
        }

        const cats: Category[] = data.categories;

        const withImages = await Promise.all(
          cats.map(async (cat) => {
            try {
              const eventRes = await fetch(
                `/api/events?category=${cat.id}&limit=1`
              );

              if (eventRes.ok) {
                const eventData = await eventRes.json();

                if (eventData.success && eventData.data?.events?.length > 0) {
                  const mappedEvent = mapEventfindaEventToEvent(eventData.data.events[0]);
                  return {
                    ...cat,
                    imageUrl: mappedEvent.image || "/placeholder-category.jpg"
                  };
                }
              }
            } catch (imageErr) {
              console.warn(`Failed to fetch image for category ${cat.name}:`, imageErr);
            }

            // Fallback image for category
            return {
              ...cat,
              imageUrl: "/placeholder-category.jpg"
            };
          })
        );

        setCategories(withImages);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}
