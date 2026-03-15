"use client"

import { useCartStore } from "../model/useCartStore"
import { CartLineItem } from "./CartLineItem"
import { ShoppingCart, Trash2 } from "lucide-react"

interface CartSummaryProps {
    onCheckout: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
    const items = useCartStore(state => state.items)
    const total = useCartStore(state => state.getTotal())
    const clearCart = useCartStore(state => state.clearCart)

    return (
        <div className="flex flex-col h-full bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden glass">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-500/20 text-primary-500 rounded-xl">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Current Order</h2>
                        <p className="text-sm text-zinc-500 font-medium">{items.length} items</p>
                    </div>
                </div>

                {items.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <Trash2 size={16} />
                        Clear All
                    </button>
                )}
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                        <ShoppingCart size={48} className="opacity-20" />
                        <p className="text-lg font-medium">Cart is empty</p>
                        <p className="text-sm">Search or scan items to add them</p>
                    </div>
                ) : (
                    items.map(item => (
                        <CartLineItem key={item.cartItemId} item={item} />
                    ))
                )}
            </div>

            {/* Footer / Checkout */}
            <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-zinc-400 font-bold text-lg">Total Due</span>
                    <span className="text-4xl font-black text-white">${total.toFixed(2)}</span>
                </div>

                <button
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className="w-full h-16 bg-primary-500 hover:bg-primary-400 text-white font-black text-xl rounded-2xl shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    )
}
