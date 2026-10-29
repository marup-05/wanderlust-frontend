
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden sm:min-h-[420px]">
      <Image
        src="/images/CTA.png"
        alt="Aerial view of an airplane flying over a tropical island"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-black/50"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 text-center sm:px-12">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium text-white sm:text-5xl">
          Ready To Start Your Journey?
        </h2>

        <p className="mt-3 text-sm text-white/85">
          Join thousands of travelers who have discovered the world with us
        </p>

        {/* <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black uppercase transition-colors hover:bg-white/90"
        >
          Book Your Trip Today
          <ArrowRight className="size-4" />
        </button> */}
      </div>
    </section>
  );
}
