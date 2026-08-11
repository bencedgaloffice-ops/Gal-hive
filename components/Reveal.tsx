"use client";

import { ElementType, ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}

/**
 * Fades + rises its content into view once, when ~15% is visible. The outer
 * element keeps its (solid or transparent) background at all times — only an
 * inner wrapper animates — so a section's backdrop never flickers the living
 * canvas through it while revealing.
 */
export default function Reveal({ as: Tag = "section", className = "", id, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} id={id} className={className}>
      <div className={`reveal-inner ${visible ? "is-visible" : ""}`}>{children}</div>
    </Tag>
  );
}
