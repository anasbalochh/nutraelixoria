import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ShoppingCart, Sparkles, Shield, RefreshCw, Truck, CreditCard, Star,
  Plus, Minus,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Testimonials } from "@/components/site/Testimonials";
import { useReveal } from "@/hooks/use-reveal";
import { formatPKR, useCart } from "@/lib/cart";
import { GLUTAGE } from "@/lib/product";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nutra Elixoria â€” GLUTAGE Beauty Shot | L-Glutathione + Marine Collagen" },
      { name: "description", content: "Radiance, sipped not slathered. GLUTAGE daily drinkable beauty shot with L-Glutathione, marine collagen and 15 essential nutrients. Free delivery across Pakistan." },
      { property: "og:title", content: "Nutra Elixoria â€” Radiance, sipped." },
      { property: "og:image", content: GLUTAGE.image },
    ],
  }),
  component: HomePage,
});

const benefits = [
  { roman: "I", title: "Brighten", desc: "L-Glutathione visibly evens skin tone and softens dark spots and dullness." },
  { roman: "II", title: "Firm", desc: "Marine collagen helps restore elasticity, plumpness, and a youthful bounce." },
  { roman: "III", title: "Strengthen", desc: "Collagen peptides and amino acids support visibly stronger hair, healthier nails, and resilient skin from within." },
  { roman: "IV", title: "Glow", desc: "A powerful antioxidant shield plus 15 essential nutrients for the unmistakable lit-from-within radiance." },
];

const science = [
  { mark: "i.", name: "L-Glutathione", tagline: "The Master Antioxidant", desc: "Works at a cellular level to reduce melanin clusters, lift dullness, and reveal a clearer, more even complexion." },
  { mark: "ii.", name: "Marine Collagen", tagline: "Structure & Suppleness", desc: "Hydrolyzed for superior absorption. Supports the skin's natural matrix â€” improving firmness, elasticity, and dewy fullness." },
  { mark: "iii.", name: "15 Essences", tagline: "The Synergy Blend", desc: "Vitamin C, Hyaluronic Acid, amino acids, and botanical extracts that amplify glutathione and collagen for complete inside-out radiance." },
];

const ritual = [
  { step: "01", title: "Shake Gently", desc: "Each glass vial contains a precise daily dose. A light shake awakens the formula." },
  { step: "02", title: "Sip Slowly", desc: "Enjoy one vial in the morning, ideally on an empty stomach for optimal absorption." },
  { step: "03", title: "See the Glow", desc: "Visible results in 4 to 8 weeks â€” improved tone, elasticity, and a healthier glow." },
];

const faqs = [
  { q: "How long until I see results?", a: "Most customers report a noticeable difference in 4 to 6 weeks. Complete at least two boxes consistently for best results." },
  { q: "Is GLUTAGE safe?", a: "Yes. Manufactured under licence NHM0089 using widely studied ingredients. Consult a doctor if pregnant, breastfeeding, or on medication." },
  { q: "How do I take it?", a: "One 50ml shot daily, ideally morning on empty stomach. Use consistently for 4 to 8 weeks." },
  { q: "Do you deliver across Pakistan?", a: "Yes â€” free delivery everywhere. Major cities 2â€“3 days, other areas 3â€“5 days. Cash on Delivery available." },
  { q: "How do I place an order?", a: "Add GLUTAGE to your basket, proceed to checkout, fill your delivery details, and confirm. We dispatch same day." },
  { q: "Is it suitable for men?", a: "Absolutely. Formulated for all adults who want healthier skin, hair, and nails." },
  { q: "Where is it manufactured?", a: "Pakistan, licensed facility, licence NHM0089. Full batch testing and traceability." },
  { q: "Is GLUTAGE halal?", a: "Marine collagen from fish (broadly halal). No pork, bovine, or alcohol ingredients." },
  { q: "Can I take it with medication?", a: "Consult your doctor if on prescription medication, pregnant, breastfeeding, or managing a chronic condition." },
  { q: "What is your return policy?", a: "Unopened boxes returnable within 7 days for a full refund. Email or contact us to arrange." },
];

