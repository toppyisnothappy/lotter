"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { searchProductAction } from "../api/search"
import { Product } from "@/entities/product/model/types"
import { useDebounce } from "@/shared/lib/hooks/useDebounce"

interface POSSearchProps {
    organizationId: string;
    onSelectProduct: (product: Product) => void;
}

export function POSSearch({ organizationId, onSelectProduct }: POSSearchProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Product[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const debouncedQuery = useDebounce(query, 300)

    useEffect(() => {
        async function performSearch() {
            if (!debouncedQuery.trim()) {
                setResults([])
                setIsOpen(false)
                return
            }

            setIsSearching(true)
            const result = await searchProductAction(organizationId, debouncedQuery)
            if (result.products) {
                setResults(result.products)
                setIsOpen(result.products.length > 0)
            }
            setIsSearching(false)
        }

        performSearch()
    }, [debouncedQuery, organizationId])

    const handleSelect = (product: Product) => {
        onSelectProduct(product)
        setQuery("")
        setResults([])
        setIsOpen(false)
    }

    return (
        <div className="relative w-full z-50">
            <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products by name or SKU..."
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-white text-lg focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-zinc-600 font-medium"
                />
                {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 h-5 w-5 animate-spin" />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl glass p-2 flex flex-col gap-1 max-h-96 overflow-y-auto">
                    {results.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group"
                        >
                            <div>
                                <h4 className="text-white font-bold group-hover:text-primary-400 transition-colors">{product.name}</h4>
                                <p className="text-sm text-zinc-500 font-medium">SKU: {product.sku}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-black">${Number(product.price).toFixed(2)}</p>
                                <p className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">In Stock: {product.stock_quantity}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
