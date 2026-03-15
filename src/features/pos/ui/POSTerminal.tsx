"use client"

import { Product } from "@/entities/product/model/types"
import { POSSearch } from "./POSSearch"
import { CartSummary } from "./CartSummary"
import { CheckoutModal } from "./CheckoutModal"
import { useCartStore } from "../model/useCartStore"
import { useBarcodeScanner } from "../lib/useBarcodeScanner"
import { useState, useEffect } from "react"
import { getProductBySku } from "@/entities/product/api"
import { getTopSellingProductsAction, getCategoriesAction, searchProductAction, getProductBySkuAction } from '../api/search'

import { CategoryFilter } from "./CategoryFilter"
import { QuickPickGrid } from "./QuickPickGrid"

interface POSTerminalProps {
    organizationId: string;
}

export function POSTerminal({ organizationId }: POSTerminalProps) {
    const addItem = useCartStore(state => state.addItem)
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    // POS Intelligence State
    const [topProducts, setTopProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(true)

    // Initial Intelligence Load
    useEffect(() => {
        async function loadIntelligence() {
            setIsLoadingIntelligence(true)
            try {
                const [tpRes, catRes] = await Promise.all([
                    getTopSellingProductsAction(organizationId),
                    getCategoriesAction(organizationId)
                ])
                if (tpRes.products) setTopProducts(tpRes.products)
                if (catRes.categories) setCategories(catRes.categories)
            } catch (e) {
                console.error("Intelligence load failed", e)
            } finally {
                setIsLoadingIntelligence(false)
            }
        }
        loadIntelligence()
    }, [organizationId])

    // Category Filtering Logic
    useEffect(() => {
        async function loadCategoryProducts() {
            if (selectedCategory === "All") {
                setFilteredProducts([])
                return
            }

            try {
                const res = await searchProductAction(organizationId, "", 20, selectedCategory)
                if (res.products) setFilteredProducts(res.products)
            } catch (e) {
                console.error("Category fetch failed", e)
            }
        }
        loadCategoryProducts()
    }, [selectedCategory, organizationId])

    // Barcode Scanner Integration
    useBarcodeScanner({
        onScan: async (barcode) => {
            handleBarcodeScan(barcode)
        }
    })

    const handleBarcodeScan = async (barcode: string) => {
        try {
            const res = await getProductBySkuAction(organizationId, barcode)
            if (res.product) {
                addItem(res.product, 1)
            }
        } catch (e) {
            console.error("Failed to scan barcode", e)
        }
    }

    const handleSelectProduct = (product: Product) => {
        addItem(product, 1)
    }

    const handleCheckout = () => {
        setIsCheckingOut(true)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
            <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2 scrollbar-none no-scrollbar">
                <header>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Live Session</span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-white">POS Terminal</h1>
                </header>

                {/* Quick Pick Section */}
                <QuickPickGrid
                    title="Frequently Sold"
                    products={topProducts}
                    onSelectProduct={handleSelectProduct}
                />

                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                        Browse Catalog
                    </h3>

                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />

                    <POSSearch
                        organizationId={organizationId}
                        onSelectProduct={handleSelectProduct}
                    />

                    {/* Category Results Grid */}
                    {selectedCategory !== "All" && (
                        <div className="mt-2">
                            <QuickPickGrid
                                products={filteredProducts}
                                onSelectProduct={handleSelectProduct}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-[450px] shrink-0">
                <CartSummary onCheckout={handleCheckout} />
            </div>

            <CheckoutModal
                isOpen={isCheckingOut}
                onClose={() => setIsCheckingOut(false)}
                organizationId={organizationId}
            />
        </div>
    )
}
