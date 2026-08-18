import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import Scene from "@/components/Scene";
import ScrollChevron from "@/components/ScrollChevron";
import Services from "@/components/Services";

export default function Page() {
  return (
    <div className="relative bg-black">
      <Scene />
      <Navbar />
      <ScrollChevron />

      <main className="relative z-10">
        <Home />
        <Services />
      </main>
    </div>
  );
}
