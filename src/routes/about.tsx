import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useReveal } from "@/hooks/use-reveal";
import aboutHero from "@/assets/about-hero.jpg";
import founderImg from "@/assets/founder.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nutra Elixoria" },
      { name: "description", content: "Nutra Elixoria is Pakistan's premier nutraceuticals house — inside-out beauty formulated with pharmaceutical discipline." },
      { property: "og:title", content: "About Nutra Elixoria" },
      { property: "og:description", content: "A curated house of nutraceuticals, not just another shelf." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { roman: "I", title: "Beauty From Within", desc: "We believe true radiance is not painted on — it is nurtured at the cellular level. We only stock formulations built around bioavailability, not buzzwords." },
  { roman: "II", title: "Pharmaceutical Discipline", desc: "Nutraceuticals deserve pharmaceutical rigor. Every product on our shelf is produced in a licensed facility — our flagship GLUTAGE is manufactured under licence NHM0089 with strict batch testing and full traceability." },
  { roman: "III", title: "Made For Pakistan", desc: "Hand-picked for South-Asian skin, climate, and lifestyle. Sourced for purity, delivered free to every city, with cash on delivery — because trust is earned, not advertised." },
];

function AboutPage() {
  useReveal();
  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-up in">
            <p className="eyebrow">Our Story</p>
            <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              Nutraceuticals, <span className="italic-emph">refined.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Nutra Elixoria was founded on a quiet idea: that the most powerful beauty rituals are the ones you can't see. Inside-out nutrition, formulated with the precision of pharmaceutical science and the soul of an apothecary.
            </p>
            <Link to="/" hash="product" className="mt-8 inline-flex btn-pill bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-[0.18em] hover:bg-primary/90 transition">
              EXPLORE GLUTAGE
            </Link>
          </div>
          <div className="fade-up in">
            <img src={aboutHero} alt="Nutra Elixoria apothecary" loading="lazy" className="rounded-2xl shadow-elegant aspect-[4/5] object-cover w-full" />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[color:var(--surface)]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 fade-up">
          <p className="eyebrow">The House</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
            A curated house of <span className="italic-emph">nutraceuticals,</span> not just another shelf.
          </h2>
          <div className="mt-10 space-y-6 text-lg text-foreground/85 leading-relaxed">
            <p>Nutra Elixoria is a Pakistan-based nutraceuticals house, founded in 2026 in Rawalpindi. We do not chase trends; we curate. Every product on our shelf is chosen for one reason — that we would happily drink it ourselves, every morning, for the next year.</p>
            <p>We bridge a quiet gap in the local market — between cosmetic creams that only treat the surface, and clinical supplements that ignore everything ritualistic about skincare. Our featured product, GLUTAGE, pairs L-Glutathione and marine collagen with fifteen essential nutrients in a single elegant 50ml daily shot, manufactured under licence NHM0089. More products will join the house — quietly, carefully, and only when they meet the same standard.</p>
            <p>Every order is delivered free across Pakistan with cash on delivery available — because we want the first sip to feel as effortless as the result.</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div className="fade-up">
            <img src={founderImg} alt="Founder of Nutra Elixoria" loading="lazy" className="rounded-2xl shadow-elegant aspect-[3/4] object-cover object-top w-full" />
          </div>
          <div className="fade-up">
            <p className="eyebrow">The Founder</p>
            <h2 className="mt-5 font-display text-5xl md:text-6xl">A quiet <span className="italic-emph">conviction.</span></h2>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-muted-foreground">Founder & Chief Executive Officer</p>
            <div className="mt-6 relative">
              <span className="absolute -top-6 -left-2 font-display italic text-7xl text-[color:var(--gold)] leading-none">"</span>
              <p className="text-lg text-foreground/85 leading-relaxed">
                Nutra Elixoria was founded in 2026 on a simple conviction — that Pakistan deserves a wellness house with the same editorial standard you would find in the world&apos;s finest beauty boutiques. After years of observing how fragmented and surface-level the local skincare market had become, our founder set out to build something the opposite of fast: a curated destination where every product on the shelf earns its place.
              </p>
              <p className="mt-5 text-lg text-foreground/85 leading-relaxed">
                Today, Nutra Elixoria works only with licensed manufacturers, obsesses over ingredient provenance, and builds a brand experience that respects the woman or man at the centre of every formula. GLUTAGE is the first chapter of a longer story — one written carefully, not loudly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[color:var(--ivory)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto fade-up">
            <p className="eyebrow">What We Stand For</p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl">
              Three <span className="italic-emph">quiet</span> commitments.
            </h2>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.roman} className="fade-up bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                <span className="font-display italic text-3xl text-[color:var(--gold)]">{v.roman}</span>
                <h3 className="mt-3 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6 text-center fade-up">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70">Begin Your Ritual</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            From our family, <span className="font-display italic text-[color:var(--gold)]">to yours.</span>
          </h2>
          <p className="mt-5 text-primary-foreground/85 leading-relaxed">
            Step into the Nutra Elixoria ritual. Order GLUTAGE with free delivery and cash on delivery across Pakistan.
          </p>
          <Link to="/" hash="product" className="mt-8 inline-flex btn-pill bg-[color:var(--gold)] text-[color:var(--gold-foreground)] px-8 py-4 text-xs tracking-[0.18em] hover:opacity-90 transition">
            ORDER ON WHATSAPP
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
