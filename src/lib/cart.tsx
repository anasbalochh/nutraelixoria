import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { GLUTAGE } from "@/lib/product";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  quantity: number;
  image: string;
  size?: string;
};

export function getCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const compareSubtotal = items.reduce(
    (s, i) => s + (i.compareAt ?? i.price) * i.quantity,
    0,
  );
  const discount = Math.max(0, compareSubtotal - subtotal);
  return { subtotal, compareSubtotal, discount, total: subtotal };
}

type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("ne_cart");
      if (!raw) return [];
      return (JSON.parse(raw) as CartItem[]).map((i) =>
        i.id === GLUTAGE.id && i.compareAt == null ? { ...i, compareAt: GLUTAGE.compareAt } : i,
      );
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { window.localStorage.setItem("ne_cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const value = useMemo<CartState>(() => ({
    items,
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (item, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((p) => p.id === item.id);
        if (existing) {
          return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p);
        }
        return [...prev, { ...item, quantity }];
      });
    },
    removeItem: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
    updateQuantity: (id, qty) =>
      setItems((prev) => prev.map((p) => p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)),
    clearCart: () => setItems([]),
  }), [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatPKR(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}
