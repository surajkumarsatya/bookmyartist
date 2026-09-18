import Image from "next/image";
import Link from "next/link";

import type { Artist } from "@/types/artist";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <article className="group overflow-hidden border border-white/10 bg-[#11131A] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
      <Link
        href={`/artists/${artist.id}`}
        className="block overflow-hidden"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-[#181B24]">
          <Image
            width={600}
            height={400}
            src={artist.image}
            alt={artist.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          
          <div className="absolute inset-0 bg-linear-to-t from-[#11131A] via-transparent to-transparent opacity-80" />

          
          <div className="absolute left-4 top-4 border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {artist.category}
          </div>

          
          <div className="absolute right-4 top-4 border border-white/10 bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
            ★ {artist.rating}
          </div>
        </div>
      </Link>

      
      <div className="p-5">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {artist.name}
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {artist.category} · {artist.city}
          </p>
        </div>

        <p className="mb-5 line-clamp-2 text-sm leading-6 text-zinc-400">
          {artist.bio}
        </p>

        <div className="mb-5">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Starting from
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            ₹{artist.basePrice.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/artists/${artist.id}`}
            className="flex-1 border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
          >
            View Profile
          </Link>

          <Link
            href={`/artists/${artist.id}/book`}
            className="flex-1 bg-linear-to-r from-orange-500 to-pink-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}