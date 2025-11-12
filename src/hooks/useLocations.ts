import { useState, useEffect, useCallback } from 'react';

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
      const res = await fetch(`/api/locations?rows=100&levels=2`);
      const data: LocationsResponse & { error?: string } = await res.json();

      if (data.error) throw new Error(data.error);

      type RawLocation = Omit<Location, 'children'> & {
        children?: Location[] | { children?: Location[] };
      };

      const normalizeChildren = (loc: RawLocation): Location => ({
        ...loc,
        children: Array.isArray(loc.children)
          ? loc.children
          : Array.isArray(loc.children?.children)
          ? loc.children.children
          : [],
      });

      const flattenLocations = (loc: Location): Location[] => {
        if (!loc) return [];
        const result: Location[] = [];

        const normalized = normalizeChildren(loc);

        if (normalized.children?.length) {
          for (const child of normalized.children) {
            const childAndDescendants = flattenLocations(child);
            result.push(...childAndDescendants);
          }
        }
        if (!normalized.children?.length) {
          result.push(normalized);
        }

        return result;
      };

      const flatList = flattenLocations(data.locations[1] || []);

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
