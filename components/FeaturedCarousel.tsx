"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { siteCopy } from "../lib/navigation";
import type { Language } from "../lib/languages";

export type FeaturedSlide = {
  id: string;
  title: string;
  label: string;
  image?: string;
  href: string;
  readHref?: string;
  readLabel: string;
};

function centerOffset(viewport: HTMLElement, card: HTMLElement) {
  return card.offsetLeft + (card.offsetWidth - viewport.clientWidth) / 2;
}

function FeaturedArtwork({ src, priority }: { src: string; priority: boolean }) {
  const [landscape, setLandscape] = useState(false);
  return <>
    <img className="featured-backdrop" data-landscape={landscape} src={src} alt="" draggable={false} />
    <img className="featured-cover" data-landscape={landscape} src={src} alt="" draggable={false}
      fetchPriority={priority ? "high" : "auto"}
      onLoad={({ currentTarget: image }) => setLandscape(image.naturalWidth / image.naturalHeight >= 1.45)} />
  </>;
}

export function FeaturedCarousel({ slides, language }: { slides: FeaturedSlide[]; language: Language }) {
  const t = siteCopy[language];
  const count = slides.length;
  const loop = count >= 3;
  const first = loop ? 1 : 0;
  const viewport = useRef<HTMLDivElement>(null);
  const position = useRef(first);
  const timer = useRef<number>(undefined);
  const [active, setActive] = useState(0);
  const cards = slides.map((slide, index) => ({ slide, index, duplicate: false }));
  // One copy at each edge keeps the neighboring artwork visible through a wrap.
  const track = loop ? [
    { ...cards[count - 1], duplicate: true },
    ...cards,
    { ...cards[0], duplicate: true },
  ] : cards;

  function snapTo(slot: number, animate: boolean) {
    const area = viewport.current;
    const card = area?.children[slot] as HTMLElement | undefined;
    if (!area || !card) return;
    const smooth = animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    area.scrollTo({ left: centerOffset(area, card), behavior: smooth ? "smooth" : "auto" });
  }

  useLayoutEffect(() => {
    const area = viewport.current;
    if (!area) return;
    let width = area.clientWidth;
    position.current = first;
    snapTo(first, false);
    const observer = new ResizeObserver(() => {
      if (width === area.clientWidth) return;
      width = area.clientWidth;
      snapTo(position.current, false);
    });
    observer.observe(area);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [first, count]);

  function settle() {
    const area = viewport.current;
    if (!area) return;
    let nearest = position.current;
    let distance = Infinity;
    for (const [slot, card] of Array.from(area.children).entries()) {
      const gap = Math.abs(area.scrollLeft - centerOffset(area, card as HTMLElement));
      if (gap < distance) {
        nearest = slot;
        distance = gap;
      }
    }
    const index = track[nearest].index;
    const slot = first + index;
    position.current = slot;
    setActive(index);
    if (track[nearest].duplicate) snapTo(slot, false);
  }

  function move(direction: number) {
    snapTo(Math.max(0, Math.min(track.length - 1, position.current + direction)), true);
  }

  if (!count) return null;

  return (
    <section className="featured" aria-label={t.featured} data-single={count === 1}>
      <div className="featured-track" ref={viewport} onScroll={() => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(settle, 150);
      }} onKeyDown={(event) => {
        if (count < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }}>
        {track.map(({ slide, index, duplicate }, slot) => {
          const selected = !duplicate && active === index;
          return <article key={duplicate ? `edge-${slide.id}` : slide.id} className="featured-slide"
            data-active={selected} aria-hidden={!selected}
            onClick={selected ? undefined : () => snapTo(slot, true)}>
            {slide.image && <FeaturedArtwork src={slide.image} priority={index === 0 && !duplicate} />}
            <div className="featured-caption">
              <p className="featured-label">{slide.label}</p>
              <h2><Link className="featured-title" href={slide.href} tabIndex={selected ? undefined : -1}>
                {slide.title}
              </Link></h2>
              <div className="featured-actions">
                <Link className="featured-button" href={slide.readHref ?? slide.href} tabIndex={selected ? undefined : -1}>
                  {slide.readHref ? slide.readLabel : t.details}<span aria-hidden="true">→</span>
                </Link>
                {count > 1 && <span className="featured-count" aria-hidden="true">{index + 1} / {count}</span>}
              </div>
            </div>
          </article>;
        })}
      </div>
      {count > 1 && (
        <div className="featured-controls">
          <span className="visually-hidden" role="status">{t.slide(active + 1)} · {slides[active]?.title}</span>
          <button type="button" onClick={() => move(-1)} aria-label={t.older} disabled={!loop && active === 0}>←</button>
          <button type="button" onClick={() => move(1)} aria-label={t.newer} disabled={!loop && active === count - 1}>→</button>
        </div>
      )}
    </section>
  );
}
