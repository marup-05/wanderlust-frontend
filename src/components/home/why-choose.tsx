
import Image from "next/image";

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#eafcfd] px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 sm:py-14">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-foreground sm:text-5xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="border border-[#d3edf5] bg-white px-6 py-8"
            >
              <Image
                src={feature.icon}
                alt=""
                aria-hidden
                width={40}
                height={40}
                className="size-9 sm:size-10"
              />
              <h3 className="mt-5 text-lg font-medium sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
