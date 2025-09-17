import { Event, EventfindaEvent } from "@/types/Event";

export function mapEventfindaEventToEvent(
  eventfindaEvent: EventfindaEvent
): Event {
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();

      const timeString = date.toLocaleTimeString("en-NZ", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      if (isToday) {
        return `Today ${timeString}`;
      } else if (isTomorrow) {
        return `Tomorrow ${timeString}`;
      } else {
        const dayString = date.toLocaleDateString("en-NZ", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
        return `${dayString} ${timeString}`;
      }
    } catch (error) {
      return dateString;
    }
  };

  const DEFAULT_IMAGE =
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800";

  const pickLargest = (
    transforms: { url: string; width: number }[] = []
  ): string | null => {
    if (!Array.isArray(transforms) || transforms.length === 0) return null;
    const best = transforms.reduce(
      (largest, current) =>
        current.width > (largest?.width || 0) ? current : largest,
      null as null | { url: string; width: number }
    );
    return best?.url || null;
  };

  const getEventImage = (images: EventfindaEvent["images"]): string => {
    if (!images) return DEFAULT_IMAGE;

    if (Array.isArray((images as any).images)) {
      const imgArr = (images as any).images;
      if (imgArr.length === 0) return DEFAULT_IMAGE;

      const primary = imgArr.find((img: any) => img.is_primary) || imgArr[0];

      const transformUrl = pickLargest(primary.transforms?.transforms);
      return transformUrl || primary.original_url || DEFAULT_IMAGE;
    }

    if (images.transforms) {
      const transformsObj = (images as any).transforms;
      const transformArr = Object.values(transformsObj).filter(
        (t) => t && typeof t === "object" && "url" in t
      ) as { url: string; width: number }[];

      const transformUrl = pickLargest(transformArr);
      return transformUrl || DEFAULT_IMAGE;
    }

    return DEFAULT_IMAGE;
  };

  const cleanDescription = (description: string): string => {
    if (!description) return "No description available";

    const withoutHtml = description.replace(/<[^>]*>/g, "");

    if (withoutHtml.length > 150) {
      return withoutHtml.substring(0, 147) + "...";
    }

    return withoutHtml;
  };

  const formatPrice = (event: EventfindaEvent): string => {
    if (event.is_free) return "Free";
    if (event.price_display) return event.price_display;
    if (event.ticket_types && event.ticket_types.length > 0) {
      const prices = event.ticket_types
        .map((t) => t.price)
        .filter((p) => p > 0);
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? `$${min}` : `$${min}-${max}`;
      }
    }
    return "";
  };

  return {
    id: eventfindaEvent.id,
    title: eventfindaEvent.name,
    description: cleanDescription(eventfindaEvent.description),
    category: eventfindaEvent.category?.name || "Event",
    venue: eventfindaEvent.venue?.name || "Venue TBA",
    location:
      eventfindaEvent.location_summary ||
      eventfindaEvent.address ||
      "Location TBA",
    datetime: formatDateTime(eventfindaEvent.datetime_start),
    image: getEventImage(eventfindaEvent.images),
    fullDescription:
      eventfindaEvent.description || "No detailed description available",
    url: eventfindaEvent.url,
    price: formatPrice(eventfindaEvent),
    isFree: eventfindaEvent.is_free,
  };
}

export function mapEventfindaEventsToEvents(
  eventfindaEvents: EventfindaEvent[]
): Event[] {
  return eventfindaEvents.map(mapEventfindaEventToEvent);
}
