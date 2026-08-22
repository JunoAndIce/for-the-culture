import Image from "next/image";

const BACKDROP_OPACITY = "opacity-25";

export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Image
        src="/background-1.webp"
        alt=""
        fill
        // Bottom of the page and always in view, so it should never be lazy.
        priority
        sizes="100vw"
        className={`object-cover ${BACKDROP_OPACITY}`}
      />
    </div>
  );
}
