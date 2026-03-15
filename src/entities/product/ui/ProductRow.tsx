"use client"

import { Product } from "../model/types"
import { Edit2, Trash2, Package, AlertTriangle, MoreVertical } from "lucide-react"
import { cn } from "@/shared/lib/utils/utils"

interface ProductRowProps {
    product: Product
    onEdit?: (product: Product) => void
    onDelete?: (id: string) => void
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
    return (
        <tr className="group hover:bg-white/[0.02] transition-colors">
            <td className="px-8 py-7">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-400 border border-white/5 group-hover:border-primary-500/30 transition-colors">
                        <Package size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-white text-lg">{product.name}</div>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">{product.sku}</div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-7">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-300">
                    {product.category || "Uncategorized"}
                </span>
            </td>
            <td className="px-8 py-7">
                <div className="flex flex-col items-center">
                    <span className={cn(
                        "text-lg font-display font-black",
                        product.stock_quantity <= product.min_stock_level ? "text-amber-500" : "text-white"
                    )}>
                        {product.stock_quantity}
                    </span>
                    {product.stock_quantity <= product.min_stock_level && (
                        <div className="flex items-center gap-1 mt-1">
                            <AlertTriangle size={10} className="text-amber-500" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Low Stock</span>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-8 py-7">
                <div className="font-display font-black text-white text-lg">
                    ${Number(product.price).toFixed(2)}
                </div>
            </td>
            <td className="px-8 py-7 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit?.(product)}
                        className="p-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete?.(product.id)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                <button className="p-2.5 text-zinc-500 hover:text-white transition-colors group-hover:hidden">
                    <MoreVertical size={20} />
                </button>
            </td>
        </tr>
    )
}
