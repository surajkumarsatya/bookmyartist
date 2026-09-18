import { ArtistCard } from "@/components/artists/ArtistCard";
import { getArtists } from "@/services/artist.service";
import { ChevronDown, Search } from "lucide-react";

export default async function Home() {
  const artists = await getArtists();

  return (
    <main className="min-h-screen bg-[#08080D] text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 bg-linear-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 font-mono text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
              BookMyArtist
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
              Find the perfect
              <span className="block bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                artist for your event
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Discover talented singers, DJs, dancers, comedians and bands
              for weddings, parties, corporate events and more.
            </p>

            <div className="mx-auto mt-10 max-w-3xl">
                            <div className="flex items-center border border-white/10 bg-white/6 px-5 py-3 shadow-2xl backdrop-blur-xl">
                <Search
                  size={20}
                  strokeWidth={1.8}
                  className="mr-3 shrink-0 text-zinc-400"
                />

                <input
                  type="text"
                  placeholder="Search artists, categories or cities..."
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {["Category", "City", "Price", "Rating"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="flex items-center gap-2 border border-white/10 bg-white/4 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  {filter}
                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className="text-zinc-500"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm font-medium text-orange-400">
              Explore talent
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Popular artists
            </h2>
          </div>

          <p className="text-sm text-zinc-500">
            {artists.length} artists available
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </main>
  );
}