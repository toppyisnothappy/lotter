"use client"

import { useState, useEffect } from "react"
import { Search, User, X, Check } from "lucide-react"
import { searchCustomersAction } from "../../customer-crm/api/actions"
import { Customer } from "@/entities/customer/model/types"
import { useDebounce } from "@/shared/lib/hooks/useDebounce"

interface CustomerSelectionProps {
    organizationId: string;
    onSelect: (customer: Customer | null) => void;
    selectedCustomer: Customer | null;
}

export function CustomerSelection({ organizationId, onSelect, selectedCustomer }: CustomerSelectionProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Customer[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const debouncedQuery = useDebounce(query, 300)

    useEffect(() => {
        async function performSearch() {
            if (!debouncedQuery.trim()) {
                setResults([])
                return
            }

            setIsSearching(true)
            try {
                const res = await searchCustomersAction(organizationId, debouncedQuery)
                if (res.results) {
                    setResults(res.results)
                    setIsDropdownOpen(true)
                }
            } catch (e) {
                console.error("Failed to search customers", e)
            } finally {
                setIsSearching(false)
            }
        }
        performSearch()
    }, [debouncedQuery, organizationId])

    const handleSelect = (customer: Customer) => {
        onSelect(customer)
        setQuery("")
        setResults([])
        setIsDropdownOpen(false)
    }

    const handleClear = () => {
        onSelect(null)
    }

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-zinc-400">Customer Attribution</label>

            {selectedCustomer ? (
                <div className="flex items-center justify-between p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl group transition-all">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-black">
                            {selectedCustomer.full_name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white font-bold">{selectedCustomer.full_name}</p>
                            <p className="text-xs text-primary-400 font-medium">{selectedCustomer.phone || selectedCustomer.email || 'No contact info'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClear}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search customer by name or phone..."
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-zinc-600"
                    />

                    {isDropdownOpen && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-1 flex flex-col gap-1 max-h-60 overflow-y-auto glass">
                            {results.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => handleSelect(customer)}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-left transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-bold">{customer.full_name}</p>
                                            <p className="text-[10px] text-zinc-500 font-medium">{customer.phone}</p>
                                        </div>
                                    </div>
                                    <div className="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary-500 transition-colors">
                                        <Check size={12} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
