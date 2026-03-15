'use client'

import { useState } from 'react'
import { Store, User, Mail, Briefcase, Send } from "lucide-react"
import { requestOrganization } from '../api/actions'

export function RequestForm() {
    const [pending, setPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setPending(true)
        setError(null)

        try {
            const result = await requestOrganization(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                setSuccess(true)
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setPending(false)
        }
    }

    if (success) {
        return (
            <div className="rounded-[2.2rem] bg-slate-900/50 p-8 md:p-10 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                    <Send className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Request Sent!</h2>
                <p className="text-slate-400">
                    Thank you for your interest. Our team will review your business details and get back to you shortly via email.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-amber-500 font-medium hover:underline"
                >
                    Submit another request
                </button>
            </div>
        )
    }

    return (
        <div className="rounded-[2.2rem] bg-slate-900/50 p-8 md:p-10">
            <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Business Name</label>
                        <div className="relative">
                            <Store className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="Lotter Shop"
                                className="h-12 w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 text-white outline-none ring-amber-500/50 transition-all focus:border-amber-500/50 focus:ring-4"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Slug (URL)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">/</span>
                            <input
                                name="slug"
                                type="text"
                                required
                                placeholder="my-shop"
                                className="h-12 w-full rounded-2xl border border-white/5 bg-white/5 pl-8 pr-4 text-white outline-none ring-amber-500/50 transition-all focus:border-amber-500/50 focus:ring-4"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Business Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            className="h-12 w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 text-white outline-none ring-amber-500/50 transition-all focus:border-amber-500/50 focus:ring-4"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Business Category</label>
                    <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <select
                            name="category"
                            className="h-12 w-full appearance-none rounded-2xl border border-white/5 bg-white/5 pl-12 pr-10 text-white outline-none ring-amber-500/50 transition-all focus:border-amber-500/50 focus:ring-4 capitalize"
                        >
                            <option value="retail">Retail Store</option>
                            <option value="wholesale">Wholesale</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="fashion">Fashion & Apparel</option>
                            <option value="electronics">Electronics</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-400 ml-1">{error}</p>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={pending}
                        className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#8B5CF6] font-bold text-white shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {pending ? 'Submitting...' : 'Submit Request'}
                            {!pending && <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                        </span>
                        <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    </button>
                </div>

                <p className="text-center text-xs text-slate-500">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
            </form>
        </div>
    )
}
