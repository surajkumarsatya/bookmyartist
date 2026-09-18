"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";

import type { Artist, EventType } from "@/types/artist";
import { useRouter } from "next/navigation";

interface ArtistAvailabilityProps {
  artist: Artist;
}

const eventTypes: EventType[] = [
  "Wedding",
  "Corporate",
  "College Fest",
  "Private Party",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isWeekend(date: Date) {
  const day = date.getDay();

  return day === 0 || day === 6;
}

export function ArtistAvailability({
  artist,
}: ArtistAvailabilityProps) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [selectedEventType, setSelectedEventType] =
    useState<EventType>("Wedding");

  const bookedDates = useMemo(
    () => new Set(artist.availability.bookedDates),
    [artist.availability.bookedDates],
  );

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);

    const firstDayIndex = (firstDay.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];

    for (let index = 0; index < firstDayIndex; index++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const todayKey = getDateKey(today);

  const isCurrentMonth =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  const canGoPreviousMonth = !isCurrentMonth;

  const selectedDateIsAvailable =
    selectedDate !== null &&
    selectedDate >= todayKey &&
    !bookedDates.has(selectedDate);

  const estimatedPrice = useMemo(() => {
    if (!selectedDateIsAvailable || !selectedDate) {
      return null;
    }

    const date = new Date(`${selectedDate}T00:00:00`);

    const dayMultiplier = isWeekend(date)
      ? artist.pricing.weekendMultiplier
      : artist.pricing.weekdayMultiplier;

    const eventMultiplier =
      artist.pricing.eventTypeMultipliers[selectedEventType];

    return Math.round(
      artist.basePrice * dayMultiplier * eventMultiplier,
    );
  }, [
    artist,
    selectedDate,
    selectedDateIsAvailable,
    selectedEventType,
  ]);

  const monthLabel = currentMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    if (!canGoPreviousMonth) {
      return;
    }

    setCurrentMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1,
        ),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1,
        ),
    );
  };

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-orange-400">
            Availability
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Check availability & pricing
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Choose an available date and event type to get an estimated
            booking price.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-white/10 bg-[#11131A] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  Select a date
                </p>

                <h3 className="mt-1 text-xl font-semibold text-white">
                  {monthLabel}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  disabled={!canGoPreviousMonth}
                  aria-label="Previous month"
                  className="flex size-9 items-center justify-center border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={17} strokeWidth={1.8} />
                </button>

                <button
                  type="button"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                  className="flex size-9 items-center justify-center border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  <ChevronRight size={17} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-600"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square"
                    />
                  );
                }

                const dateKey = getDateKey(date);
                const isPast = dateKey < todayKey;
                const isBooked = bookedDates.has(dateKey);
                const isToday = dateKey === todayKey;
                const isSelected = selectedDate === dateKey;
                const isAvailable = !isPast && !isBooked;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedDate(dateKey)}
                    aria-label={`${formatDate(dateKey)}${
                      isBooked ? " - booked" : ""
                    }${isPast ? " - unavailable" : ""}`}
                    className={`relative flex aspect-square items-center justify-center border text-sm transition ${
                      isSelected
                        ? "border-orange-400 bg-orange-500/15 text-orange-300"
                        : isBooked
                          ? "cursor-not-allowed border-transparent bg-white/2 text-zinc-700"
                          : isPast
                            ? "cursor-not-allowed border-transparent text-zinc-700"
                            : "border-transparent text-zinc-300 hover:border-white/15 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {date.getDate()}

                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 size-1 rounded-full bg-orange-400" />
                    )}

                    {isBooked && (
                      <span className="absolute right-1 top-1 size-1 rounded-full bg-zinc-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Circle size={8} fill="currentColor" />
                Available
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Circle size={8} fill="currentColor" className="text-zinc-700" />
                Booked
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="size-2 rounded-full bg-orange-400" />
                Today
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-[#11131A] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-orange-400/20 bg-orange-500/10 text-orange-400">
                <CalendarDays size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  Price estimator
                </p>

                <h3 className="mt-1 text-lg font-semibold text-white">
                  Build your estimate
                </h3>
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="event-type"
                className="font-mono text-xs uppercase tracking-wider text-zinc-500"
              >
                Event type
              </label>

              <select
                id="event-type"
                value={selectedEventType}
                onChange={(event) =>
                  setSelectedEventType(event.target.value as EventType)
                }
                className="mt-2 w-full appearance-none border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50"
              >
                {eventTypes.map((eventType) => (
                  <option
                    key={eventType}
                    value={eventType}
                    className="bg-[#11131A]"
                  >
                    {eventType}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 border border-white/10 bg-white/2 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Selected date
              </p>

              <div className="mt-2 flex items-center gap-2">
                {selectedDateIsAvailable ? (
                  <>
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="text-orange-400"
                    />

                    <p className="text-sm font-medium text-white">
                      {formatDate(selectedDate!)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Select an available date
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 border-y border-white/10 py-6">
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                Estimated price
              </p>

              {estimatedPrice !== null ? (
                <>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-white">
                    ₹{estimatedPrice.toLocaleString("en-IN")}
                  </p>

                  <p className="mt-2 text-xs text-zinc-600">
                    Base price ₹
                    {artist.basePrice.toLocaleString("en-IN")} ×{" "}
                    {isWeekend(
                      new Date(`${selectedDate}T00:00:00`),
                    )
                      ? artist.pricing.weekendMultiplier
                      : artist.pricing.weekdayMultiplier}{" "}
                    ×{" "}
                    {
                      artist.pricing.eventTypeMultipliers[
                        selectedEventType
                      ]
                    }
                  </p>
                </>
              ) : (
                <p className="mt-2 text-2xl font-bold text-zinc-600">
                  —
                </p>
              )}
            </div>

            <button
                type="button"
                disabled={!selectedDateIsAvailable}
                onClick={() => {
                    if (!selectedDate) {
                    return;
                    }

                    router.push(
                    `/artists/${artist.id}/book?date=${selectedDate}&eventType=${encodeURIComponent(selectedEventType)}`,
                    );
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                Request to Book
                </button>

            {!selectedDateIsAvailable && (
              <p className="mt-3 text-center text-xs text-zinc-600">
                Select an available date to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}