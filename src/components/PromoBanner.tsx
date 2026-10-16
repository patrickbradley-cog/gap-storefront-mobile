"use client";

import { useEffect, useState } from "react";

const slides = [
  { title: "Friends & Family: 40% off everything — includes new arrivals", sub: "Excludes collaborations." },
  { title: "50% off matching PJs for the whole family", sub: "Select styles." },
  { title: "Extra 20% off your first purchase", sub: "With your new Encore Credit Card." },
];

export function PromoBanner({ tone = "blue" }: { tone?: "blue" | "black" }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);
  const slide = slides[index];
  return (
    <div className={`${tone === "blue" ? "bg-gap-blue" : "bg-black"} px-4 py-3 text-white`}>
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4">
        <div className="text-[13px] leading-snug">
          <p className="font-medium">{slide.title}</p>
          <p className="text-white/85">{slide.sub}</p>
          <div className="mt-2 flex gap-1.5" aria-hidden>
            {slides.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 ${i === index ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
        </div>
        <a href="/offers" className="shrink-0 text-[13px] underline">
          Details
        </a>
      </div>
    </div>
  );
}
