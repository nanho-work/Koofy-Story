"use client";

import Link from "next/link";
import { useState } from "react";
import { siteCopy } from "../lib/navigation";
import type { Language } from "../lib/languages";

export type FeaturedSlide = {
  id: string;
  title: string;
  label: string;
  summary: string;
  image?: string;
  href: string;
  readHref?: string;
  readLabel: string;
};

export function FeaturedCarousel({ slides, language }: { slides: FeaturedSlide[]; language: Language }) {
  const [index, setIndex] = useState(0);
  const t = siteCopy[language];
  const slide = slides[index % slides.length];
  if (!slide) return null;
  const move = (delta: number) => setIndex((index) => (index + delta + slides.length) % slides.length);

  return (
    <section className="featured" aria-label={t.featured}>
      <div className="featured-frame" aria-live="polite" onKeyDown={(event) => {
        if (slides.length < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }}>
        <div className="featured-slide" key={slide.id}>
          <div className="featured-copy">
            <p className="featured-label">{slide.label}</p>
            <h2>{slide.title}</h2>
            {slide.summary && <p className="featured-summary">{slide.summary}</p>}
            <div className="featured-links">
              <Link className="featured-button" href={slide.readHref ?? slide.href}>
                {slide.readHref ? slide.readLabel : t.details}<span aria-hidden="true">↗</span>
              </Link>
              {slide.readHref && <Link className="featured-detail-link" href={slide.href}>{t.details}</Link>}
            </div>
          </div>
          {slide.image && <div className="featured-art">
            <img className="featured-wash" src={slide.image} alt="" aria-hidden="true" />
            <img className="featured-image" src={slide.image} alt="" fetchPriority={index === 0 ? "high" : "auto"} />
          </div>}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="featured-controls">
          <div className="slide-indicators">
            {slides.map((entry, i) => <button type="button" key={entry.id} onClick={() => setIndex(i)} aria-label={t.slide(i + 1)} aria-current={i === index ? "true" : undefined}><span /></button>)}
          </div>
          <div className="slide-arrows">
            <button type="button" onClick={() => move(-1)} aria-label={t.older}>←</button>
            <button type="button" onClick={() => move(1)} aria-label={t.newer}>→</button>
          </div>
        </div>
      )}
    </section>
  );
}
