import { ImageIcon } from "lucide-react";

/**
 * A framed, labelled gap where a real image goes. Dashed on purpose: it should
 * never be mistaken for a finished element.
 */
export default function ImagePlaceholder({
  label,
  ratio = "aspect-[16/9]",
  className = "",
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`grid w-full place-items-center rounded-lg border border-dashed border-foreground/25 bg-foreground/5 ${ratio} ${className}`}
    >
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <ImageIcon
          aria-hidden="true"
          strokeWidth={1.4}
          className="size-5 text-foreground/30"
        />
        <p className="font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}
