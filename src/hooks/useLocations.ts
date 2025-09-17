import { useState, useEffect, useCallback } from "react";

export interface Location {
  summary: string;
  count_current_events: number;
  url_slug: string;
  is_venue: boolean;
  id: number;
  name: string;
  slug: string;
  country: string;
  region?: string;
  parent_id?: number;
  type?: string;
}

interface LocationsResponse {
  locations: Location[];
  count: number;
  page_count: number;
  page_size: number;
  page_number: number;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    const allLocations: Location[] = [];
    let page = 1;
    const pageSize = 100;

    try {
      while (true) {
        const res = await fetch(`/api/locations?rows=${pageSize}&page=${page}`);
        const data: LocationsResponse = await res.json();

        if (!res.ok) {
          throw new Error(`Failed to fetch locations: ${res.statusText}`);
        }

        allLocations.push(...data.locations);

        if (page >= data.page_count) break;
        page++;
      }

      setLocations(allLocations);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLocations();
  }, [fetchAllLocations]);

  return { locations, loading, error, refetch: fetchAllLocations };
}
