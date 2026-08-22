import Backdrop from "@/components/Backdrop";
import Globe from "@/components/Globe";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Scene from "@/components/Scene";
import ScrollChevron from "@/components/ScrollChevron";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";

export default function Page() {
  return (
    <div className="relative bg-background">
      <Backdrop />
      <Scene />
      <Navbar />
      <ScrollChevron />

      <main className="relative z-10">
        <Home />
        <Services />
        <Testimonials />
        <Globe />
        <Projects />
      </main>
    </div>
  );
}
