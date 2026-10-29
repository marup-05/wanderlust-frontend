import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
} from "lucide-react";
import EditDestinationDialog from "@/components/destination/EditDestinationDialog";
import DeleteDestinationDialog from "@/components/destination/DeleteDestinationDialog";
import BookingCard from "@/components/booking/BookingCard";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

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

// Matches MongoDB ObjectId values used by the backend
const VALID_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

const getDestination = async (id: string): Promise<Destination | null> => {
  if (!VALID_ID_PATTERN.test(id)) {
    return null;
  }
   const token = await getTokenFromServer()  

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations/${id}`, {
    headers: {
      authorization:  `Bearer ${token}`
    },
    
    cache: "no-store",
  });

  // Not found / server error
  if (!res.ok) {
    return null;
  }

  // The API returns an empty body when the destination does not exist
  const text = await res.text();
  if (!text) {
    return null;
  }

  try {
    const destination: Destination = JSON.parse(text);
    return destination?.name ? destination : null;
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    return { title: "Destination Not Found | Wanderlast" };
  }

  return {
    title: `${destination.name.trim()} | Wanderlast`,
    description: destination.description,
  };
}

const formatPrice = (price: string) => {
  const value = Number(price);
  return Number.isFinite(value) ? value.toLocaleString() : price;
};

const DestinationsDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  // Built entirely from fields the API actually returns — no fake data
  const highlights = [
    `Category: ${destination.category}`,
    `Duration: ${destination.duration}`,
    `Departure: ${destination.departureDate}`,
  ];

  const details = [
    { label: "Category", value: destination.category },
    { label: "Duration", value: destination.duration },
    { label: "Departure Date", value: destination.departureDate },
    {
      label: "Starting Price",
      value: `$${formatPrice(destination.price)} / person`,
    },
  ];

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[#0C0B0B] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm text-[#0C0B0B] transition-colors hover:text-[#15A1BF]"
          >
            <ArrowLeft className="size-4" />
            Back to Destinations
          </Link>

          {/* Edit and Cancel */}
          <div className="flex items-center gap-2">
            <EditDestinationDialog
              destination={destination}
            />

            <DeleteDestinationDialog  id={id}/>
            
              
             
          
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 h-[240px] overflow-hidden sm:h-[320px] lg:h-[400px]">
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 96vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          {/* Left: Destination Information */}
          <div>
            <p className="flex items-center gap-1.5 text-xs text-[#6C696D]">
              <MapPin className="size-3.5" />
              {destination.country}
            </p>

            <h1 className="mt-2 text-4xl tracking-tight sm:text-[2.75rem] sm:leading-tight">
              {destination.name}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#6C696D]">
              <span className="rounded-full bg-[#eefbfa] px-3 py-1 text-[#15A1BF]">
                {destination.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {destination.duration}
              </span>
            </div>

            <hr className="my-8 border-[#ECECEE]" />

            {/* Overview */}
            <section>
              <h2 className="text-xl font-medium sm:text-2xl">Overview</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B484D]">
                {destination.description}
              </p>
            </section>

            {/* Highlights */}
            <section className="mt-10">
              <h2 className="text-xl font-medium sm:text-2xl">Highlights</h2>
              <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-[#4B484D]"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>

            {/* Package Details */}
            <section className="mt-10">
              <h2 className="text-xl font-medium sm:text-2xl">
                Package Details
              </h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-4 border-b border-[#ECECEE] pb-3"
                  >
                    <dt className="text-xs text-[#6C696D]">{detail.label}</dt>
                    <dd className="text-sm text-[#0C0B0B]">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* Right: Booking Card */}
            <BookingCard destination={destination}/>
        </div>
      </div>
    </main>
  );
};

export default DestinationsDetailsPage;
