"use client";

import { useState, useEffect } from "react";
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

export function useEvents(location: string, categoryIds?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          location: location,
          limit: "20",
        });

        if (categoryIds) {
          params.append("category", categoryIds);
        }

        const response = await fetch(`/api/events?${params.toString()}`);
        const result: ApiResponse = await response.json();

        if (result.success && result.data.events.length > 0) {
          const mappedEvents = mapEventfindaEventsToEvents(result.data.events);
          setEvents(mappedEvents);
        } else {
          setEvents([]);
          setError(
            `No events found in ${location}${
              categoryIds ? ` for selected categories.` : "."
            }`
          );
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Unable to load events.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [location, categoryIds]);

  return { events, loading, error };
}
