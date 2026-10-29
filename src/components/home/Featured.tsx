
import FeaturedCarousel from "./FeaturedCarousel";

export type Destination = {
  _id: string;
  name: string;
  country: string;
  category?: string;
  price: string | number;
  duration: string;
  departureDate?: string;
  imageUrl: string;
  description?: string;
  rating?: number;
};

const Featured = async () => {
  let destinations: Destination[] = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const res = await fetch(`${apiUrl}/featured-destinations`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch featured destinations: ${res.status}`
      );
    }

    const data = await res.json();

    destinations = Array.isArray(data)
      ? data
      : Array.isArray(data.destinations)
        ? data.destinations
        : Array.isArray(data.data)
          ? data.data
          : [];
  } catch (error) {
    console.error("Featured destinations error:", error);
  }

  return (
    <section id="featured" className="scroll-mt-24">
      <FeaturedCarousel destinations={destinations} />
    </section>
  );
};

export default Featured;
