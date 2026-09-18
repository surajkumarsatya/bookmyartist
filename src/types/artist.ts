export type ArtistCategory =
  | "Singer"
  | "DJ"
  | "Dancer"
  | "Comedian"
  | "Band";

export type EventType =
  | "Wedding"
  | "Corporate"
  | "College Fest"
  | "Private Party";

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

export interface Availability {
  bookedDates: string[];
}

export interface Pricing {
  weekdayMultiplier: number;
  weekendMultiplier: number;
  eventTypeMultipliers: Record<EventType, number>;
}

export interface Artist {
  id: string;
  name: string;
  category: ArtistCategory;
  city: string;
  basePrice: number;
  rating: number;
  image: string;
  gallery: string[];
  bio: string;
  videos: string[];
  reviews: Review[];
  availability: Availability;
  pricing: Pricing;
}