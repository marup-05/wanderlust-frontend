import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { headers } from "next/headers";

type Booking = {
  _id: string;
  name: string;
  country?: string;
  price: string | number;
  departureDate: string;
  bookingDate?: string;
  status?: string;
  bookingId?: string;
};

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-3 text-gray-500">
          Please log in to view your profile.
        </p>

        <Link
          href="/login"
          className="mt-5 inline-block rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
        >
          Log In
        </Link>
      </main>
    );
  }

  let bookings: Booking[] = [];
  let fetchError = false;

  try {
    const token = await getTokenFromServer();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${encodeURIComponent(
        user.email
      )}`,
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

    const data = await res.json();

    bookings = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching profile bookings:", error);
    fetchError = true;
  }

  const latestBooking = [...bookings].sort((a, b) => {
    const dateA = new Date(
      a.bookingDate || a.departureDate
    ).getTime();

    const dateB = new Date(
      b.bookingDate || b.departureDate
    ).getTime();

    return dateB - dateA;
  })[0];

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your account and view your travel bookings.
          </p>
        </div>

        {/* Personal details */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="mt-1 font-medium text-gray-900">
                {user.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="mt-1 break-all font-medium text-gray-900">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Booking summary */}
        <section className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            My Bookings
          </h2>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-sm text-gray-500">
                Total Bookings
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {fetchError ? "—" : bookings.length}
              </p>
            </div>

            <Link
              href="/my-bookings"
              className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              View All
            </Link>
          </div>

          {/* Latest booking */}
          <div className="mt-6">
            <h3 className="mb-4 font-semibold text-gray-900">
              Latest Booking
            </h3>

            {fetchError ? (
              <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                Unable to load your bookings. Please try again later.
              </p>
            ) : latestBooking ? (
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Destination
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {latestBooking.name}
                  </p>
                  {latestBooking.country && (
                    <p className="mt-1 text-sm text-gray-500">
                      {latestBooking.country}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Cost
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                     ${typeof latestBooking.price === "number"
                        ? latestBooking.price.toLocaleString()
                        : latestBooking.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Departure Date
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(latestBooking.departureDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Booking Date
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(latestBooking.bookingDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Status
                    </p>
                    <p className="mt-1">
                      <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                        {latestBooking.status || "Pending"}
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  href="/my-bookings"
                  className="inline-block pt-1 text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                  View booking details →
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">
                <p className="font-medium text-gray-800">
                  No bookings yet
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Your travel bookings will appear here.
                </p>
                <Link
                  href="/destinations"
                  className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Explore Destinations
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
