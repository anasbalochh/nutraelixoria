import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Customer = {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postal?: string;
};

type OrderItemInput = {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  quantity: number;
  image?: string;
};

type PlaceOrderBody = {
  customer: Customer;
  payment: "cod" | "bank";
  items: OrderItemInput[];
};

type OrderRow = {
  id: string;
  ref: string;
  total: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: Record<string, string>;
  payment_method: string;
  subtotal: number;
  discount: number;
};

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "*").split(",").map((s) => s.trim());
  let allowOrigin = "*";
  if (origin && (allowed.includes("*") || allowed.includes(origin))) {
    allowOrigin = origin;
  } else if (!allowed.includes("*") && allowed.length > 0) {
    allowOrigin = allowed[0];
  }
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, idempotency-key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function json(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function validate(body: unknown): { ok: true; data: PlaceOrderBody } | { ok: false; message: string } {
  if (!body || typeof body !== "object") return { ok: false, message: "Invalid request body" };
  const b = body as Record<string, unknown>;
  const customer = b.customer as Record<string, unknown> | undefined;
  if (!customer) return { ok: false, message: "Customer is required" };

  const fullName = String(customer.fullName ?? "").trim();
  const email = String(customer.email ?? "").trim();
  const phone = String(customer.phone ?? "").trim();
  const address1 = String(customer.address1 ?? "").trim();
  const city = String(customer.city ?? "").trim();
  const province = String(customer.province ?? "").trim();

  if (!fullName) return { ok: false, message: "Full name is required" };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Valid email is required" };
  if (!/^[0-9+\-\s]{10,15}$/.test(phone)) return { ok: false, message: "Valid phone is required" };
  if (!address1) return { ok: false, message: "Address is required" };
  if (!city) return { ok: false, message: "City is required" };
  if (!province) return { ok: false, message: "Province is required" };

  const payment = b.payment;
  if (payment !== "cod" && payment !== "bank") return { ok: false, message: "Invalid payment method" };

  const items = b.items;
  if (!Array.isArray(items) || items.length === 0) return { ok: false, message: "Cart is empty" };

  const parsedItems: OrderItemInput[] = [];
  for (const raw of items) {
    if (!raw || typeof raw !== "object") return { ok: false, message: "Invalid cart item" };
    const it = raw as Record<string, unknown>;
    const id = String(it.id ?? "").trim();
    const name = String(it.name ?? "").trim();
    const price = Number(it.price);
    const quantity = Number(it.quantity);
    if (!id || !name) return { ok: false, message: "Invalid cart item" };
    if (!Number.isFinite(price) || price < 0) return { ok: false, message: "Invalid item price" };
    if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, message: "Invalid quantity" };
    parsedItems.push({
      id,
      name,
      price: Math.round(price),
      compareAt: it.compareAt != null ? Math.round(Number(it.compareAt)) : undefined,
      quantity,
      image: it.image != null ? String(it.image) : undefined,
    });
  }

  return {
    ok: true,
    data: {
      customer: {
        fullName,
        email,
        phone,
        address1,
        address2: customer.address2 ? String(customer.address2).trim() : undefined,
        city,
        province,
        postal: customer.postal ? String(customer.postal).trim() : undefined,
      },
      payment,
      items: parsedItems,
    },
  };
}

function computeTotals(items: OrderItemInput[]) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const compareSubtotal = items.reduce((s, i) => s + (i.compareAt ?? i.price) * i.quantity, 0);
  const discount = Math.max(0, compareSubtotal - subtotal);
  return { subtotal, discount, total: subtotal };
}

