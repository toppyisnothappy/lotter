"use client"

import { CustomerFormValues, customerFormSchema } from "@/entities/customer/model/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Customer } from "@/entities/customer/model/types"

interface CustomerFormProps {
    initialData?: Customer
    onSubmit: (values: CustomerFormValues) => void
    isLoading?: boolean
}

export function CustomerForm({ initialData, onSubmit, isLoading }: CustomerFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerFormSchema) as any,
        defaultValues: initialData ? {
            full_name: initialData.full_name,
            phone: initialData.phone || "",
            email: initialData.email || "",
            line_id: initialData.line_id || "",
            total_balance: initialData.total_balance,
        } : {
            full_name: "",
            phone: "",
            email: "",
            line_id: "",
            total_balance: 0,
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div>
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                <input
                    {...register("full_name")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    placeholder="e.g. John Doe"
                />
                {errors.full_name && <p className="text-red-400 text-xs mt-1 font-bold">{errors.full_name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Phone</label>
                    <input
                        {...register("phone")}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                        placeholder="e.g. +1 234 567 890"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1 font-bold">{errors.phone.message}</p>}
                </div>
                <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                        placeholder="e.g. john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 font-bold">{errors.email.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">LINE Account ID</label>
                <input
                    {...register("line_id")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                    placeholder="e.g. line_id_123"
                />
                {errors.line_id && <p className="text-red-400 text-xs mt-1 font-bold">{errors.line_id.message}</p>}
            </div>

            <div>
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Initial Debt Balance ($)</label>
                <input
                    {...register("total_balance")}
                    type="number"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                />
                {errors.total_balance && <p className="text-red-400 text-xs mt-1 font-bold">{errors.total_balance.message}</p>}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                >
                    {isLoading ? "Processing..." : initialData ? "Update Customer" : "Register Customer"}
                </button>
            </div>
        </form>
    )
}
