"use client"

import { ReactNode, useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative w-full max-w-2xl bg-zinc-900/90 glass border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
