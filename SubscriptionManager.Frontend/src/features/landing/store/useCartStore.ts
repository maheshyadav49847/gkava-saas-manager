import { create } from 'zustand';

export interface CartItem {
  planId: string;
  planName: string;
  applicationId: string;
  applicationName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (planId: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    if (state.items.find(i => i.planId === item.planId)) {
      return state; // Already in cart
    }
    return { items: [...state.items, item], isOpen: true };
  }),
  removeItem: (planId) => set((state) => ({
    items: state.items.filter(i => i.planId !== planId)
  })),
  clearCart: () => set({ items: [] }),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
