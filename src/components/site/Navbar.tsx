import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const sectionLinks = [
  { label: "PRODUCT", href: "#product" },
  { label: "SCIENCE", href: "#science" },
  { label: "RITUAL", href: "#ritual" },
];
const pageLinks = [
  { label: "ABOUT", to: "/about" as const },
  { label: "BLOG", to: "/blog" as const },
];

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";

  const sectionHref = (h: string) => (isHome ? h : `/${h}`);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        scrolled ? "bg-white shadow-soft border-transparent" : "bg-[color:var(--ivory)] border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Nutra Elixoria" width={48} height={48} className="h-12 w-12 object-contain" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl tracking-tight">Nutra Elixoria</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Nutraceuticals For A Better Life</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-[0.18em] font-medium">
          {sectionLinks.map((l) => (
            <a key={l.href} href={sectionHref(l.href)} className="hover:text-primary transition-colors">{l.label}</a>
          ))}
          {pageLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{l.label}</Link>
          ))}
          <a href={sectionHref("#faq")} className="hover:text-primary transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative grid place-items-center h-11 w-11 rounded-full hover:bg-secondary transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </button>
          <a
            href={sectionHref("#product")}
            className="hidden md:inline-flex btn-pill bg-primary text-primary-foreground px-5 py-2.5 text-xs tracking-[0.18em] font-medium hover:bg-primary/90 transition-colors"
          >
            ORDER NOW
          </a>
          <button
            className="lg:hidden grid place-items-center h-11 w-11 rounded-full hover:bg-secondary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-[color:var(--ivory)] p-6 shadow-elegant animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="grid place-items-center h-10 w-10 rounded-full hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-5 text-sm tracking-[0.16em]">
              {sectionLinks.map((l) => (
                <a key={l.href} href={sectionHref(l.href)} onClick={() => setMobileOpen(false)}>{l.label}</a>
              ))}
              {pageLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.label}</Link>
              ))}
              <a href={sectionHref("#faq")} onClick={() => setMobileOpen(false)}>FAQ</a>
              <a
                href={sectionHref("#product")}
                onClick={() => setMobileOpen(false)}
                className="mt-4 btn-pill bg-primary text-primary-foreground px-5 py-3 text-center text-xs tracking-[0.18em]"
              >
                ORDER NOW
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
