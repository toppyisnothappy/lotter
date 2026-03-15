"use client"

import { Product } from "@/entities/product/model/types"
import { ProductRow } from "@/entities/product/ui/ProductRow"
import { Package } from "lucide-react"

interface ProductTableProps {
    products: Product[]
    onEdit?: (product: Product) => void
    onDelete?: (id: string) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 glass rounded-[2.5rem] border-dashed border-white/10">
                <Package className="h-16 w-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold text-white">No products found</h3>
                <p className="text-zinc-500 mt-2">Start adding items to your inventory.</p>
            </div>
        )
    }

    return (
        <div className="glass rounded-[2rem] border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
                            <th className="px-8 py-6">Product Details</th>
                            <th className="px-8 py-6">Category</th>
                            <th className="px-8 py-6 text-center">In Stock</th>
                            <th className="px-8 py-6">Price</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.map((product) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
