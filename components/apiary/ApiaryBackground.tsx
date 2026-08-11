"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { hasWebGL, useQuality } from "@/lib/quality";
import { useReducedMotion } from "@/lib/useReducedMotion";
import StaticFallback from "./StaticFallback";

// The Three.js scene is client-only and code-split so it never runs during SSR
// and doesn't bloat the initial HTML payload.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Chooses what backs the landing page:
 *   - no WebGL            → CSS static apiary
 *   - reduced motion      → WebGL scene rendered once, frozen (no animation)
 *   - otherwise           → the full living scene, paused when scrolled away
 */
export default function ApiaryBackground() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const webglRef = useRef(true);
  const quality = useQuality();
  const reduced = useReducedMotion();

  useEffect(() => {
    webglRef.current = hasWebGL();
    setMounted(true);
  }, []);

  // Pause the render loop once the hero has scrolled well out of view — the
  // solid content sections cover the canvas, so there's nothing to animate.
  useEffect(() => {
    if (reduced) return; // frozen scene never needs the loop
    const onScroll = () => {
      setActive(window.scrollY < window.innerHeight * 1.4);
    };
    const onVisibility = () => setActive(!document.hidden && window.scrollY < window.innerHeight * 1.4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  const content = useMemo(() => {
    if (!mounted) return null;
    if (!webglRef.current) return <StaticFallback />;
    return (
      <Scene
        quality={quality}
        animate={!reduced}
        active={active}
        onReady={() => setReady(true)}
      />
    );
  }, [mounted, quality, reduced, active]);

  // no WebGL → the fallback owns the layer (already full-bleed, no fade needed)
  if (mounted && !webglRef.current) return <StaticFallback />;

  return (
    <div className={`apiary ${ready || reduced ? "is-ready" : ""}`} aria-hidden="true">
      {content}
    </div>
  );
}
