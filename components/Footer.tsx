import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner mono">
        <span>{BRAND.full}</span>
        <span>{BRAND.location}</span>
        <span>© 2025</span>
      </div>
    </footer>
  );
}
