import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Pencil } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { formatPKR, getCartTotals, useCart } from "@/lib/cart";
import { createIdempotencyKey, placeOrder, PlaceOrderError } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Nutra Elixoria" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutPage,
});

const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Other"];
const provinces = ["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "GB"];

type Form = {
  fullName: string; email: string; phone: string;
  address1: string; address2: string; city: string; province: string; postal: string;
  payment: "cod" | "bank";
};

const empty: Form = { fullName: "", email: "", phone: "", address1: "", address2: "", city: "", province: "", postal: "", payment: "cod" };

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const { compareSubtotal, discount, total } = getCartTotals(items);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) e.phone = "Valid phone required";
    if (!form.address1.trim()) e.address1 = "Required";
    if (!form.city) e.city = "Select a city";
    if (!form.province) e.province = "Select a province";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-4xl">Your basket is empty</h1>
          <p className="mt-3 text-muted-foreground">Add GLUTAGE to begin checkout.</p>
          <Link to="/" className="mt-6 inline-flex btn-pill bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.18em]">CONTINUE SHOPPING</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>
          <Stepper step={step} />

          <div className="mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-10">
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
              {step === 1 && (
                <>
                  <h2 className="font-display text-2xl">Delivery Information</h2>
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name *" err={errors.fullName}>
                      <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls(!!errors.fullName)} />
                    </Field>
                    <Field label="Email Address *" err={errors.email}>
                      <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls(!!errors.email)} />
                    </Field>
                    <Field label="Phone Number *" err={errors.phone}>
                      <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="03XX XXXXXXX" className={inputCls(!!errors.phone)} />
                    </Field>
                    <Field label="Postal Code">
                      <input value={form.postal} onChange={(e) => set("postal", e.target.value)} className={inputCls(false)} />
                    </Field>
                    <Field className="sm:col-span-2" label="Address Line 1 *" err={errors.address1}>
                      <input value={form.address1} onChange={(e) => set("address1", e.target.value)} className={inputCls(!!errors.address1)} />
                    </Field>
                    <Field className="sm:col-span-2" label="Address Line 2">
                      <input value={form.address2} onChange={(e) => set("address2", e.target.value)} className={inputCls(false)} />
                    </Field>
                    <Field label="City *" err={errors.city}>
                      <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls(!!errors.city)}>
                        <option value="">Select city</option>
                        {cities.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Province *" err={errors.province}>
                      <select value={form.province} onChange={(e) => set("province", e.target.value)} className={inputCls(!!errors.province)}>
                        <option value="">Select province</option>
                        {provinces.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button onClick={() => validateStep1() && setStep(2)} className="btn-pill bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-[0.18em] inline-flex items-center gap-2">
                      CONTINUE TO PAYMENT <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-display text-2xl">Payment Method</h2>
                  <div className="mt-6 space-y-3">
                    <PaymentCard
                      selected={form.payment === "cod"}
                      onSelect={() => set("payment", "cod")}
                      icon="💵"
                      title="Cash on Delivery"
                      desc="Pay in cash when your order arrives."
                    />
                    <PaymentCard
                      selected={form.payment === "bank"}
                      onSelect={() => set("payment", "bank")}
                      icon="🏦"
                      title="Bank Transfer"
                      desc="Details shared after order confirmation."
                    />
                  </div>
                  <div className="mt-8 flex flex-wrap justify-between gap-3">
                    <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground underline">← Back</button>
                    <button onClick={() => setStep(3)} className="btn-pill bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-[0.18em] inline-flex items-center gap-2">
                      CONTINUE TO REVIEW <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-display text-2xl">Review & Confirm</h2>

                  <ReviewBlock title="Delivery Address" onEdit={() => setStep(1)}>
                    <p>{form.fullName}</p>
                    <p>{form.address1}{form.address2 ? `, ${form.address2}` : ""}</p>
                    <p>{form.city}, {form.province} {form.postal}</p>
                    <p>{form.phone} · {form.email}</p>
                  </ReviewBlock>

                  <ReviewBlock title="Payment Method" onEdit={() => setStep(2)}>
                    <p>{form.payment === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
                  </ReviewBlock>

                  <ReviewBlock title="Items">
                    <div className="space-y-3">
                      {items.map((it) => (
                        <div key={it.id} className="flex justify-between text-sm">
                          <span>{it.name} × {it.quantity}</span>
                          <span>{formatPKR(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </ReviewBlock>

                  <p className="mt-6 text-xs text-muted-foreground">By placing your order you agree to our shipping and returns policy.</p>

                  {placeError && (
                    <p className="mt-4 text-sm text-destructive" role="alert">{placeError}</p>
                  )}

                  <button
                    type="button"
                    disabled={placing || !isSupabaseConfigured()}
                    onClick={async () => {
                      if (!isSupabaseConfigured()) {
                        setPlaceError("Checkout is not configured. Add Supabase keys to .env.local (see .env.example).");
                        return;
                      }
                      setPlaceError(null);
                      setPlacing(true);
                      const idempotencyKey = createIdempotencyKey();
                      try {
                        const result = await placeOrder(
                          {
                            customer: {
                              fullName: form.fullName,
                              email: form.email,
                              phone: form.phone,
                              address1: form.address1,
                              address2: form.address2 || undefined,
                              city: form.city,
                              province: form.province,
                              postal: form.postal || undefined,
                            },
                            payment: form.payment,
                            items: items.map((it) => ({
                              id: it.id,
                              name: it.name,
                              price: it.price,
                              compareAt: it.compareAt,
                              quantity: it.quantity,
                              image: it.image,
                            })),
                          },
                          idempotencyKey,
                        );
                        try {
                          sessionStorage.setItem(
                            "ne_last_order",
                            JSON.stringify({
                              form,
                              items,
                              totalPrice: result.total,
                              discount,
                              ref: result.ref,
                            }),
                          );
                        } catch {}
                        navigate({ to: "/order-confirmation" });
                      } catch (e) {
                        const msg =
                          e instanceof PlaceOrderError
                            ? e.message
                            : "Could not place your order. Please try again.";
                        setPlaceError(msg);
                      } finally {
                        setPlacing(false);
                      }
                    }}
                    className="mt-6 w-full btn-pill bg-primary text-primary-foreground py-4 text-sm tracking-[0.18em] hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {placing ? "PLACING ORDER…" : "PLACE ORDER"}
                  </button>
                  {!isSupabaseConfigured() && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Supabase env vars missing — copy .env.example to .env.local.
                    </p>
                  )}
                </>
              )}
            </div>

            <aside className="bg-[color:var(--surface)] rounded-2xl p-6 md:p-7 h-fit lg:sticky lg:top-28">
              <h3 className="font-display text-xl">Order Summary</h3>
              <div className="mt-5 space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="flex gap-3">
                    <img src={it.image} alt={it.name} className="h-16 w-14 object-cover rounded-md" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{it.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {it.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPKR(it.price * it.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-border pt-4 space-y-2 text-sm">
                {discount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Original price</span>
                      <span className="line-through text-muted-foreground">{formatPKR(compareSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[color:var(--success)]">
                      <span>Discount</span>
                      <span>−{formatPKR(discount)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPKR(totalPrice)}</span>
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-[color:var(--success)]">Free</span></div>
                <div className="flex justify-between font-display text-lg pt-2 border-t border-border"><span>Total</span><span>{formatPKR(total)}</span></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = ["Delivery", "Payment", "Review"];
  return (
    <div className="mt-8 flex items-center gap-3">
      {items.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full grid place-items-center text-sm font-medium transition ${
              active ? "bg-primary text-primary-foreground" : done ? "bg-[color:var(--gold)] text-[color:var(--gold-foreground)]" : "bg-secondary text-muted-foreground"
            }`}>
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            <span className={`text-sm tracking-wide ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
            {i < 2 && <div className="w-10 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, err, children, className }: { label: string; err?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {err && <span className="mt-1 block text-xs text-destructive">{err}</span>}
    </label>
  );
}

function inputCls(error: boolean) {
  return `w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
    error ? "border-destructive" : "border-border focus:border-primary"
  }`;
}

function PaymentCard({ selected, onSelect, icon, title, desc }: { selected: boolean; onSelect: () => void; icon: string; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex items-start gap-4 p-5 rounded-xl border-2 transition ${
        selected ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/40"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <span className={`h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-primary" : "border-border"}`}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
    </button>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit?: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-6 border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">{title}</h3>
        {onEdit && (
          <button onClick={onEdit} className="text-xs text-primary inline-flex items-center gap-1 hover:underline"><Pencil className="h-3 w-3" /> Edit</button>
        )}
      </div>
      <div className="mt-3 text-sm text-muted-foreground space-y-1">{children}</div>
    </div>
  );
}
