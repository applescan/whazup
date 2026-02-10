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
      const res = await fetch(`/api/locations?rows=10&levels=2`);
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

      const flattenLocations = (
        input: Location | Location[] | undefined | null
      ): Location[] => {
        if (!input) return [];
        if (Array.isArray(input)) {
          const result: Location[] = [];
          for (const item of input) {
            result.push(...flattenLocations(item));
          }
          return result;
        }

        const result: Location[] = [];
        const normalized = normalizeChildren(input);

        if (normalized.children?.length) {
          for (const child of normalized.children) {
            result.push(...flattenLocations(child));
          }
        } else {
          result.push(normalized);
        }

        return result;
      };

      const rootLocations =
        Array.isArray(data.locations) && data.locations.length > 0
          ? data.locations
          : [];
      const flatList = flattenLocations(rootLocations);

      const filtered = flatList.filter(
        (loc) => !loc.is_venue && (loc.count_current_events ?? 0) > 10
      );

      const seen = new Set<string>();
      const cleaned = filtered.filter((loc) => {
        if (seen.has(loc.name)) return false;
        seen.add(loc.name);
        return true;
      });

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
