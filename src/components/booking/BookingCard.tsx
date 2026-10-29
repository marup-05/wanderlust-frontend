"use client";

import { authClient } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";
import { Input } from "../ui/input";

type Destination = {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const formatPrice = (price: string) => {
  const value = Number(price);
  return Number.isFinite(value) ? value.toLocaleString() : price;
};

const BookingCard = ({ destination }: { destination: Destination }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const departureDate = formData.get("departureDate");

    console.log(departureDate);

    // router.push("/bookings");

    const { _id: destinationId, ...destinationData } = destination;

    const data = {
      username: user?.name,
      email: user?.email,
      image: user?.image,
      ...destinationData,
      destinationId,
      departureDate,
      bookingDate: new Date(),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const bookingRes = await res.json();
    console.log(bookingRes);
  };

  return (
    <aside>
      <div className="rounded-lg border border-[#ECECEE] bg-white p-5 shadow-sm lg:sticky lg:top-6">
        <p className="text-xs text-[#6C696D]">Starting from</p>

        <p className="mt-1 text-3xl font-semibold text-[#15A1BF]">
          ${formatPrice(destination.price)}
        </p>

        <p className="mt-0.5 text-xs text-[#6C696D]">per person</p>

        {/* Departure Date */}
        <form onSubmit={handleBooking}>
          <div className="mt-5">
            <p className="mb-1.5 text-xs text-[#6C696D]">Departure Date</p>

            <Input
              type="date"
              name="departureDate"
              aria-label="Departure date"
              defaultValue={destination.departureDate}
              className="mt-4"
            />
          </div>

          {/* Book Now */}
          <button
            type="submit"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#15A1BF] text-sm font-medium text-white transition-colors hover:bg-teal-600"
          >
            Book Now
            <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};

export default BookingCard;
