import type { CartItem } from "@/lib/cart";
import { getSupabase } from "@/lib/supabase";

export type PlaceOrderCustomer = {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postal?: string;
};

export type PlaceOrderPayload = {
  customer: PlaceOrderCustomer;
  payment: "cod" | "bank";
  items: Pick<CartItem, "id" | "name" | "price" | "compareAt" | "quantity" | "image">[];
};

export type PlaceOrderResult = {
  ref: string;
  total: number;
  status: string;
};

export class PlaceOrderError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "PlaceOrderError";
  }
}

export async function placeOrder(
  payload: PlaceOrderPayload,
  idempotencyKey: string,
): Promise<PlaceOrderResult> {
  const supabase = getSupabase();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  // Custom headers must include apikey + Authorization or Supabase returns 401.
  const { data, error } = await supabase.functions.invoke("place-order", {
    body: { ...payload, idempotencyKey },
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      "Idempotency-Key": idempotencyKey,
    },
  });

  if (error) {
    const ctx = error as { context?: Response };
    let detail = error.message || "Could not place order";
    if (ctx.context) {
      try {
        const parsed = (await ctx.context.json()) as { error?: string };
        if (parsed?.error) detail = parsed.error;
      } catch {
        /* ignore */
      }
    }
    throw new PlaceOrderError(detail, ctx.context?.status);
  }

  const body = data as PlaceOrderResult & { error?: string };
  if (body?.error) {
    throw new PlaceOrderError(body.error);
  }
  if (!body?.ref) {
    throw new PlaceOrderError("Invalid response from server");
  }

  return { ref: body.ref, total: body.total, status: body.status };
}

export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `ne-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
