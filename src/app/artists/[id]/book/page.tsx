import { notFound } from "next/navigation";

import { BookingFlow } from "@/components/booking/BookingFlow";
import { getArtistById } from "@/services/artist.service";
import type { EventType } from "@/types/artist";

interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    date?: string;
    eventType?: string;
  }>;
}

const eventTypes: EventType[] = [
  "Wedding",
  "Corporate",
  "College Fest",
  "Private Party",
];

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const artist = await getArtistById(id);

  if (!artist) {
    notFound();
  }

  const initialEventType = eventTypes.includes(
    query.eventType as EventType,
  )
    ? (query.eventType as EventType)
    : "Wedding";

  return (
    <BookingFlow
      artist={artist}
      initialDate={query.date ?? null}
      initialEventType={initialEventType}
    />
  );
}