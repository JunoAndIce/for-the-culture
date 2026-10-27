import Careers from "@/components/Careers";
import Footer from "@/components/Footer";
import Globe from "@/components/Globe";
import Loader from "@/components/Loader";
import Home from "@/components/Home";
import IntroWords from "@/components/IntroWords";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import ScrollChevron from "@/components/ScrollChevron";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Unfold from "@/components/Unfold";

export default function Page() {
  return (
    <div className="relative">
      <Loader />
      <Navbar />
      <ScrollChevron />
      <IntroWords />
      <Unfold />

      <main className="relative z-10">
        <Home />
        <Services />
        <Projects />
        <Testimonials />
        <Globe />
        <Careers />
      </main>

      <Footer />
    </div>
  );
}
