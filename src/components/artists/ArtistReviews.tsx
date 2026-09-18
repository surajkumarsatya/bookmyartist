import { Star } from "lucide-react";

import type { Artist } from "@/types/artist";

interface ArtistReviewsProps {
  artist: Artist;
}

export function ArtistReviews({ artist }: ArtistReviewsProps) {
  const reviews = artist.reviews;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : artist.rating;

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-orange-400">
            Reviews
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What people say
          </h2>
        </div>

        <div className="mt-8 flex flex-col gap-6 border border-white/10 bg-white/2 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-5xl font-bold tracking-tight text-white">
              {averageRating.toFixed(1)}
            </p>

            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={17}
                  fill={
                    index < Math.round(averageRating)
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    index < Math.round(averageRating)
                      ? "text-orange-400"
                      : "text-zinc-600"
                  }
                />
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-white/10 sm:h-12 sm:w-px" />

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Based on
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="border border-white/10 bg-[#11131A] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">
                      {review.author}
                    </p>

                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          fill={
                            index < review.rating
                              ? "currentColor"
                              : "none"
                          }
                          className={
                            index < review.rating
                              ? "text-orange-400"
                              : "text-zinc-600"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <span className="font-mono text-xs text-zinc-600">
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 border border-white/10 bg-white/2 p-8 text-center">
            <p className="text-sm text-zinc-500">
              No reviews yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}