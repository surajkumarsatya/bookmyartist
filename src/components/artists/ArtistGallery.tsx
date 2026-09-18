"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import type { Artist } from "@/types/artist";

interface ArtistGalleryProps {
  artist: Artist;
}

export function ArtistGallery({ artist }: ArtistGalleryProps) {
  const images = [artist.image, ...artist.gallery];

  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-orange-400">
            Gallery
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Behind the performance
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative overflow-hidden border border-white/10 bg-[#11131A] lg:col-span-2">
            <div className="relative aspect-video">
              <Image
                src={images[activeIndex]}
                alt={`${artist.name} gallery image ${activeIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous gallery image"
                  className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                >
                  <ChevronLeft size={20} strokeWidth={1.8} />
                </button>
              )}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next gallery image"
                  className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                >
                  <ChevronRight size={20} strokeWidth={1.8} />
                </button>
              )}

              <div className="absolute bottom-4 right-4 border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </div>

          <div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:h-full lg:grid-cols-2 lg:grid-rows-2">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View gallery image ${index + 1}`}
                    aria-current={activeIndex === index}
                    className={`relative aspect-4/3 overflow-hidden border bg-[#11131A] transition lg:aspect-auto ${
                      activeIndex === index
                        ? "border-orange-400"
                        : "border-white/10 opacity-60 hover:border-white/30 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${artist.name} thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 25vw, 16vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}