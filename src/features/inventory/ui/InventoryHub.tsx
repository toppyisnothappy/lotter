"use client"

import { Product } from "@/entities/product/model/types"
import { ProductTable } from "./ProductTable"
import { Plus, Search, Filter, Download } from "lucide-react"
import { useState, useMemo } from "react"
import { Modal } from "@/shared/ui/Modal"
import { ProductForm } from "./ProductForm"
import { ProductFormValues } from "@/entities/product/model/schema"
import { createProduct, updateProduct, deleteProduct } from "../api/actions"

interface InventoryHubProps {
    initialProducts: Product[]
    organizationId: string
}

export function InventoryHub({ initialProducts, organizationId }: InventoryHubProps) {
    const [products, setProducts] = useState(initialProducts)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [products, searchQuery])

    const handleCreateProduct = async (values: ProductFormValues) => {
        setIsLoading(true)
        const result = await createProduct({
            ...values,
            description: values.description || null,
            category: values.category || null,
            organization_id: organizationId
        })
        setIsLoading(false)
        if (result.success) {
            setIsAddModalOpen(false)
            // Note: revalidatePath in actions handles global state, 
            // but for instant feedback we can just refresh the page or update state.
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const handleUpdateProduct = async (values: ProductFormValues) => {
        if (!editingProduct) return
        setIsLoading(true)
        const result = await updateProduct(editingProduct.id, {
            ...values,
            description: values.description || null,
            category: values.category || null,
        })
        setIsLoading(false)
        if (result.success) {
            setEditingProduct(null)
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        const result = await deleteProduct(id)
        if (result.success) {
            window.location.reload()
        } else {
            alert(result.error)
        }
    }

    return (
        <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Inventory Hub</span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-white">Stock Management</h1>
                    <p className="text-zinc-500 font-medium mt-1">Total items tracked: {products.length}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all font-bold flex items-center gap-2 text-sm">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-12 px-8 rounded-2xl bg-primary-500 text-white font-bold shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="glass rounded-3xl p-4 border-white/5 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by SKU, name or category..."
                        className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="h-12 px-5 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white flex items-center gap-2 font-bold text-sm">
                        <Filter size={18} />
                        All Categories
                    </button>
                    <button className="h-12 px-5 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white flex items-center gap-2 font-bold text-sm">
                        Stock Level
                    </button>
                </div>
            </div>

            <ProductTable
                products={filteredProducts}
                onEdit={setEditingProduct}
                onDelete={handleDeleteProduct}
            />

            {/* Modals */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Create New Product"
            >
                <ProductForm onSubmit={handleCreateProduct} isLoading={isLoading} />
            </Modal>

            <Modal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                title="Edit Product"
            >
                {editingProduct && (
                    <ProductForm
                        initialData={editingProduct}
                        onSubmit={handleUpdateProduct}
                        isLoading={isLoading}
                    />
                )}
            </Modal>
        </>
    )
}
