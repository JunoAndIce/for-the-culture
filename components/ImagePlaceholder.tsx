import { ImageIcon } from "lucide-react";

/**
 * A framed, labelled gap where a real image goes. Dashed on purpose: it should
 * never be mistaken for a finished element.
 *
 * `compact` is for small slots, like a row of partner logos: tighter padding,
 * a smaller label, and no icon below md where the slot is too short for one.
 */
export default function ImagePlaceholder({
  label,
  ratio = "aspect-[16/9]",
  className = "",
  compact = false,
}: {
  label: string;
  ratio?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`grid w-full place-items-center rounded-lg border border-dashed border-foreground/25 bg-foreground/5 ${ratio} ${className}`}
    >
      <div
        className={`flex flex-col items-center text-center ${
          compact ? "gap-1.5 px-1.5 md:px-2" : "gap-2 px-6"
        }`}
      >
        <ImageIcon
          aria-hidden="true"
          strokeWidth={1.4}
          className={`text-foreground/30 ${
            compact ? "hidden size-3.5 md:block" : "size-5"
          }`}
        />
        <p
          className={`font-mono text-foreground/40 uppercase ${
            compact
              ? "text-[0.53rem] tracking-[0.16em] md:text-[0.5625rem] md:tracking-[0.2em]"
              : "text-[0.6rem] tracking-[0.28em]"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
