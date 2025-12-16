"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Event } from "@/types/Event";
import { mapEventfindaEventsToEvents } from "@/utils/eventMapper";

interface ApiResponse {
  success: boolean;
  data: {
    events: any[];
    count: number;
    page_count: number;
    page_size: number;
    page_number: number;
  };
  fallback: boolean;
  error?: string;
}

const EVENTS_PAGE_SIZE = 10;

interface FetchOptions {
  append?: boolean;
  offset?: number;
}

export function useEvents(location: string, categoryIds?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const nextOffsetRef = useRef(0);

  const fetchEvents = useCallback(
    async ({ append = false, offset }: FetchOptions = {}) => {
      if (!location) return;

      const offsetToUse =
        typeof offset === "number"
          ? offset
          : append
            ? nextOffsetRef.current
            : 0;

      append ? setLoadingMore(true) : setLoading(true);
      if (!append) {
        setError(null);
      }

      try {
        const params = new URLSearchParams({
          location,
          limit: EVENTS_PAGE_SIZE.toString(),
          offset: offsetToUse.toString(),
        });

        if (categoryIds) {
          params.append("category", categoryIds);
        }

        const response = await fetch(`/api/events?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data?.events) {
          const mappedEvents = mapEventfindaEventsToEvents(result.data.events);

          setEvents((prev) => {
            const combined = append ? [...prev, ...mappedEvents] : mappedEvents;
            const newOffset = offsetToUse + mappedEvents.length;
            nextOffsetRef.current = newOffset;

            const totalCount = result.data?.count ?? 0;
            const moreAvailable =
              mappedEvents.length === EVENTS_PAGE_SIZE &&
              (totalCount === 0 || newOffset < totalCount);

            setHasMore(moreAvailable);

            if (!append && combined.length === 0) {
              setError("No events found for the selected categories in this location.");
            }

            return combined;
          });
        } else {
          if (!append) {
            setEvents([]);
          }
          setHasMore(false);
          setError(result.error || "Unable to load events.");
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        if (!append) {
          setError("Unable to connect to the event service. Please try again.");
          setEvents([]);
          setHasMore(false);
        }
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [location, categoryIds]
  );

  useEffect(() => {
    if (!location) {
      setEvents([]);
      setHasMore(false);
      return;
    }

    nextOffsetRef.current = 0;
    setEvents([]);
    setHasMore(true);
    fetchEvents({ append: false, offset: 0 });
  }, [location, categoryIds, fetchEvents]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    fetchEvents({ append: true });
  }, [fetchEvents, loading, loadingMore, hasMore]);

  return { events, loading, error, loadMore, hasMore, loadingMore };
}
