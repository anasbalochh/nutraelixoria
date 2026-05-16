import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { useReveal } from "@/hooks/use-reveal";
import { posts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The Journal — Nutra Elixoria" },
      { name: "description", content: "A weekly read on glutathione, collagen, skin science, and the rituals of luminous beauty." },
      { property: "og:title", content: "The Nutra Elixoria Journal" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  useReveal();
  return (
    <SiteLayout>
      <section className="relative overflow-hidden py-20 md:py-28 bg-[color:var(--ivory)]">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse" aria-hidden />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[color:var(--gold)]/10 blur-3xl"
          style={{ animation: "blog-tag-float 7s ease-in-out infinite" }}
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto fade-up in">
            <p className="eyebrow">The Journal</p>
            <h1 className="mt-5 font-display text-5xl md:text-6xl">
              Notes on <span className="italic-emph">radiance.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              A weekly read on glutathione, collagen, skin science, and the rituals of luminous beauty.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-7">
            {posts.map((p, i) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="blog-card fade-up group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-elegant hover:border-primary/20"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="blog-card-media aspect-[4/3] bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--ivory)] relative overflow-hidden">
                  <div className="blog-card-tag absolute inset-0 grid place-items-center text-[color:var(--gold)] font-display italic text-6xl opacity-50">
                    {p.tag}
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {p.date} · {p.readTime}
                  </p>
                  <h2 className="mt-3 font-display text-2xl leading-snug transition-colors duration-300 group-hover:text-primary">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed text-sm line-clamp-3">{p.excerpt}</p>
                  <span className="blog-card-arrow mt-5 text-sm text-primary font-medium">
                    Read article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
