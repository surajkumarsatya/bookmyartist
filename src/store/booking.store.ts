import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Booking } from "@/types/booking";

interface BookingStore {
  bookings: Booking[];

  addBooking: (booking: Booking) => void;

  cancelBooking: (bookingId: string) => void;

  updateBookingDate: (bookingId: string, date: string) => void;

  isDateBooked: (artistId: string, date: string) => boolean;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (booking) => {
        set((state) => ({
          bookings: [...state.bookings, booking],
        }));
      },

      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "Cancelled" }
              : booking,
          ),
        }));
      },

      updateBookingDate: (bookingId, date) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, date }
              : booking,
          ),
        }));
      },

      isDateBooked: (artistId, date) => {
        return get().bookings.some(
          (booking) =>
            booking.artistId === artistId &&
            booking.date === date &&
            booking.status !== "Cancelled",
        );
      },
    }),
    {
      name: "bookmyartist-bookings",
    },
  ),
);