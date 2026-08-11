"use client";

import { useEffect, useRef, MutableRefObject } from "react";

/**
 * Tracks the pointer in normalized device coordinates (-1..1) on a ref, via a
 * single passive window listener. Used for subtle camera parallax and hive
 * picking. Because it reads `window`, it works even though the canvas layer is
 * `pointer-events: none` (so page content stays fully interactive).
 */
export function usePointerNDC(): MutableRefObject<{ x: number; y: number }> {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return ref;
}
