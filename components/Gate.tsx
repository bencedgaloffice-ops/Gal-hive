"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Entrance gate — a mood-setting reveal floating over the live apiary. No
 * password: the single button unlocks scroll and fades the gate away.
 */
export default function Gate() {
  const gateRef = useRef<HTMLDivElement | null>(null);
  const enterRef = useRef<HTMLButtonElement | null>(null);
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  // lock scroll while the gate is showing
  useEffect(() => {
    document.body.classList.add("is-locked");
    return () => document.body.classList.remove("is-locked");
  }, []);

  // focus the only interactive element for keyboard users
  useEffect(() => {
    const t = window.setTimeout(
      () => enterRef.current?.focus({ preventScroll: true }),
      reduced ? 0 : 1100,
    );
    return () => window.clearTimeout(t);
  }, [reduced]);

  const open = () => {
    setHidden(true);
    document.body.classList.remove("is-locked");
    if (reduced) {
      setGone(true);
    } else {
      window.setTimeout(() => setGone(true), 950);
    }
  };

  if (gone) return null;

  return (
    <div
      ref={gateRef}
      className={`gate is-ready ${hidden ? "is-hidden" : ""}`}
      role="dialog"
      aria-label="Belépés"
      aria-modal="true"
    >
      <div className="gate__inner">
        <div className="orb orb--gate gate__orb" aria-hidden="true" />
        <h1 className="gate__wordmark">
          <span>{BRAND.first}</span> <em className="brass">{BRAND.second}</em>
        </h1>
        <p className="gate__tagline mono">Nyers méz · Egyetlen származás · Diósd</p>
        <button ref={enterRef} className="gate__enter" type="button" onClick={open}>
          <span className="gate__ring" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="gate__enter-label mono">Belépés</span>
        </button>
      </div>
    </div>
  );
}
