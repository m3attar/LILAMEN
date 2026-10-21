"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CART_KEY,
  sanitizeCart,
  validQuantity,
  type CartItem,
} from "@/lib/cart";
import { productBySlug } from "@/lib/products";
type CartContextType = {
  items: CartItem[];
  ready: boolean;
  notice: string;
  add: (slug: string, quantity?: number) => void;
  update: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
};
const CartContext = createContext<CartContextType | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      setItems(
        sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]")),
      );
    } catch {
      setItems([]);
    }
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        try {
          setItems(sanitizeCart(JSON.parse(e.newValue || "[]")));
        } catch {
          setItems([]);
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch {
        setNotice(
          "Your browser cannot save this bag. Items will remain for this visit.",
        );
      }
    }
  }, [items, ready]);
  const add = (slug: string, quantity = 1) => {
    const p = productBySlug(slug);
    if (!p) return;
    setItems((prev) =>
      sanitizeCart([...prev, { slug, quantity: validQuantity(quantity) }]),
    );
    setNotice(`${p.name} added to your bag.`);
  };
  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        notice,
        add,
        update: (slug, quantity) =>
          setItems((prev) =>
            prev.map((i) =>
              i.slug === slug ? { ...i, quantity: validQuantity(quantity) } : i,
            ),
          ),
        remove: (slug) =>
          setItems((prev) => prev.filter((i) => i.slug !== slug)),
      }}
    >
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {notice}
      </div>
    </CartContext.Provider>
  );
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("CartProvider missing");
  return value;
}
