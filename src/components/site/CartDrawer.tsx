import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { formatPKR, useCart } from "@/lib/cart";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[440px] bg-[color:var(--ivory)] shadow-elegant flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="font-display text-2xl">Your Basket</h3>
          <button onClick={closeCart} aria-label="Close" className="grid place-items-center h-10 w-10 rounded-full hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-5">
            <div className="grid place-items-center h-20 w-20 rounded-full bg-secondary text-primary">
              <ShoppingBag className="h-9 w-9" />
            </div>
            <div>
              <p className="font-display text-xl">Your basket is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Discover the daily ritual.</p>
            </div>
            <button
              onClick={closeCart}
              className="btn-pill bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.18em]"
            >
              BROWSE PRODUCTS
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-5 border-b border-border last:border-b-0">
                  <img src={item.image} alt={item.name} className="h-24 w-20 object-cover rounded-md bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-display text-base">{item.name}</p>
                        {item.size && <p className="text-xs text-muted-foreground">{item.size}</p>}
                      </div>
                      <button onClick={() => removeItem(item.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 grid place-items-center hover:text-primary"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 grid place-items-center hover:text-primary"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <p className="font-medium">{formatPKR(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-6 py-5 space-y-3 bg-white/60">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPKR(totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Free delivery across Pakistan</p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn-pill block w-full text-center bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.18em] hover:bg-primary/90 transition"
              >
                PROCEED TO CHECKOUT
              </Link>
              <button onClick={closeCart} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
