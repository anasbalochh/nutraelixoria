import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useReveal } from "@/hooks/use-reveal";
import { getPost, type BlogPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Nutra Elixoria Journal` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Article not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-primary underline">← Back to Journal</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  useReveal();
  const { post } = Route.useLoaderData() as { post: BlogPost };

  return (
    <SiteLayout>
      <article className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="pointer-events-none absolute -left-20 top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden />

        <div className="text-center fade-up in">
          <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-primary font-medium">{post.tag}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight">{post.title}</h1>
        </div>

        <div className="blog-article-hero mt-12 aspect-[16/9] rounded-2xl bg-gradient-to-br from-[color:var(--surface)] via-[color:var(--ivory)] to-[color:var(--surface)] relative overflow-hidden shadow-soft border border-border/40">
          <div className="blog-article-tag absolute inset-0 grid place-items-center font-display italic text-[color:var(--gold)] text-7xl opacity-40">
            {post.tag}
          </div>
        </div>

        <div className="mt-12 prose-content space-y-6 text-lg leading-[1.8] text-foreground/90">
          {post.body.map((b, i) => {
            const delay = `${Math.min(i * 40, 400)}ms`;
            if (b.type === "h2") {
              return (
                <h2
                  key={i}
                  className="fade-up font-display text-3xl mt-12 mb-2"
                  style={{ transitionDelay: delay }}
                >
                  {b.text}
                </h2>
              );
            }
            if (b.type === "h3") {
              return (
                <h3
                  key={i}
                  className="fade-up font-display text-2xl mt-10 mb-2"
                  style={{ transitionDelay: delay }}
                >
                  {b.text}
                </h3>
              );
            }
            if (b.type === "table" && b.headers && b.rows) {
              return (
                <div key={i} className="fade-up overflow-x-auto my-8" style={{ transitionDelay: delay }}>
                  <table className="w-full text-base border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary">
                        {b.headers.map((h) => (
                          <th key={h} className="text-left py-3 px-3 font-display text-base">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-border">
                          {row.map((cell, ci) => (
                            <td key={ci} className="py-3 px-3 text-muted-foreground">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            return (
              <p key={i} className="fade-up" style={{ transitionDelay: delay }}>
                {b.text}
              </p>
            );
          })}
        </div>

        <div className="fade-up mt-16 flex items-center justify-between border-t border-border pt-8" style={{ transitionDelay: "200ms" }}>
          <Link to="/blog" className="text-sm text-primary hover:underline transition-opacity hover:opacity-80">
            ← Back to Journal
          </Link>
        </div>

        <div
          className="fade-up mt-12 rounded-2xl bg-primary text-primary-foreground p-10 text-center shadow-elegant transition-transform duration-500 hover:scale-[1.01]"
          style={{ transitionDelay: "280ms" }}
        >
          <h3 className="font-display text-3xl">Begin your daily ritual</h3>
          <p className="mt-3 text-primary-foreground/80">Inside-out radiance, one sip at a time.</p>
          <Link
            to="/"
            hash="product"
            className="mt-6 inline-flex btn-pill bg-[color:var(--gold)] text-[color:var(--gold-foreground)] px-7 py-3.5 text-xs tracking-[0.18em] transition-opacity hover:opacity-90"
          >
            ADD GLUTAGE TO BASKET
          </Link>
        </div>
      </article>
    </SiteLayout>
  );
}
