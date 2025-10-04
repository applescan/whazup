import { useState, useEffect, useCallback } from "react";

export interface Location {
  id: number;
  name: string;
  summary: string;
  url_slug: string;
  is_venue: boolean;
  count_current_events: number;
  children?: Location[];
}

interface LocationsResponse {
  locations: Location[];
  count: number;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/locations?rows=1&levels=2`);
      const data: LocationsResponse & { error?: string } = await res.json();

      if (data.error) throw new Error(data.error);

      const normalizeChildren = (loc: any): Location => ({
        ...loc,
        children: Array.isArray(loc.children)
          ? loc.children
          : Array.isArray(loc.children?.children)
            ? loc.children.children
            : [],
      });

      const flattenLocations = (locs: any[]): Location[] => {
        const result: Location[] = [];
        for (const loc of locs) {
          const normalized = normalizeChildren(loc);
          result.push(normalized);
          if (normalized.children?.length) {
            result.push(...flattenLocations(normalized.children));
          }
        }
        return result;
      };

      const flatList = flattenLocations(data.locations || []);

      const cleaned = flatList.filter((loc) => !loc.is_venue);

      setLocations(cleaned);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, error, refetch: fetchLocations };
}
