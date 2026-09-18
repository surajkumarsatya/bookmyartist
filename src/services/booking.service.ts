import type { Booking } from "@/types/booking";

const API_DELAY = 1500;

export async function createBooking(
  booking: Booking,
): Promise<Booking> {
  await new Promise((resolve) =>
    setTimeout(resolve, API_DELAY),
  );

  if (Math.random() < 0.15) {
    throw new Error(
      "We couldn't complete your booking request. Please try again.",
    );
  }

  return {
    ...booking,
    status: "Confirmed",
  };
}