import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import Scene from "@/components/Scene";

export default function Page() {
  return (
    <div className="relative bg-black">
      <Scene />
      <Navbar />

      <main className="relative z-10">
        <Home />

        <section
          data-panel
          className="flex min-h-screen flex-col justify-center p-8 md:items-end md:p-16"
        >
          <p className="max-w-2xl text-3xl md:text-4xl">
            Let us build your vision together.
          </p>
           <p className="max-w-2xl text-4xl md:text-5xl">
            Let us build your vision together.
          </p>
        </section>
      </main>
    </div>
  );
}
