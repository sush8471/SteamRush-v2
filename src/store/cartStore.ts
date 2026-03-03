import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Game {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  [key: string]: any;
}

interface CartItem extends Game {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (game) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === game.id);

        if (existingItem) {
          // For games, we usually don't have multiples of the same game in cart
          // But if the user wants it, we could increment quantity.
          // In Steam-like stores, you usually only buy a game once.
          return;
        }

        set({ items: [...currentItems, { ...game, quantity: 1 }] });
      },
      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.length,
      totalPrice: () =>
        get().items.reduce((acc, item) => {
          const price = item.discount_price ?? item.price;
          return acc + price;
        }, 0),
    }),
    {
      name: 'steam-rush-cart',
    }
  )
);
