export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  datetime: string;
  image: string;
  fullDescription?: string;
  url?: string;
  price?: string;
  isFree?: boolean;
}

export interface UserPreferences {
  location: string;
  likedEvents: string[];
  dislikedEvents: string[];
}

export interface EventfindaEvent {
  id: string;
  name: string;
  description: string;
  url: string;
  datetime_start: string;
  datetime_end: string;
  location_summary: string;
  address: string;
  category: {
    id: string;
    name: string;
  };
  images: {
    transforms: {
      small_rectangle?: {
        url: string;
        width: number;
        height: number;
      };
      medium_rectangle?: {
        url: string;
        width: number;
        height: number;
      };
      large_rectangle?: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  point: {
    lat: number;
    lng: number;
  };
  is_free: boolean;
  price_display: string;
  ticket_types: Array<{
    name: string;
    price: number;
    currency: string;
  }>;
}

export interface EventfindaResponse {
  events: EventfindaEvent[];
  count: number;
  page_count: number;
  page_size: number;
  page_number: number;
}

export enum Region {
  Northland = "Northland",
  Auckland = "Auckland",
  Waikato = "Waikato",
  BayOfPlenty = "Bay of Plenty",
  HawkesBay = "Hawke's Bay",
  Wellington = "Wellington",
  Otago = "Otago",
  Canterbury = "Canterbury",
  Southland = "Southland",
  Other = "Other",
}
