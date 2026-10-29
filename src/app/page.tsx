
import Banner from "@/components/home/banner";
import WhyChoose from "@/components/home/why-choose";
import Testimonials from "@/components/home/testimonials";
import Cta from "@/components/home/cta";
import Featured from "@/components/home/Featured";

export const dynamic = "force-dynamic";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
     
      <Banner />
      <Featured />
      <WhyChoose />
      <Testimonials />
      <Cta />
     
    </div>
  );
}
