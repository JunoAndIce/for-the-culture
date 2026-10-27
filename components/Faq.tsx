"use client";

import { Plus } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FAQ } from "@/lib/contact";

export default function Faq() {
  return (
    <ol className="border-t border-foreground/15">
      {FAQ.map(({ q, a }, i) => (
        <li key={q} className="border-b border-foreground/15">
          <Collapsible className="group">
            <CollapsibleTrigger className="flex w-full cursor-pointer items-start gap-5 py-6 text-left md:gap-8">
              <span className="pt-1 font-mono text-[0.65rem] tracking-[0.2em] text-red-700 dark:text-red-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-base leading-snug font-medium text-foreground/85 transition-colors group-hover:text-foreground group-data-[state=open]:text-foreground md:text-xl">
                {q}
              </span>
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-foreground/25 transition-[transform,border-color] duration-300 group-hover:border-foreground/60 group-data-[state=open]:rotate-45">
                <Plus aria-hidden="true" className="size-3.5" />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <p className="max-w-2xl pr-12 pb-7 pl-9 text-sm leading-relaxed font-light text-foreground/65 md:pl-12 md:text-base">
                {a}
              </p>
            </CollapsibleContent>
          </Collapsible>
        </li>
      ))}
    </ol>
  );
}
