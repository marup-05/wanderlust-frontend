
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CalendarDays, MapPin, Star } from "lucide-react";
import type { Destination } from "./Featured";
import Image from "next/image";

type Props = {
  destinations: Destination[];
};

const FeaturedCarousel = ({ destinations }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left:
        direction === "right"
          ? scrollRef.current.clientWidth * 0.8
          : -scrollRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const formatPrice = (price: string | number) => {
    const value = Number(price);

    return Number.isFinite(value)
      ? value.toLocaleString("en-US")
      : price;
  };

  return (
    <section className="my-12 bg-white px-4 py-10 text-[#0C0B0B] sm:my-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured Destinations
            </h2>

            <p className="mt-2 text-sm text-[#6C696D]">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <Link
            href="/destinations"
            className="hidden shrink-0 items-center gap-2 border border-[#15A1BF] px-4 py-3 text-xs font-medium text-[#15A1BF] transition hover:bg-[#15A1BF] hover:text-white sm:inline-flex"
          >
            ALL DESTINATIONS
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Destination cards */}
        {destinations.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {destinations.map((destination) => (
              <article
                key={destination._id}
                className="w-[82%] min-w-0 shrink-0 snap-start overflow-hidden bg-white sm:w-[48%] lg:w-[calc((100%-32px)/3)]"
              >
                {/* Image */}
                <Link
                  href={`/destinations/${destination._id}`}
                  className="relative block h-[190px] overflow-hidden bg-gray-100 sm:h-[210px]"
                >
                  <Image
                    src={destination.imageUrl}
                    alt={destination.name}
                    height={600}
                    width={400}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  <span className="absolute right-3 top-3 flex items-center gap-1 bg-white/95 px-2 py-1 text-xs font-medium text-[#0C0B0B]">
                    {(destination.rating ?? 4.5).toFixed(1)}
                    <Star className="size-3 fill-black" />
                  </span>
                </Link>

                {/* Card information */}
                <div className="pt-3">
                  <p className="flex items-center gap-1.5 text-xs text-[#6C696D]">
                    <MapPin className="size-3.5" />
                    {destination.country}
                  </p>

                  <div className="mt-2 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-medium leading-snug">
                      {destination.name}
                    </h3>

                    <p className="shrink-0 text-base font-medium">
                      ${formatPrice(destination.price)}
                      <span className="text-[10px] font-normal text-[#6C696D]">
                        /Person
                      </span>
                    </p>
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#6C696D]">
                    <CalendarDays className="size-3.5" />
                    {destination.duration || "Duration not specified"}
                  </p>

                  {/* Book now */}
                  <Link
                    href={`/destinations/${destination._id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#15A1BF] transition-colors hover:text-teal-700"
                  >
                    BOOK NOW
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-[#6C696D]">
            No featured destinations available right now.
          </div>
        )}

        {/* Slider controls */}
        {destinations.length > 0 && (
          <div className="mt-4 flex items-center gap-4">
            <span className="shrink-0 text-xs text-[#6C696D]">
              1/{destinations.length}
            </span>

            <div className="h-px flex-1 bg-[#ECECEE]" />

            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous destinations"
              className="flex size-9 items-center justify-center rounded-full border border-[#ECECEE] text-[#6C696D] transition hover:border-[#15A1BF] hover:text-[#15A1BF]"
            >
              <ArrowLeft className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next destinations"
              className="flex size-9 items-center justify-center rounded-full border border-[#ECECEE] text-[#6C696D] transition hover:border-[#15A1BF] hover:text-[#15A1BF]"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        <Link
          href="/destinations"
          className="mt-5 inline-flex items-center gap-2 border border-[#15A1BF] px-4 py-3 text-xs font-medium text-[#15A1BF] sm:hidden"
        >
          ALL DESTINATIONS
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
