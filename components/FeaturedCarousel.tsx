"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const AUTO_ADVANCE_MS = 3_000;

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
  const rotationControl = useRef<HTMLButtonElement>(null);
  const position = useRef(first);
  const timer = useRef<number>(undefined);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const autoPlaying = count > 1 && playing && !reducedMotion && pageVisible && !hovered && !focused && !touching;
  const cards = slides.map((slide, index) => ({ slide, index, duplicate: false }));
  // One copy at each edge keeps the neighboring artwork visible through a wrap.
  const track = loop ? [
    { ...cards[count - 1], duplicate: true },
    ...cards,
    { ...cards[0], duplicate: true },
  ] : cards;

  const snapTo = useCallback((slot: number, animate: boolean) => {
    const area = viewport.current;
    const card = area?.children[slot] as HTMLElement | undefined;
    if (!area || !card) return;
    const smooth = animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    area.scrollTo({ left: centerOffset(area, card), behavior: smooth ? "smooth" : "auto" });
  }, []);

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
  }, [first, count, snapTo]);

  useEffect(() => {
    if (count < 2) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setPageVisible(!document.hidden);
      setReducedMotion(motion.matches);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [count]);

  useEffect(() => {
    if (!autoPlaying || scrolling) return;
    const advance = window.setTimeout(() => {
      const next = !loop && position.current === count - 1 ? 0 : position.current + 1;
      snapTo(next, true);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(advance);
  }, [active, autoPlaying, count, loop, scrolling, snapTo]);

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
    setScrolling(false);
    if (track[nearest].duplicate) snapTo(slot, false);
  }

  function move(direction: number) {
    snapTo(Math.max(0, Math.min(track.length - 1, position.current + direction)), true);
  }

  if (!count) return null;

  return (
    <section className="featured" aria-label={t.featured} data-single={count === 1}
      onFocus={(event) => setFocused(event.target !== rotationControl.current)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="featured-track" ref={viewport}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") setHovered(false); }}
        onPointerDown={(event) => { if (event.pointerType !== "mouse") setTouching(true); }}
        onPointerUp={() => setTouching(false)}
        onPointerCancel={() => setTouching(false)}
        onScroll={() => {
          setScrolling(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(settle, 150);
        }}
        onKeyDown={(event) => {
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
          <span className="visually-hidden" role="status" aria-live={autoPlaying ? "off" : "polite"}>
            {t.slide(active + 1)} · {slides[active]?.title}
          </span>
          {!reducedMotion && <button type="button" ref={rotationControl}
            onClick={() => setPlaying((value) => !value)} aria-label={playing ? t.pauseSlides : t.playSlides}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M4 3h2v10H4zm6 0h2v10h-2z" /> : <path d="M5 2.5 13 8l-8 5.5z" />}
            </svg>
          </button>}
          <button type="button" onClick={() => move(-1)} aria-label={t.older} disabled={!loop && active === 0}>←</button>
          <button type="button" onClick={() => move(1)} aria-label={t.newer} disabled={!loop && active === count - 1}>→</button>
        </div>
      )}
    </section>
  );
}
