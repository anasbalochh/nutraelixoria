import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-[color:var(--surface)] border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Nutra Elixoria" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-display text-lg">Nutra Elixoria</span>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">Nutraceuticals For A Better Life</p>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Pakistan's premier nutraceuticals house. Inside-out beauty, formulated with pharmaceutical discipline and the soul of an apothecary.
          </p>
          <div className="mt-5 flex gap-3">
            <a aria-label="Instagram" href="#" className="grid place-items-center h-9 w-9 rounded-full bg-white text-primary hover:bg-primary hover:text-primary-foreground transition"><Instagram className="h-4 w-4" /></a>
            <a aria-label="Facebook" href="#" className="grid place-items-center h-9 w-9 rounded-full bg-white text-primary hover:bg-primary hover:text-primary-foreground transition"><Facebook className="h-4 w-4" /></a>
            <a aria-label="TikTok" href="#" className="grid place-items-center h-9 w-9 rounded-full bg-white text-primary hover:bg-primary hover:text-primary-foreground transition text-sm font-semibold">T</a>
          </div>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li><a href="/#product">Product</a></li>
            <li><a href="/#science">Science</a></li>
            <li><a href="/#ritual">Ritual</a></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="mailto:info@nutraelixoria.com" className="text-foreground">info@nutraelixoria.com</a></li>
            <li>277 Street 29, Sector C,<br />Phase 8, Bahria Town,<br />Rawalpindi</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Hours</p>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <li>Monday–Saturday</li>
            <li>10 AM – 8 PM PKT</li>
            <li>Closed Sunday</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Nutra Elixoria. All rights reserved. <span className="mx-2">|</span> Privacy · Shipping & Returns</p>
          <p className="tracking-[0.14em] uppercase">GLUTAGE · Licensed NHM0089 · Free Delivery · Cash on Delivery</p>
        </div>
      </div>
    </footer>
  );
}
