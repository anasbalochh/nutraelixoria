import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote, BadgeCheck, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  { text: "My pigmentation has visibly faded after just one box. I get compliments on my glow constantly now.", author: "Ayesha K.", city: "Lahore" },
  { text: "Finally a product that works from within. My skin feels firmer and the dark circles are noticeably lighter.", author: "Sana M.", city: "Karachi" },
  { text: "I was skeptical at first, but two boxes in and my whole complexion looks brighter and more even. Worth every rupee.", author: "Hira R.", city: "Islamabad" },
  { text: "The collagen and glutathione combo is the perfect pairing — my skin feels tighter and looks genuinely glowy.", author: "Nimra Q.", city: "Rawalpindi" },
  { text: "I noticed a difference in both my hair and skin. My nails are stronger too — this is more than a beauty supplement.", author: "Tayyaba N.", city: "Lahore" },
  { text: "Best anti-ageing product I have tried. Fine lines around my eyes have softened in just six weeks.", author: "Zoya K.", city: "Karachi" },
];

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  const initials = review.author
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <article className="group relative flex h-full min-h-[280px] flex-col rounded-2xl border border-border/60 bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-elegant md:p-8">
      <Quote className="absolute right-6 top-6 h-9 w-9 text-primary/10 transition-colors duration-500 group-hover:text-primary/25" aria-hidden />
      <div className="flex gap-0.5 text-[color:var(--gold)]" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/90">&ldquo;{review.text}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm text-primary">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-display text-base leading-tight">{review.author}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {review.city}
          </p>
        </div>
        <BadgeCheck className="ml-auto h-4 w-4 shrink-0 text-[color:var(--success)]" aria-label="Verified buyer" />
      </div>
    </article>
  );
}

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 5500);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  return (
    <section id="reviews" className="relative overflow-hidden py-24 md:py-32 bg-[color:var(--ivory)]">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[color:var(--gold)]/10 blur-3xl" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto fade-up">
          <p className="eyebrow">Real Results</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
            Loved by customers <span className="italic-emph">across Pakistan.</span>
          </h2>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 shadow-soft">
              <div className="flex gap-0.5 text-[color:var(--gold)]" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="font-display text-2xl leading-none">4.9</span>
              <span className="text-sm text-muted-foreground">out of 5</span>
            </div>
            <span className="text-sm text-muted-foreground tracking-wide">127 verified reviews</span>
          </div>
        </div>

        <div className="relative mt-14 fade-up">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous review"
            className="absolute left-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-elegant transition hover:border-primary hover:text-primary md:-left-2 lg:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next review"
            className="absolute right-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-elegant transition hover:border-primary hover:text-primary md:-right-2 lg:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div ref={emblaRef} className="overflow-hidden px-12 md:px-14">
            <div className="flex touch-pan-y -ml-4 md:-ml-6">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-[0_0_100%] pl-4 md:flex-[0_0_50%] md:pl-6 lg:flex-[0_0_33.333%]"
                >
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                aria-current={selectedIndex === i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  selectedIndex === i ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
