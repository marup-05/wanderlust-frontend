
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  name: string;
  country?: string;
  price: string | number;
  imageUrl: string;
  departureDate: string;
  bookingDate?: string;
  duration?: string;
  description?: string;
  status?: string;
  bookingId?: string;
};

type MyBookingCardProps = {
  booking: Booking;
};

const MyBookingCard = ({ booking }: MyBookingCardProps) => {
  const router = useRouter();

  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  const status = booking.status?.toLowerCase() || "confirmed";
  const isConfirmed = status === "confirmed";

  const formattedDate = booking.departureDate
    ? new Date(
        `${booking.departureDate.slice(0, 10)}T00:00:00`,
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

  const price = Number(booking.price);

  const formattedPrice = Number.isFinite(price)
    ? price.toLocaleString("en-US")
    : booking.price;

  const handleCancelBooking = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${booking.name}"?`,
    );

    if (!confirmed) return;

    setIsCancelling(true);
    setError("");

    try {
      // Get a JWT token from Better Auth
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        console.error("Could not get authentication token:", tokenError);
        setError("Authentication token পাওয়া যায়নি। আবার login করে চেষ্টা করো।");
        return;
      }

      // Send the token with the DELETE request
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${booking._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Booking cancellation failed:", res.status, result);

        setError(
          result?.message ||
            (res.status === 401
              ? "Login session invalid বা expired। আবার login করো।"
              : `Cancellation failed (${res.status}).`),
        );

        return;
      }

      if (!result?.success) {
        console.error("Unexpected delete response:", result);
        setError("Booking delete নিশ্চিত করা যায়নি। আবার চেষ্টা করো।");
        return;
      }

      console.log("Booking cancelled successfully:", result);

      // Refresh the server-rendered bookings list
      router.refresh();
      router.push("/my-bookings");
    } catch (err) {
      console.error("Cancellation request failed:", err);

      setError(
        "Server-এর সঙ্গে connect করা যায়নি। Backend ও API URL check করো।",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <article className="flex flex-col gap-4 border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      {/* Destination image */}
      <div className="h-48 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-[108px] sm:w-[194px]">
        <Image
          src={booking.imageUrl}
          alt={booking.name}
          width={194}
          height={108}
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Booking information */}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${
              isConfirmed
                ? "bg-green-50 text-green-600"
                : status === "pending"
                  ? "bg-orange-50 text-orange-600"
                  : "bg-red-50 text-red-600"
            }`}
          >
            {isConfirmed ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <Clock className="size-3" />
            )}

            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <h2 className="truncate text-xl font-semibold tracking-tight text-gray-900">
          {booking.name}
        </h2>

        {booking.country && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="size-3" />
            {booking.country}
          </p>
        )}

        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarDays className="size-3.5" />
          <span>Departure: {formattedDate}</span>
        </p>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="size-3.5" />
          <span>Booking ID: {booking.bookingId || booking._id}</span>
        </p>

        <p className="mt-1 text-xl font-semibold text-[#15A1BF]">
          ${formattedPrice}
        </p>

        {error && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 items-center justify-end gap-2 sm:self-end">
        <button
          onClick={handleCancelBooking}
          type="button"
          disabled={isCancelling}
          className="inline-flex h-9 items-center justify-center gap-1.5 border border-red-300 px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="size-3.5" />
          {isCancelling ? "Cancelling..." : "Cancel"}
        </button>

        <Link
          href={`/my-bookings/${booking._id}`}
          className="inline-flex h-9 items-center justify-center gap-1.5 bg-[#15A1BF] px-3 text-xs font-medium text-white transition-colors hover:bg-teal-600"
        >
          <Eye className="size-3.5" />
          View
        </Link>
      </div>
    </article>
  );
};

export default MyBookingCard;
