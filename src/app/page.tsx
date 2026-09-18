"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { ArtistCard } from "@/components/artists/ArtistCard";
import { getArtists } from "@/services/artist.service";
import type { Artist } from "@/types/artist";

const categories = [
  "All",
  "Singer",
  "DJ",
  "Dancer",
  "Comedian",
  "Band",
];

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtists() {
      const data = await getArtists();

      setArtists(data);
      setLoading(false);
    }

    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      artist.name.toLowerCase().includes(query) ||
      artist.category.toLowerCase().includes(query) ||
      artist.city.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      artist.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#08080D] text-white">
      <section className="relative">
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
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((open) => !open)}
                  className="flex items-center gap-2 border border-white/10 bg-white/4 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  {selectedCategory === "All"
                    ? "Category"
                    : selectedCategory}

                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className={`text-zinc-500 transition-transform ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute left-1/2 z-20 mt-2 w-48 -translate-x-1/2 overflow-hidden border border-white/10 bg-[#11131A] p-1 text-left shadow-2xl">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition ${
                          selectedCategory === category
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {["City", "Price", "Rating"].map((filter) => (
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
            {filteredArtists.length} artists available
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="font-mono text-sm text-zinc-500">
              Loading artists...
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}