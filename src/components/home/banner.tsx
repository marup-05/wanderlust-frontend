import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", value: "Address, City Or Zip" },
  { label: "Date/Duration", value: "Anytime, 3 Days" },
  { label: "Budget", value: "$0-$3000" },
  { label: "People", value: "5-10" },
];

export default function Banner() {
  return (
    <section className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden lg:min-h-[560px]">
      {/* Background */}
      <Image
        src="/images/Banner.png"
        alt="Aerial view of a turquoise bay surrounded by forested hills"
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55"
      />

      {/* Headline & CTAs */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-56 text-center text-white md:pb-0">
        <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-5xl font-light leading-[1.1] tracking-wide sm:text-6xl">
          Discover Your
          <br />
          Next Adventure
        </h1>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-[15px]">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/* Explore Now - Scroll to Featured Destinations */}
          <a
            href="#featured"
            className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-teal-600"
          >
            Explore Now
            <ArrowRight className="size-4" />
          </a>

          {/* View Destination - Destinations Page */}
          <Link
            href="/destinations"
            className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-xs font-semibold tracking-widest text-white/90 uppercase backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            View Destination
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <form className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 bg-black/40 md:grid-cols-5">
        {searchFields.map((field, index) => (
          <div
            key={field.label}
            className={`px-5 py-4 ${
              index > 0
                ? "border-t border-white/15 md:border-t-0 md:border-l"
                : ""
            }`}
          >
            <label
              htmlFor={field.label.toLowerCase() + "-input"}
              className="block text-sm font-semibold text-white"
            >
              {field.label}
            </label>

            <input
              id={field.label.toLowerCase() + "-input"}
              type="text"
              placeholder={field.value}
              className="mt-1 w-full bg-transparent text-xs text-white/90 placeholder:text-white/70 focus:outline-none"
            />
          </div>
        ))}

        <button
          type="button"
          className="col-span-2 border-t border-white/15 bg-teal-500 py-4 text-sm font-semibold text-white transition-colors hover:bg-teal-600 md:col-span-1 md:border-t-0 md:border-l"
        >
          Search
        </button>
      </form>
    </section>
  );
}