const productTabs = {
  Description: "GLUTAGE is a 50ml daily drinkable beauty shot formulated with L-Glutathione, marine collagen, Vitamin C, hyaluronic acid, amino acids and additional essential nutrients â€” for skin brightening, anti-ageing, and visibly stronger hair and nails. Manufactured under licence NHM0089. Suitable for men and women.",
  Ingredients: "L-Glutathione Â· Marine Collagen Â· Vitamin C Â· Hyaluronic Acid Â· Amino Acids Â· 15 Essential Nutrients",
  "How to Use": "Take one 50ml shot daily, ideally in the morning on an empty stomach. Shake gently before use. Use consistently for 4 to 8 weeks for visible results.",
  Shipping: "Free delivery across Pakistan. Same-day dispatch for orders placed before 4:00 PM PKT. Major cities: 2â€“3 working days. Other areas: 3â€“5 working days. Cash on Delivery available everywhere.",
};

function HomePage() {
  useReveal();
  return (
    <SiteLayout>
      <Hero />
      <TrustBar />
      <Benefits />
      <ProductSection />
      <Science />
      <Ritual />
      <Testimonials />
      <FAQ />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[90vh] py-16">
        <div className="fade-up in">
          <span className="inline-flex items-center gap-2 btn-pill bg-secondary px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase text-primary">
            <Sparkles className="h-3 w-3" /> Introducing GLUTAGE
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            Radiance <span className="italic-emph">sipped,</span> not slathered.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            A daily drinkable elixir of L-Glutathione, marine collagen, and 15 essential nutrients â€” formulated to brighten, firm, and restore your skin from the inside out.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#product" className="btn-pill bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-[0.18em] hover:bg-primary/90 transition">SHOP NOW</a>
            <a href="#science" className="btn-pill border border-primary text-primary px-7 py-3.5 text-xs tracking-[0.18em] hover:bg-primary hover:text-primary-foreground transition">DISCOVER THE SCIENCE</a>
          </div>
        </div>
        <div className="fade-up in relative">
          <div className="absolute -inset-6 bg-[color:var(--surface)] rounded-3xl -z-10" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-elegant bg-[color:var(--surface)]">
            <img src={GLUTAGE.image} alt="GLUTAGE beauty shot" className="absolute inset-0 size-full object-contain p-4 md:p-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    "L-Glutathione + Collagen",
    "15 Essential Nutrients",
    "Lab Certified NHM0089",
    "50 ml Daily Shot",
    "Free Delivery",
    "Cash on Delivery",
  ];
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] tracking-[0.18em] uppercase">
        {items.map((t, i) => (
          <span key={i} className="opacity-90">{t}</span>
        ))}
      </div>
    </div>
  );
}