function formatPKR(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

function renderCustomerEmail(order: OrderRow, items: OrderItemInput[]) {
  const lines = items
    .map(
      (i) =>
        `<tr><td>${i.name} × ${i.quantity}</td><td align="right">${formatPKR(i.price * i.quantity)}</td></tr>`,
    )
    .join("");
  const paymentLabel = order.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer";
  const addr = order.address;
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-size: 24px;">Thank you for your order</h1>
      <p>Order reference: <strong>#${order.ref}</strong></p>
      <table width="100%" cellpadding="8" style="border-collapse: collapse; margin: 16px 0;">
        ${lines}
      </table>
      <p><strong>Subtotal:</strong> ${formatPKR(order.subtotal)}</p>
      ${order.discount > 0 ? `<p><strong>Discount:</strong> −${formatPKR(order.discount)}</p>` : ""}
      <p><strong>Delivery:</strong> Free</p>
      <p><strong>Total:</strong> ${formatPKR(order.total)}</p>
      <p><strong>Deliver to:</strong><br/>
        ${order.customer_name}<br/>
        ${addr.address1}${addr.address2 ? `, ${addr.address2}` : ""}<br/>
        ${addr.city}, ${addr.province} ${addr.postal ?? ""}
      </p>
      <p><strong>Payment:</strong> ${paymentLabel}</p>
      <p style="color: #666; font-size: 14px;">Estimated delivery: 2–5 working days across Pakistan.</p>
      <p style="color: #666; font-size: 14px;">Nutra Elixoria — Nutraceuticals For A Better Life</p>
    </div>
  `;
}

function renderAdminEmail(order: OrderRow, items: OrderItemInput[]) {
  const itemLines = items.map((i) => `${i.name} × ${i.quantity} — ${formatPKR(i.price * i.quantity)}`).join("\n");
  const addr = order.address;
  return `
New order #${order.ref}
Customer: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}
Payment: ${order.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer"}

Items:
${itemLines}

Subtotal: ${formatPKR(order.subtotal)}
Discount: ${formatPKR(order.discount)}
Total: ${formatPKR(order.total)}

Address:
${addr.address1}
${addr.address2 ?? ""}
${addr.city}, ${addr.province} ${addr.postal ?? ""}
  `.trim();
}

function normalizeFromAddress(raw: string): string {
  const trimmed = raw.trim();
  // Resend test mode: use plain onboarding@resend.dev (display names can fail validation)
  if (trimmed.includes("onboarding@resend.dev")) return "onboarding@resend.dev";
  return trimmed;
}

async function sendResend(to: string[], subject: string, html: string, replyTo?: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const fromRaw = Deno.env.get("ORDER_FROM_EMAIL");
  if (!apiKey || !fromRaw) {
    console.warn("Resend skipped: set RESEND_API_KEY and ORDER_FROM_EMAIL in Edge Function secrets");
    return { ok: false as const, skipped: true, reason: "missing_config" as const };
  }

  const from = normalizeFromAddress(fromRaw);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error:", res.status, text);
    let message = text;
    try {
      const parsed = JSON.parse(text) as { message?: string };
      if (parsed.message) message = parsed.message;
    } catch {
      /* use raw */
    }
    return { ok: false as const, skipped: false, error: message };
  }
  return { ok: true as const };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, origin);
    }

    const raw = body as Record<string, unknown>;
    const idempotencyFromBody =
      typeof raw.idempotencyKey === "string" ? raw.idempotencyKey.trim() : "";
    const payloadForValidation = { ...raw };
    delete payloadForValidation.idempotencyKey;

    const validated = validate(payloadForValidation);
    if (!validated.ok) return json({ error: validated.message }, 400, origin);

    const { customer, payment, items } = validated.data;
    const idempotencyKey =
      req.headers.get("Idempotency-Key")?.trim() || idempotencyFromBody || null;

    if (idempotencyKey) {
      const { data: existing } = await supabase
        .from("orders")
        .select("ref, total, status")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (existing) {
        return json({ ref: existing.ref, total: existing.total, status: existing.status }, 200, origin);
      }
    }

    const { subtotal, discount, total } = computeTotals(items);

    const { data: refValue, error: refError } = await supabase.rpc("get_next_order_ref");
    if (refError || !refValue) {
      console.error("ref error:", refError);
      return json({ error: "Could not generate order reference" }, 500, origin);
    }

    const address = {
      address1: customer.address1,
      address2: customer.address2 ?? "",
      city: customer.city,
      province: customer.province,
      postal: customer.postal ?? "",
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        ref: refValue,
        idempotency_key: idempotencyKey,
        customer_name: customer.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        address,
        payment_method: payment,
        subtotal,
        discount,
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("order insert:", orderError);
      if (orderError?.code === "23505" && idempotencyKey) {
        const { data: existing } = await supabase
          .from("orders")
          .select("ref, total, status")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();
        if (existing) {
          return json({ ref: existing.ref, total: existing.total, status: existing.status }, 200, origin);
        }
      }
      return json({ error: "Failed to save order" }, 500, origin);
    }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      name: i.name,
      price: i.price,
      compare_at: i.compareAt ?? null,
      quantity: i.quantity,
      image: i.image ?? null,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("items insert:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      return json({ error: "Failed to save order items" }, 500, origin);
    }

    const orderRow = order as OrderRow;
    let emailCustomerSent = false;
    let emailAdminSent = false;

    const customerHtml = renderCustomerEmail(orderRow, items);
    let customerEmailError: string | undefined;
    let adminEmailError: string | undefined;

    const customerResult = await sendResend(
      [customer.email],
      `Your Nutra Elixoria order #${order.ref} is confirmed`,
      customerHtml,
    );
    if (customerResult.ok) {
      emailCustomerSent = true;
    } else if ("error" in customerResult && customerResult.error) {
      customerEmailError = customerResult.error;
    }

    const notifyEmail = Deno.env.get("ORDER_NOTIFY_EMAIL");
    if (notifyEmail) {
      const adminResult = await sendResend(
        [notifyEmail],
        `[NEW ORDER] #${order.ref} — ${customer.fullName} — ${formatPKR(total)}`,
        `<pre style="font-family: sans-serif; white-space: pre-wrap;">${renderAdminEmail(orderRow, items)}</pre>`,
        customer.email,
      );
      if (adminResult.ok) {
        emailAdminSent = true;
      } else if ("error" in adminResult && adminResult.error) {
        adminEmailError = adminResult.error;
      }
    }

    await supabase
      .from("orders")
      .update({
        email_customer_sent: emailCustomerSent,
        email_admin_sent: emailAdminSent,
      })
      .eq("id", order.id);

    const resendConfigured = Boolean(
      Deno.env.get("RESEND_API_KEY") && Deno.env.get("ORDER_FROM_EMAIL"),
    );

    return json(
      {
        ref: order.ref,
        total: order.total,
        status: order.status,
        emails: {
          resendConfigured,
          customerSent: emailCustomerSent,
          adminSent: emailAdminSent,
          notifyEmailSet: Boolean(Deno.env.get("ORDER_NOTIFY_EMAIL")),
          customerError: customerEmailError,
          adminError: adminEmailError,
        },
      },
      200,
      origin,
    );
  } catch (err) {
    console.error(err);
    return json({ error: "Internal server error" }, 500, origin);
  }
});
