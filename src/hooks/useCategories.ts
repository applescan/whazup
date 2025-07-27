import { useEffect, useState } from "react";

export interface Category {
  id: number;
  name: string;
  url_slug: string;
  parent_id: number | null;
  count_current_events: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};