function Benefits() {
  return (
    <section id="product-benefits" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto fade-up">
          <p className="eyebrow">Why GLUTAGE</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
            The luminous skin you've been <span className="italic-emph">waiting for.</span>
          </h2>
        </div>
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div key={b.roman} className="fade-up bg-card rounded-2xl p-8 md:p-10 shadow-soft border border-border/50 hover:shadow-elegant transition-shadow">
              <span className="font-display italic text-3xl text-[color:var(--gold)]">{b.roman}</span>
              <h3 className="mt-3 font-display text-2xl">{b.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<keyof typeof productTabs>("Description");
  const [activeImage, setActiveImage] = useState(0);

  const imageAlts = ["GLUTAGE box and vials", "GLUTAGE supplement shots", "GLUTAGE how to use"];

  const add = () => {
    addItem({ id: GLUTAGE.id, name: GLUTAGE.name, price: GLUTAGE.price, compareAt: GLUTAGE.compareAt, image: GLUTAGE.image, size: GLUTAGE.size }, qty);
  };

  return (
    <section id="product" className="py-24 md:py-32 bg-[color:var(--ivory)]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="fade-up">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[color:var(--surface)] shadow-soft">
            <img
              src={GLUTAGE.images[activeImage]}
              alt={imageAlts[activeImage]}
              loading="lazy"
              className="absolute inset-0 size-full object-contain p-4 md:p-6"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {GLUTAGE.images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={activeImage === i}
                className={`relative aspect-square w-full overflow-hidden rounded-lg bg-[color:var(--surface)] border-2 transition-colors ${
                  activeImage === i ? "border-primary" : "border-border hover:border-primary/50"
                }`}
              >
                <img src={src} alt="" className="absolute inset-0 size-full object-contain p-1.5" />
              </button>
            ))}
          </div>
        </div>

        <div className="fade-up">
          <div className="flex flex-wrap gap-2">
            <span className="btn-pill bg-[color:var(--success)]/10 text-[color:var(--success)] text-xs px-3 py-1 font-medium">In Stock</span>
            <span className="btn-pill bg-[color:var(--gold)]/15 text-[color:var(--gold-foreground)] text-xs px-3 py-1 font-medium">Lab Certified NHM0089</span>
          </div>
          <h1 className="mt-5 font-display text-5xl md:text-6xl">{GLUTAGE.name}</h1>
          <p className="mt-2 text-base text-muted-foreground">{GLUTAGE.fullName}</p>

          <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-sm">
            <span className="text-[color:var(--gold)]">{"â˜…â˜…â˜…â˜…â˜…"}</span>
            <span className="font-medium">4.9</span>
            <span className="text-muted-foreground">(127 reviews)</span>
          </a>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl">{formatPKR(GLUTAGE.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatPKR(GLUTAGE.compareAt)}</span>
            <span className="btn-pill bg-[color:var(--gold)]/20 text-[color:var(--gold-foreground)] text-xs px-3 py-1 font-medium">Save Rs. 500</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{GLUTAGE.size}</p>

          <div className="mt-8 border-t border-border pt-6 flex items-center gap-4">
            <div className="inline-flex items-center border border-border rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 grid place-items-center hover:text-primary"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-11 w-11 grid place-items-center hover:text-primary"><Plus className="h-4 w-4" /></button>
            </div>
            <span className="text-sm text-muted-foreground">Quantity</span>
          </div>

          <div className="mt-5 space-y-3">
            <button
              onClick={() => { add(); openCart(); toast.success("GLUTAGE added to your basket"); }}
              className="w-full btn-pill bg-primary text-primary-foreground py-4 text-sm tracking-[0.18em] hover:bg-primary/90 transition inline-flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" /> ADD TO BASKET
            </button>
            <button
              onClick={() => { add(); navigate({ to: "/checkout" }); }}
              className="w-full btn-pill bg-[color:var(--gold)] text-[color:var(--gold-foreground)] py-4 text-sm tracking-[0.18em] hover:opacity-90 transition"
            >
              BUY NOW
            </button>
          </div>

          <div className="mt-8 border-t border-border pt-6 grid sm:grid-cols-2 gap-3 text-sm">
            <Row icon={<Truck className="h-4 w-4" />} text="Free delivery across Pakistan" />
            <Row icon={<CreditCard className="h-4 w-4" />} text="Cash on Delivery available" />
            <Row icon={<RefreshCw className="h-4 w-4" />} text="7-day return on unopened boxes" />
            <Row icon={<Shield className="h-4 w-4" />} text="Licence NHM0089" />
          </div>

          <div className="mt-10 border-t border-border">
            <div className="flex flex-wrap gap-2 py-4">
              {(Object.keys(productTabs) as Array<keyof typeof productTabs>).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`btn-pill px-4 py-2 text-xs tracking-[0.16em] uppercase transition ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-primary/10"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pb-2">{productTabs[tab]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-foreground">
      <span className="grid place-items-center h-8 w-8 rounded-full bg-secondary text-primary">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Science() {
  return (
    <section id="science" className="py-24 md:py-32 bg-[color:var(--surface)]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto fade-up">
          <p className="eyebrow">The Formulation</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
            A trinity of <span className="italic-emph">proven</span> beauty actives.
          </h2>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {science.map((s) => (
            <div key={s.name} className="fade-up bg-card rounded-2xl p-8 border-t-2 border-[color:var(--gold)] shadow-soft">
              <span className="font-display italic text-[color:var(--gold)]">{s.mark}</span>
              <h3 className="mt-3 font-display text-2xl">{s.name}</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-primary">{s.tagline}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ritual() {
  return (
    <section id="ritual" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto fade-up">
          <p className="eyebrow">The Daily Ritual</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
            Three sips. <span className="italic-emph">One luminous</span> you.
          </h2>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-10 relative">
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] border-t-2 border-dashed border-[color:var(--gold)]/60" />
          {ritual.map((r) => (
            <div key={r.step} className="fade-up text-center relative">
              <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-[color:var(--ivory)] border border-[color:var(--gold)] text-primary font-display text-xl relative z-10">
                {r.step}
              </div>
              <h3 className="mt-5 font-display text-2xl">{r.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-xs mx-auto">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="text-center fade-up">
          <p className="eyebrow">Questions, Answered</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
            Everything you need <span className="italic-emph">to know.</span>
          </h2>
        </div>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="py-5">
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-start justify-between gap-6 text-left">
                  <span className="font-display text-lg md:text-xl">{f.q}</span>
                  <span className="mt-1 text-primary">
                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </button>
                {isOpen && <p className="mt-3 pr-12 text-muted-foreground leading-relaxed">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
