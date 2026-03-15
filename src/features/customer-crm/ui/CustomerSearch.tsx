"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export function CustomerSearch() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [query, setQuery] = useState(searchParams?.get("q") || "")
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams?.toString() || "")
            if (query) {
                params.set("q", query)
            } else {
                params.delete("q")
            }

            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`)
            })
        }, 300)

        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, pathname, router])

    return (
        <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isPending ? 'text-primary-500 animate-pulse' : 'text-zinc-500'}`} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, phone or email..."
                className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
        </div>
    )
}
