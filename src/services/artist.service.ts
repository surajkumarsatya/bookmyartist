import artistsData from "@/data/artists.json";
import type { Artist } from "@/types/artist";

const artists = artistsData as Artist[];

const API_DELAY = 700;

const simulateDelay = () =>
  new Promise((resolve) => setTimeout(resolve, API_DELAY));

export async function getArtists(): Promise<Artist[]> {
  await simulateDelay();

  return artists;
}

export async function getArtistById(id: string): Promise<Artist | null> {
  await simulateDelay();

  const artist = artists.find((artist) => artist.id === id);

  return artist ?? null;
}