
import Image from "next/image";
import Link from "next/link";

type Destination = {
  _id?: string;
  id?: string;
  name: string;
  country: string;
  price: number;
  duration: string;
  imageUrl: string;
};

const AllDestinationsPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations`,{
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error("Failed to fetch destinations");
  }

  const data: unknown = await res.json();

  const destinations: Destination[] = Array.isArray(data)
    ? data
    : typeof data === "object" &&
        data !== null &&
        "destinations" in data &&
        Array.isArray(data.destinations)
      ? data.destinations
      : [];

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[#0C0B0B] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">
            Explore All Destinations
          </h1>

          <p className="mt-2 text-xs text-[#6C696D]">
            Find your perfect travel experience from our curated collection
          </p>
        </div>

        {/* Destination Count */}
        <p className="mb-5 text-xs text-[#6C696D]">
          Showing {destinations.length} destinations
        </p>

        {/* Destination Cards */}
        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination, index) => (
              <article key={destination._id ?? destination.id ?? index}>
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={destination.imageUrl}
                    alt={destination.name}
                    width={600}
                    height={400}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="h-[190px] w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-[150px]"
                  />

                  {/* Rating */}
                  <div className="absolute right-2 top-2 flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-medium">
                    4.5 <span className="text-black">★</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-2">
                  {/* Country */}
                  <p className="flex items-center gap-1 text-[10px] text-[#6C696D]">
                    <span>◎</span>
                    {destination.country}
                  </p>

                  {/* Name and Price */}
                  <div className="mt-1 flex items-start justify-between gap-2">
                  <Link href={`/destinations/${destination._id ?? destination.id}`} className="text-sm font-medium hover:underline">
                    {destination.name}
                  </Link>

                    <p className="shrink-0 text-xs">
                      ${destination.price}
                      <span className="text-[9px] text-[#6C696D]">
                        /Person
                      </span>
                    </p>
                  </div>

                  {/* Duration */}
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-[#6C696D]">
                    <span>▦</span>
                    {destination.duration}
                  </p>

                  {/* Book Now */}
                  <Link
                    href={`/destinations/${destination._id ?? destination.id}`}
                    className="mt-2 inline-flex items-center gap-2 text-[10px] font-medium text-[#15A1BF] hover:underline"
                  >
                    BOOK NOW <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-[#6C696D]">
            No destinations found.
          </p>
        )}
      </div>
    </main>
  );
};

export default AllDestinationsPage;
