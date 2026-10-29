
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
} from "lucide-react";
import Image from "next/image";

type Booking = {
  _id: string;
  name: string;
  country?: string;
  category?: string;
  price: string | number;
  imageUrl: string;
  departureDate: string;
  bookingDate?: string;
  duration?: string;
  description?: string;
  status?: string;
  username?: string;
  email?: string;
};

const formatDate = (date?: string) => {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const MyBookingDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="mt-2 text-gray-500">
          Log in to view your booking details.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-md bg-[#15A1BF] px-5 py-2.5 text-white"
        >
          Login
        </Link>
      </main>
    );
  }

  let booking: Booking | null = null;
  let errorMessage = "";

  try {
    // 1. Get JWT token
    const token = await getTokenFromServer();

    if (!token) {
      throw new Error("JWT token not found.");
    }

    // 2. Fetch bookings with Authorization header
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${encodeURIComponent(user.email)}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();

      console.error(
        "Booking API error:",
        res.status,
        errorText
      );

      throw new Error(`Failed to fetch bookings: ${res.status}`);
    }

    // 3. Read bookings from backend
    const bookings: Booking[] = await res.json();

    // 4. Find the booking matching the URL ID
    booking = bookings.find((item) => item._id === id) ?? null;
  } catch (error) {
    console.error("Booking details error:", error);
    errorMessage = "Unable to load booking details. Please try again.";
  }

  if (!booking) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-2 text-sm text-[#15A1BF]"
        >
          <ArrowLeft className="size-4" />
          Back to My Bookings
        </Link>

        <h1 className="mt-6 text-2xl font-bold">
          {errorMessage || "Booking not found"}
        </h1>

        <p className="mt-2 text-gray-500">
          {errorMessage
            ? "Check the backend server and authentication token."
            : "This booking could not be found in your bookings list."}
        </p>
      </main>
    );
  }

  const status = booking.status || "Confirmed";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/my-bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#15A1BF]"
        >
          <ArrowLeft className="size-4" />
          Back to My Bookings
        </Link>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="h-64 bg-gray-100 sm:h-80">
            <Image
              height={300}
              width={200}
              src={booking.imageUrl}
              alt={booking.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  {status}
                </span>

                <h1 className="mt-3 text-3xl font-bold text-gray-900">
                  {booking.name}
                </h1>

                {booking.country && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="size-4" />
                    {booking.country}
                  </p>
                )}
              </div>

              <p className="text-2xl font-bold text-[#15A1BF]">
                ${Number(booking.price).toLocaleString("en-US")}
              </p>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <h2 className="text-lg font-semibold text-gray-900">
              Booking Information
            </h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 size-5 text-[#15A1BF]" />
                <div>
                  <p className="text-sm text-gray-500">
                    Departure Date
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {formatDate(booking.departureDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 size-5 text-[#15A1BF]" />
                <div>
                  <p className="text-sm text-gray-500">
                    Booking Date
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {formatDate(booking.bookingDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 size-5 text-[#15A1BF]" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {booking.duration || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserRound className="mt-1 size-5 text-[#15A1BF]" />
                <div>
                  <p className="text-sm text-gray-500">
                    Booking ID
                  </p>
                  <p className="mt-1 break-all font-medium text-gray-900">
                    {booking._id}
                  </p>
                </div>
              </div>
            </div>

            {booking.description && (
              <>
                <div className="my-6 border-t border-gray-200" />

                <h2 className="text-lg font-semibold text-gray-900">
                  About This Destination
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {booking.description}
                </p>
              </>
            )}

            <div className="mt-8">
              <Link
                href="/my-bookings"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#15A1BF] px-5 text-sm font-medium text-white transition-colors hover:bg-teal-600"
              >
                Back to My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyBookingDetailsPage;
