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

const priceRanges = [
  "All",
  "Under ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,00,000",
  "Above ₹2,00,000",
];

const ratingOptions = [
  "All",
  "4.0+",
  "4.5+",
  "4.7+",
];

const sortOptions = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Rating: High to Low",
];

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Recommended");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ARTISTS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchArtists() {
      const data = await getArtists();

      setArtists(data);
      setLoading(false);
    }

    fetchArtists();
  }, []);

  const cities = [
    "All",
    ...Array.from(new Set(artists.map((artist) => artist.city))),
  ];

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

    const matchesCity =
      selectedCity === "All" ||
      artist.city === selectedCity;

    let matchesPrice = true;

    if (selectedPrice === "Under ₹50,000") {
      matchesPrice = artist.basePrice < 50000;
    } else if (selectedPrice === "₹50,000 - ₹1,00,000") {
      matchesPrice =
        artist.basePrice >= 50000 &&
        artist.basePrice <= 100000;
    } else if (selectedPrice === "₹1,00,000 - ₹2,00,000") {
      matchesPrice =
        artist.basePrice > 100000 &&
        artist.basePrice <= 200000;
    } else if (selectedPrice === "Above ₹2,00,000") {
      matchesPrice = artist.basePrice > 200000;
    }

    let matchesRating = true;

    if (selectedRating === "4.0+") {
      matchesRating = artist.rating >= 4.0;
    } else if (selectedRating === "4.5+") {
      matchesRating = artist.rating >= 4.5;
    } else if (selectedRating === "4.7+") {
      matchesRating = artist.rating >= 4.7;
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesCity &&
      matchesPrice &&
      matchesRating
    );
  });

  const sortedArtists = [...filteredArtists].sort((a, b) => {
    if (selectedSort === "Price: Low to High") {
      return a.basePrice - b.basePrice;
    }

    if (selectedSort === "Price: High to Low") {
      return b.basePrice - a.basePrice;
    }

    if (selectedSort === "Rating: High to Low") {
      return b.rating - a.rating;
    }

    return 0;
  });

  const totalPages = Math.ceil(
    sortedArtists.length / ARTISTS_PER_PAGE,
  );

  const startIndex =
    (currentPage - 1) * ARTISTS_PER_PAGE;

  const paginatedArtists = sortedArtists.slice(
    startIndex,
    startIndex + ARTISTS_PER_PAGE,
  );

  return (
    <main className="min-h-screen bg-[#08080D] text-white">
      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-full -translate-x-1/2 bg-linear-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 blur-3xl md:w-200" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto w-full max-w-4xl text-center">
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

            <div className="mx-auto mt-10 w-full max-w-3xl">
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
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryOpen((open) => !open);
                    setIsCityOpen(false);
                    setIsPriceOpen(false);
                    setIsRatingOpen(false);
                    setIsSortOpen(false);
                  }}
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
                          setCurrentPage(1);
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

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCityOpen((open) => !open);
                    setIsCategoryOpen(false);
                    setIsPriceOpen(false);
                    setIsRatingOpen(false);
                    setIsSortOpen(false);
                  }}
                  className="flex items-center gap-2 border border-white/10 bg-white/4 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  {selectedCity === "All" ? "City" : selectedCity}

                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className={`text-zinc-500 transition-transform ${
                      isCityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCityOpen && (
                  <div className="absolute left-1/2 z-20 mt-2 max-h-60 w-48 -translate-x-1/2 overflow-y-auto border border-white/10 bg-[#11131A] p-1 text-left shadow-2xl">
                    {cities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city);
                          setCurrentPage(1);
                          setIsCityOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition ${
                          selectedCity === city
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPriceOpen((open) => !open);
                    setIsCategoryOpen(false);
                    setIsCityOpen(false);
                    setIsRatingOpen(false);
                    setIsSortOpen(false);
                  }}
                  className="flex items-center gap-2 border border-white/10 bg-white/4 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  {selectedPrice === "All" ? "Price" : selectedPrice}

                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className={`text-zinc-500 transition-transform ${
                      isPriceOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isPriceOpen && (
                  <div className="absolute left-1/2 z-20 mt-2 w-56 -translate-x-1/2 overflow-hidden border border-white/10 bg-[#11131A] p-1 text-left shadow-2xl">
                    {priceRanges.map((price) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => {
                          setSelectedPrice(price);
                          setCurrentPage(1);
                          setIsPriceOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition ${
                          selectedPrice === price
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsRatingOpen((open) => !open);
                    setIsCategoryOpen(false);
                    setIsCityOpen(false);
                    setIsPriceOpen(false);
                    setIsSortOpen(false);
                  }}
                  className="flex items-center gap-2 border border-white/10 bg-white/4 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  {selectedRating === "All"
                    ? "Rating"
                    : selectedRating}

                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className={`text-zinc-500 transition-transform ${
                      isRatingOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isRatingOpen && (
                  <div className="absolute left-1/2 z-20 mt-2 w-40 -translate-x-1/2 overflow-hidden border border-white/10 bg-[#11131A] p-1 text-left shadow-2xl">
                    {ratingOptions.map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => {
                          setSelectedRating(rating);
                          setCurrentPage(1);
                          setIsRatingOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition ${
                          selectedRating === rating
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm font-medium text-orange-400">
              Explore talent
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Popular artists
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {/* Sort */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSortOpen((open) => !open);
                  setIsCategoryOpen(false);
                  setIsCityOpen(false);
                  setIsPriceOpen(false);
                  setIsRatingOpen(false);
                }}
                className="flex items-center gap-2 border border-white/10 bg-white/4 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
              >
                <span className="text-zinc-500">Sort:</span>
                {selectedSort}

                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  className={`text-zinc-500 transition-transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden border border-white/10 bg-[#11131A] p-1 text-left shadow-2xl">
                  {sortOptions.map((sort) => (
                    <button
                      key={sort}
                      type="button"
                      onClick={() => {
                        setSelectedSort(sort);
                        setCurrentPage(1);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition ${
                        selectedSort === sort
                          ? "bg-white/10 text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-zinc-500">
              {sortedArtists.length} artists available
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="font-mono text-sm text-zinc-500">
              Loading artists...
            </p>
          </div>
        ) : sortedArtists.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center border border-white/10 bg-white/2 px-6 text-center">
            <h3 className="text-xl font-semibold text-white">
              No artists found
            </h3>

            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Try changing your search or selecting a different category,
              city, price range or rating.
            </p>
          </div>
        ) : (
          <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
              />
            ))}
          </div>
        )}

  
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
              className="border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                  className={`flex size-10 items-center justify-center border text-sm transition ${
                    currentPage === page
                      ? "border-orange-400 bg-orange-500/10 text-orange-400"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages),
                )
              }
              disabled={currentPage === totalPages}
              className="border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}