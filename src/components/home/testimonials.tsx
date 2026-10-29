
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical. Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    photo: "/images/person2.png",
    alt: "Portrait of Michael Chen",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommended!",
    name: "Sarah Johnson",
    location: "New York, USA",
    photo: "/images/person1.png",
    alt: "Portrait of Sarah Johnson",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#eafcfd] px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 sm:py-14">
        <Carousel opts={{ loop: true, align: "start" }} className="relative">
          <CarouselPrevious className="top-0 bottom-auto left-auto right-[2.75rem] my-0 size-9" />
          <CarouselNext className="top-0 bottom-auto left-auto right-0 my-0 size-9" />

          <header>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl">
              What Travelers Say
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real experiences from our happy travelers
            </p>
          </header>

          <CarouselContent className="mt-8">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <CarouselItem
                key={`${testimonial.name}-${index}`}
                className="basis-full md:basis-1/2 md:[&:nth-child(n+2)]:border-l md:[&:nth-child(n+2)]:border-[#c3e5ef]"
              >
                <figure className="flex h-full gap-5 pr-1 md:pr-6">
                  <div className="flex flex-1 flex-col">
                    <blockquote className="text-base leading-relaxed text-slate-700 md:text-lg">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    <figcaption className="mt-auto pt-6">
                      <div className="text-[15px] font-semibold text-sky-600">
                        &mdash; {testimonial.name}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </figcaption>
                  </div>

                  <div className="relative w-28 shrink-0 self-stretch sm:w-36">
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.alt}
                      fill
                      sizes="(max-width: 768px) 112px, 144px"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
