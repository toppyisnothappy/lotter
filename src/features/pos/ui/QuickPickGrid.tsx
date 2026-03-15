"use client"

import { Product } from "@/entities/product/model/types"
import { Plus } from "lucide-react"

interface QuickPickGridProps {
    products: Product[];
    onSelectProduct: (product: Product) => void;
    title?: string;
}

export function QuickPickGrid({ products, onSelectProduct, title }: QuickPickGridProps) {
    if (products.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {title && (
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                    {title}
                </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => onSelectProduct(product)}
                        className="group relative flex flex-col items-start p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary-500/50 transition-all text-left overflow-hidden"
                    >
                        <div className="absolute top-2 right-2 p-1.5 bg-primary-500 rounded-lg scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-primary-500/20">
                            <Plus className="h-4 w-4 text-white" />
                        </div>

                        <div className="font-bold text-white mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
                            {product.name}
                        </div>
                        <div className="text-sm font-black text-white/50">
                            ${Number(product.price).toFixed(2)}
                        </div>

                        <div className="mt-2 text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {product.category || 'General'}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
