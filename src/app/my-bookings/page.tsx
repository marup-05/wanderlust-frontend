
import MyBookingCard from "@/components/booking/MyBookingCard";
import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { headers } from "next/headers";

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

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-4 text-gray-500">
          Please log in to view your bookings.
        </p>
      </main>
    );
  }

  let bookings: Booking[] = [];

  try {
    // 1. Get JWT token
    const token = await getTokenFromServer();

    // 2. Send token in Authorization header
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${encodeURIComponent(user.email)}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch bookings: ${res.status}`);
    }

    bookings = await res.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view your travel bookings.
        </p>
      </div>

      <div className="space-y-3">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <MyBookingCard
              booking={booking}
              key={booking._id}
            />
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 px-5 py-12 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              No bookings found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your bookings will appear here when you book a destination.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBookingsPage;
