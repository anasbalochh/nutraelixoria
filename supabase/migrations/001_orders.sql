CREATE SEQUENCE IF NOT EXISTS order_ref_seq START 100000;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref TEXT UNIQUE NOT NULL,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'processing', 'shipped', 'cancelled')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bank')),
  subtotal INTEGER NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  email_customer_sent BOOLEAN NOT NULL DEFAULT false,
  email_admin_sent BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  compare_at INTEGER,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  image TEXT
);

CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);
CREATE INDEX orders_ref_idx ON public.orders (ref);
CREATE INDEX orders_idempotency_key_idx ON public.orders (idempotency_key) WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_next_order_ref()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'NE-' || nextval('order_ref_seq')::text;
$$;

REVOKE ALL ON FUNCTION public.get_next_order_ref() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_next_order_ref() TO service_role;
