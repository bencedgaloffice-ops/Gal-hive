"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__wordmark">
          <span>{BRAND.first}</span> <em className="brass">{BRAND.second}</em>
        </a>
        <nav className="nav__links mono" aria-label="Fő navigáció">
          <a href="#story">Történet</a>
          <a href="#process">Folyamat</a>
          <a href="#products">Termékek</a>
          <a href="#markets">Piacok</a>
          <a href="#contact">Kapcsolat</a>
        </nav>
      </div>
    </header>
  );
}
