"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  MapPin,
  RotateCcw,
} from "lucide-react";

import type { Artist, EventType } from "@/types/artist";
import type { Booking } from "@/types/booking";

import { createBooking } from "@/services/booking.service";
import { useBookingStore } from "@/store/booking.store";

interface BookingFlowProps {
  artist: Artist;
  initialDate: string | null;
  initialEventType: EventType;
}

const eventTypes: EventType[] = [
  "Wedding",
  "Corporate",
  "College Fest",
  "Private Party",
];

function isWeekend(date: Date) {
  const day = date.getDay();

  return day === 0 || day === 6;
}

function calculatePrice(
  artist: Artist,
  date: string,
  eventType: EventType,
) {
  const selectedDate = new Date(`${date}T00:00:00`);

  const dayMultiplier = isWeekend(selectedDate)
    ? artist.pricing.weekendMultiplier
    : artist.pricing.weekdayMultiplier;

  const eventMultiplier =
    artist.pricing.eventTypeMultipliers[eventType];

  return Math.round(
    artist.basePrice * dayMultiplier * eventMultiplier,
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

export function BookingFlow({
  artist,
  initialDate,
  initialEventType,
}: BookingFlowProps) {
  const [step, setStep] = useState(1);

  const [date, setDate] = useState(initialDate ?? "");

  const [eventType, setEventType] =
    useState<EventType>(initialEventType);

  const [city, setCity] = useState("");

  const [audienceSize, setAudienceSize] = useState("");

  const [eventName, setEventName] = useState("");

  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [bookingConfirmed, setBookingConfirmed] =
    useState<Booking | null>(null);

  const addBooking = useBookingStore(
    (state) => state.addBooking,
  );

  const isDateBooked = useBookingStore(
    (state) => state.isDateBooked,
  );

  const estimatedPrice = useMemo(() => {
    if (!date) {
      return 0;
    }

    return calculatePrice(artist, date, eventType);
  }, [artist, date, eventType]);

  const validateStepOne = () => {
    const nextErrors: Record<string, string> = {};

    if (!date) {
      nextErrors.date = "Please select an event date.";
    } else {
      const selectedDate = new Date(`${date}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        nextErrors.date =
          "Please select a future event date.";
      } else if (
        artist.availability.bookedDates.includes(date) ||
        isDateBooked(artist.id, date)
      ) {
        nextErrors.date =
          "This date is no longer available. Please choose another date.";
      }
    }

    if (!eventType) {
      nextErrors.eventType =
        "Please select an event type.";
    }

    if (!city.trim()) {
      nextErrors.city = "Please enter the event city.";
    }

    if (!audienceSize) {
      nextErrors.audienceSize =
        "Please enter the expected audience size.";
    } else if (
      !/^\d+$/.test(audienceSize) ||
      Number(audienceSize) <= 0
    ) {
      nextErrors.audienceSize =
        "Audience size must be a valid number greater than 0.";
    }

    if (!eventName.trim()) {
      nextErrors.eventName = "Please enter your event name.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const validateStepTwo = () => {
    const nextErrors: Record<string, string> = {};

    if (!contactName.trim()) {
      nextErrors.contactName = "Please enter your name.";
    }

    if (!email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      nextErrors.phone =
        "Please enter your phone number.";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      nextErrors.phone =
        "Phone number must contain exactly 10 digits.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const goToStepTwo = () => {
    if (validateStepOne()) {
      setStep(2);
    }
  };

  const goToStepThree = () => {
    if (validateStepTwo()) {
      setStep(3);
    }
  };

  const submitBooking = async () => {
    if (!date) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      artistId: artist.id,
      artistName: artist.name,
      artistImage: artist.image,

      date,
      eventType,
      city: city.trim(),
      audienceSize: Number(audienceSize),

      eventName: eventName.trim(),

      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),

      estimatedPrice,

      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const confirmedBooking =
        await createBooking(booking);

      addBooking(confirmedBooking);

      setBookingConfirmed(confirmedBooking);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <main className="min-h-screen bg-[#08080D] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full border border-white/10 bg-[#11131A] p-8 text-center sm:p-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-orange-400/20 bg-orange-500/10 text-orange-400">
              <Check size={28} strokeWidth={2} />
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-orange-400">
              Booking confirmed
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Your request is confirmed
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-400">
              Your booking with {artist.name} has been
              successfully created.
            </p>

            <div className="mt-8 border border-white/10 bg-white/2 p-5 text-left">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-zinc-500">
                  Artist
                </span>

                <span className="text-right text-sm font-medium text-white">
                  {artist.name}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-zinc-500">
                  Date
                </span>

                <span className="text-right text-sm font-medium text-white">
                  {formatDate(bookingConfirmed.date)}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-zinc-500">
                  Event
                </span>

                <span className="text-right text-sm font-medium text-white">
                  {bookingConfirmed.eventName}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-zinc-500">
                  Event type
                </span>

                <span className="text-right text-sm font-medium text-white">
                  {bookingConfirmed.eventType}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-zinc-500">
                  City
                </span>

                <span className="text-right text-sm font-medium text-white">
                  {bookingConfirmed.city}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-zinc-500">
                  Audience
                </span>

                <span className="text-right text-sm font-medium text-white">
                  {bookingConfirmed.audienceSize.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-zinc-500">
                  Estimated price
                </span>

                <span className="text-right text-sm font-semibold text-white">
                  ₹
                  {bookingConfirmed.estimatedPrice.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex-1 border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Find More Artists
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080D] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/artists/${artist.id}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to artist
        </Link>

        <div className="mt-10">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-400">
            Booking request
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Book {artist.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
            <MapPin size={15} />
            {artist.city}
            <span>·</span>
            {artist.category}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber}>
              <div
                className={`h-1 ${
                  step >= stepNumber
                    ? "bg-linear-to-r from-orange-500 to-pink-500"
                    : "bg-white/10"
                }`}
              />

              <p
                className={`mt-2 font-mono text-[10px] uppercase tracking-wider ${
                  step >= stepNumber
                    ? "text-white"
                    : "text-zinc-600"
                }`}
              >
                {stepNumber === 1
                  ? "Event details"
                  : stepNumber === 2
                    ? "Contact"
                    : "Review"}
              </p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="mt-10 border border-white/10 bg-[#11131A] p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Tell us about your event
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Choose the date and provide the details of
              your event.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="booking-date"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500"
                >
                  Event date
                </label>

                <input
                  id="booking-date"
                  type="date"
                  value={date}
                  min={new Date()
                    .toISOString()
                    .split("T")[0]}
                  onChange={(event) => {
                    setDate(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      date: "",
                    }));
                  }}
                  className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none focus:border-orange-400/50"
                />

                {errors.date && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-event-type"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500"
                >
                  Event type
                </label>

                <select
                  id="booking-event-type"
                  value={eventType}
                  onChange={(event) => {
                    setEventType(
                      event.target.value as EventType,
                    );

                    setErrors((current) => ({
                      ...current,
                      eventType: "",
                    }));
                  }}
                  className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none focus:border-orange-400/50"
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {errors.eventType && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.eventType}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-city"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500"
                >
                  Event city
                </label>

                <input
                  id="booking-city"
                  type="text"
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      city: "",
                    }));
                  }}
                  placeholder="e.g. Mumbai"
                  className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                />

                {errors.city && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="audience-size"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500"
                >
                  Expected audience size
                </label>

                <input
                  id="audience-size"
                  type="number"
                  min="1"
                  value={audienceSize}
                  onChange={(event) => {
                    setAudienceSize(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      audienceSize: "",
                    }));
                  }}
                  placeholder="e.g. 500"
                  className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                />

                {errors.audienceSize && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.audienceSize}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="event-name"
                className="font-mono text-xs uppercase tracking-wider text-zinc-500"
              >
                Event name
              </label>

              <input
                id="event-name"
                type="text"
                value={eventName}
                onChange={(event) => {
                  setEventName(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    eventName: "",
                  }));
                }}
                placeholder="e.g. Rahul & Priya Wedding"
                className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
              />

              {errors.eventName && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.eventName}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={goToStepTwo}
                className="bg-linear-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-10 border border-white/10 bg-[#11131A] p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Your contact details
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              We&apos;ll use these details to contact you about
              the booking.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="contact-name"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500"
                >
                  Full name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(event) => {
                    setContactName(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      contactName: "",
                    }));
                  }}
                  placeholder="Your full name"
                  className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                />

                {errors.contactName && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500"
                >
                  Email address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      email: "",
                    }));
                  }}
                  placeholder="you@example.com"
                  className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                />

                {errors.email && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500"
                >
                  Phone number
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                  maxLength={10}
                  placeholder="10-digit phone number"
                  className="mt-2 w-full border border-white/10 bg-[#08080D] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50"
                />

                {errors.phone && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setStep(1);
                }}
                className="border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                Back
              </button>

              <button
                type="button"
                onClick={goToStepThree}
                className="bg-linear-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                Review Booking
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-10">
            <div className="border border-white/10 bg-[#11131A] p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                Review your booking
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Check everything before confirming your request.
              </p>

              <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                <div className="flex justify-between gap-6 py-4">
                  <span className="text-sm text-zinc-500">
                    Artist
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {artist.name}
                  </span>
                </div>

                <div className="flex justify-between gap-6 py-4">
                  <span className="text-sm text-zinc-500">
                    Event
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {eventName}
                  </span>
                </div>

                <div className="flex justify-between gap-6 py-4">
                  <span className="text-sm text-zinc-500">
                    Event type
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {eventType}
                  </span>
                </div>

                <div className="flex justify-between gap-6 py-4">
                  <span className="text-sm text-zinc-500">
                    Date
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {date ? formatDate(date) : "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-6 py-4">
                  <span className="text-sm text-zinc-500">
                    City
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {city}
                  </span>
                </div>

                <div className="flex justify-between gap-6 py-4">
                  <span className="text-sm text-zinc-500">
                    Audience size
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {audienceSize
                      ? Number(audienceSize).toLocaleString(
                          "en-IN",
                        )
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-6 py-4">
                  <span className="text-sm text-zinc-500">
                    Contact
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {contactName}
                    <br />
                    {email}
                    <br />
                    {phone}
                  </span>
                </div>

                <div className="flex justify-between gap-6 py-5">
                  <span className="text-sm text-zinc-500">
                    Estimated price
                  </span>

                  <span className="text-xl font-bold text-white">
                    ₹{estimatedPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="mt-6 border border-red-400/20 bg-red-400/5 p-4">
                  <p className="text-sm text-red-400">
                    {submitError}
                  </p>

                  <button
                    type="button"
                    onClick={submitBooking}
                    disabled={isSubmitting}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4"
                  >
                    <RotateCcw size={14} />
                    Try again
                  </button>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={submitBooking}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}