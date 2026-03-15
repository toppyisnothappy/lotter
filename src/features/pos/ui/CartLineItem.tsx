"use client"

import { CartItem, useCartStore } from "../model/useCartStore"
import { Trash2, Plus, Minus } from "lucide-react"

interface CartLineItemProps {
    item: CartItem
}

export function CartLineItem({ item }: CartLineItemProps) {
    const updateQuantity = useCartStore(state => state.updateQuantity)
    const removeItem = useCartStore(state => state.removeItem)

    return (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors">
            <div className="flex-1">
                <h4 className="text-white font-bold text-lg">{item.name}</h4>
                <p className="text-sm text-zinc-500 font-medium">{item.sku}</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-white font-black">${(Number(item.price) * item.cartQuantity).toFixed(2)}</p>
                    <p className="text-xs text-zinc-500">${Number(item.price).toFixed(2)} each</p>
                </div>

                <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-white/5">
                    <button
                        onClick={() => updateQuantity(item.cartItemId, item.cartQuantity - 1)}
                        disabled={item.cartQuantity <= 1}
                        className="p-2 text-zinc-400 hover:text-white disabled:opacity-50 disabled:hover:text-zinc-400 transition-colors"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-white font-bold">{item.cartQuantity}</span>
                    <button
                        onClick={() => updateQuantity(item.cartItemId, item.cartQuantity + 1)}
                        disabled={item.cartQuantity >= item.stock_quantity}
                        className="p-2 text-zinc-400 hover:text-white disabled:opacity-50 disabled:hover:text-zinc-400 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-3 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Remove item"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    )
}
