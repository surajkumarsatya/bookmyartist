import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star } from "lucide-react";

import type { Artist } from "@/types/artist";

interface ArtistHeroProps {
  artist: Artist;
}

export function ArtistHero({ artist }: ArtistHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 bg-linear-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-20">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to artists
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <div className="relative overflow-hidden border border-white/10 bg-[#11131A]">
            <div className="relative aspect-4/3">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#08080D]/70 via-transparent to-transparent" />

              <div className="absolute left-4 top-4 border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-white backdrop-blur-md">
                {artist.category}
              </div>

              <div className="absolute right-4 top-4 flex items-center gap-1.5 border border-white/10 bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                <Star size={14} fill="currentColor" />
                {artist.rating}
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-orange-400">
              Featured artist
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {artist.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-zinc-400">
              <MapPin size={17} strokeWidth={1.8} />
              <span>{artist.city}</span>
              <span className="text-zinc-600">·</span>
              <span>{artist.category}</span>
            </div>

            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              {artist.bio}
            </p>

            <div className="mt-8 border-y border-white/10 py-6">
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                Starting from
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                ₹{artist.basePrice.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="mt-7">
              <Link
                href={`/artists/${artist.id}/book`}
                className="inline-flex w-full items-center justify-center bg-linear-to-r from-orange-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
              >
                Request to Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}