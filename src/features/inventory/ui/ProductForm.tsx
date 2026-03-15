"use client"

import { ProductFormValues, productFormSchema } from "@/entities/product/model/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@/entities/product/model/types"

interface ProductFormProps {
    initialData?: Product
    onSubmit: (values: ProductFormValues) => void
    isLoading?: boolean
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            sku: initialData.sku,
            description: initialData.description,
            price: initialData.price,
            stock_quantity: initialData.stock_quantity,
            min_stock_level: initialData.min_stock_level,
            category: initialData.category,
        } : {
            name: "",
            sku: "",
            description: "",
            price: 0,
            stock_quantity: 0,
            min_stock_level: 5,
            category: "",
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Product Name</label>
                    <input
                        {...register("name")}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                        placeholder="e.g. Premium Coffee Beans"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-bold">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">SKU / Barcode</label>
                    <input
                        {...register("sku")}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono focus:outline-none focus:border-primary-500/50 transition-all"
                        placeholder="e.g. COFF-001"
                    />
                    {errors.sku && <p className="text-red-400 text-xs mt-1 font-bold">{errors.sku.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all resize-none"
                    placeholder="Brief description of the product..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Price ($)</label>
                    <input
                        {...register("price")}
                        type="number"
                        step="0.01"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                    {errors.price && <p className="text-red-400 text-xs mt-1 font-bold">{errors.price.message}</p>}
                </div>
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Current Stock</label>
                    <input
                        {...register("stock_quantity")}
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                    {errors.stock_quantity && <p className="text-red-400 text-xs mt-1 font-bold">{errors.stock_quantity.message}</p>}
                </div>
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Min Alert Level</label>
                    <input
                        {...register("min_stock_level")}
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                >
                    {isLoading ? "Processing..." : initialData ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    )
}
