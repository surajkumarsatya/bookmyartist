import { Play } from "lucide-react";

import type { Artist } from "@/types/artist";

interface ArtistAboutProps {
  artist: Artist;
}

export function ArtistAbout({ artist }: ArtistAboutProps) {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-orange-400">
              About
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              About the artist
            </h2>

            <p className="mt-6 text-base leading-8 text-zinc-400">
              {artist.bio}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="border border-white/10 bg-white/2 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Category
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {artist.category}
                </p>
              </div>

              <div className="border border-white/10 bg-white/2 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Based in
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {artist.city}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-orange-400">
              Watch
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              On stage
            </h2>

            {artist.videos.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {artist.videos.map((video, index) => (
                  <a
                    key={`${video}-${index}`}
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden border border-white/10 bg-[#11131A]"
                  >
                    <div className="relative aspect-video bg-[#181B24]">
                      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-orange-500/20 via-pink-500/10 to-purple-500/20">
                        <div className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-black/60">
                          <Play
                            size={18}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-zinc-300">
                        Performance {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-6 border border-white/10 bg-white/2 p-6">
                <p className="text-sm text-zinc-500">
                  No performance videos available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}