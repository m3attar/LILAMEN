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
  type PurchaseOptionId,
  type ScentSelection,
} from "@/lib/cart";
type CartContextType = {
  items: CartItem[];
  ready: boolean;
  notice: string;
  addPurchase: (optionId: PurchaseOptionId, scents: ScentSelection) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
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
  const addPurchase = (optionId: PurchaseOptionId, scents: ScentSelection) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setItems((prev) =>
      sanitizeCart([...prev, { id, optionId, scents, quantity: 1 }]),
    );
    setNotice("Your scent selection was added to your bag.");
  };
  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        notice,
        addPurchase,
        update: (id, quantity) =>
          setItems((prev) =>
            prev.map((i) =>
              i.id === id ? { ...i, quantity: validQuantity(quantity) } : i,
            ),
          ),
        remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
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
