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
        const data = await res.json();
        const cats: Category[] = data.categories;

        const withImages = await Promise.all(
          cats.map(async (cat) => {
            const eventRes = await fetch(
              `/api/events?category=${cat.id}&limit=1`
            );
            const eventData = await eventRes.json();
            const imageUrl =
              eventData.success && eventData.data.events.length > 0
                ? mapEventfindaEventToEvent(eventData.data.events[0]).image
                : "/placeholder-category.jpg";

            return { ...cat, imageUrl };
          })
        );

        setCategories(withImages);
      } catch (err: any) {
        console.error("Error fetching categories or event images:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}
