import type { EventType } from "@/types/artist";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled";

export interface Booking {
  id: string;
  artistId: string;
  artistName: string;
  artistImage: string;

  date: string;
  eventType: EventType;
  city: string;
  audienceSize: number;

  eventName: string;

  contactName: string;
  email: string;
  phone: string;

  estimatedPrice: number;

  status: BookingStatus;
  createdAt: string;
}