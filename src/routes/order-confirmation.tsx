import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { formatPKR, useCart, type CartItem } from "@/lib/cart";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [{ title: "Order Confirmed — Nutra Elixoria" }, { name: "robots", content: "noindex" }],
  }),
  component: ConfirmationPage,
});

type Saved = {
  form: { fullName: string; address1: string; city: string; province: string; payment: "cod" | "bank" };
  items: CartItem[];
  totalPrice: number;
  discount?: number;
  ref: string;
};

function ConfirmationPage() {
  const { clearCart } = useCart();
  const [data, setData] = useState<Saved | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ne_last_order");
      if (raw) setData(JSON.parse(raw) as Saved);
    } catch {}
    clearCart();
  }, [clearCart]);

  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <svg viewBox="0 0 60 60" className="check-anim mx-auto h-24 w-24 stroke-[color:var(--success)]" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="30" cy="30" r="26" />
            <path d="M18 31 L27 40 L43 22" />
          </svg>
          <h1 className="mt-8 font-display text-4xl md:text-5xl">Order Placed Successfully!</h1>
          <p className="mt-3 text-muted-foreground">Thank you. We've received your order.</p>
          {data?.ref && (
            <p className="mt-5 inline-flex items-center gap-2 btn-pill bg-secondary px-5 py-2.5 text-sm">
              Order reference: <span className="font-medium text-primary">#{data.ref}</span>
            </p>
          )}

          {data && (
            <div className="mt-10 text-left bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft">
              <h2 className="font-display text-xl">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {data.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-sm">
                    <span>{it.name} × {it.quantity}</span>
                    <span>{formatPKR(it.price * it.quantity)}</span>
                  </div>
                ))}
                {data.discount != null && data.discount > 0 && (
                  <div className="flex justify-between text-sm text-[color:var(--success)]">
                    <span>Discount</span>
                    <span>−{formatPKR(data.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-lg border-t border-border pt-3">
                  <span>Total</span><span>{formatPKR(data.totalPrice)}</span>
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Delivery to</p>
                  <p className="mt-1">{data.form.fullName}</p>
                  <p className="text-muted-foreground">{data.form.address1}</p>
                  <p className="text-muted-foreground">{data.form.city}, {data.form.province}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Payment</p>
                  <p className="mt-1">{data.form.payment === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-4">Estimated delivery</p>
                  <p className="mt-1">2–5 working days</p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-8 text-sm text-muted-foreground max-w-md mx-auto">
            You will receive a confirmation SMS/email shortly. Our team will process your order within 24 hours.
          </p>

          <div className="mt-8 flex justify-center">
            <Link to="/" className="btn-pill bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-[0.18em]">CONTINUE SHOPPING</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
