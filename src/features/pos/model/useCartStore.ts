import { create } from 'zustand';
import { Product } from '@/entities/product/model/types';

export interface CartItem extends Product {
    cartItemId: string;
    cartQuantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],

    addItem: (product, quantity = 1) => {
        set((state) => {
            const existingItemIndex = state.items.findIndex((item) => item.id === product.id);

            if (existingItemIndex >= 0) {
                const newItems = [...state.items];
                const item = newItems[existingItemIndex];
                // Do not exceed available stock
                if (item.cartQuantity + quantity <= item.stock_quantity) {
                    item.cartQuantity += quantity;
                } else {
                    item.cartQuantity = item.stock_quantity;
                }
                return { items: newItems };
            }

            return {
                items: [
                    ...state.items,
                    {
                        ...product,
                        cartItemId: crypto.randomUUID(),
                        cartQuantity: Math.min(quantity, product.stock_quantity),
                    },
                ],
            };
        });
    },

    removeItem: (cartItemId) => {
        set((state) => ({
            items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
    },

    updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
            items: state.items.map((item) => {
                if (item.cartItemId === cartItemId) {
                    const validQuantity = Math.max(1, Math.min(quantity, item.stock_quantity));
                    return { ...item, cartQuantity: validQuantity };
                }
                return item;
            }),
        }));
    },

    clearCart: () => {
        set({ items: [] });
    },

    getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + Number(item.price) * item.cartQuantity, 0);
    },

    getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.cartQuantity, 0);
    }
}));
