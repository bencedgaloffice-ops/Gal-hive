"use client";

import { useEffect, useState } from "react";

export type Tier = "high" | "mid" | "low";

export interface QualitySettings {
  tier: Tier;
  dpr: [number, number];
  beeCount: number;
  grassCount: number;
  flowerCount: number;
  treeCount: number;
  pollenCount: number;
  shadows: boolean;
  postprocessing: boolean;
  depthOfField: boolean;
}

const PRESETS: Record<Tier, QualitySettings> = {
  high: {
    tier: "high",
    dpr: [1, 1.75],
    beeCount: 260,
    grassCount: 14000,
    flowerCount: 120,
    treeCount: 30,
    pollenCount: 110,
    shadows: true,
    postprocessing: true,
    depthOfField: true,
  },
  mid: {
    tier: "mid",
    dpr: [1, 1.4],
    beeCount: 140,
    grassCount: 6000,
    flowerCount: 70,
    treeCount: 22,
    pollenCount: 55,
    shadows: false,
    postprocessing: true,
    depthOfField: false,
  },
  low: {
    tier: "low",
    dpr: [1, 1.25],
    beeCount: 60,
    grassCount: 2200,
    flowerCount: 32,
    treeCount: 14,
    pollenCount: 0,
    shadows: false,
    postprocessing: false,
    depthOfField: false,
  },
};

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/**
 * Decide a rendering tier from device signals. Conservative on purpose:
 * a mobile or memory-starved device drops to a lighter preset so the scene
 * stays smooth rather than beautiful-but-janky.
 */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "high";

  const nav = window.navigator as NavigatorWithMemory;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 820;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;

  if (coarse || narrow) {
    // Phones / tablets: simplified but still alive.
    return memory <= 3 || cores <= 4 ? "low" : "mid";
  }
  if (cores <= 4 || memory <= 4) return "mid";
  return "high";
}

/**
 * React hook: resolves quality after mount (needs the DOM), starting from a
 * safe SSR default. Re-evaluates on resize across the mobile/desktop boundary.
 */
export function useQuality(): QualitySettings {
  const [tier, setTier] = useState<Tier>("high");

  useEffect(() => {
    const resolve = () => setTier(detectTier());
    resolve();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(resolve);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return PRESETS[tier];
}

/** Detect WebGL support without leaking a context. */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
