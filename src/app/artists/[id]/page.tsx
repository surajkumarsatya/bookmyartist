import { notFound } from "next/navigation";

import { ArtistHero } from "@/components/artists/ArtistHero";
import { getArtistById } from "@/services/artist.service";
import { ArtistGallery } from "@/components/artists/ArtistGallery";
import { ArtistAbout } from "@/components/artists/ArtistAbout";
import { ArtistReviews } from "@/components/artists/ArtistReviews";
import { ArtistAvailability } from "@/components/artists/ArtistAvailability";

interface ArtistPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;

  const artist = await getArtistById(id);

  if (!artist) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#08080D] text-white">
      <ArtistHero artist={artist} />
      <ArtistGallery artist={artist} />
      <ArtistAbout artist={artist} />
      <ArtistReviews artist={artist} />
      <ArtistAvailability artist={artist} />
    </main>
  );
}