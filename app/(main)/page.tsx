import Banner from "@/components/home/Banner";
import FeaturedItems from "@/components/home/FeaturedItems";
import Categories from "@/components/home/Categories";
import WhyChoose from "@/components/home/WhyChoose";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedItems />
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}