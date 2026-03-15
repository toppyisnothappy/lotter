"use client"

import { Customer } from "@/entities/customer/model/types"
import { CustomerTable } from "./CustomerTable"
import { Plus, Filter, UserCheck, ShieldAlert, Download } from "lucide-react"
import { useState } from "react"
import { Modal } from "@/shared/ui/Modal"
import { CustomerForm } from "./CustomerForm"
import { CustomerFormValues } from "@/entities/customer/model/schema"
import { createCustomerAction, updateCustomerAction } from "../api/actions"
import { CustomerSearch } from "./CustomerSearch"

interface CustomerHubProps {
    initialCustomers: Customer[]
    organizationId: string
}

export function CustomerHub({ initialCustomers, organizationId }: CustomerHubProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const highExposureCount = initialCustomers.filter(c => c.total_balance > 0).length

    const handleCreateCustomer = async (values: CustomerFormValues) => {
        setIsLoading(true)
        const result = await createCustomerAction(organizationId, {
            organization_id: organizationId,
            full_name: values.full_name,
            phone: values.phone || null,
            email: values.email || null,
            line_id: values.line_id || null,
            total_balance: values.total_balance
        })
        setIsLoading(false)
        if (result.success) {
            setIsAddModalOpen(false)
        } else {
            alert(result.error)
        }
    }

    const handleUpdateCustomer = async (values: CustomerFormValues) => {
        if (!editingCustomer) return
        setIsLoading(true)
        const result = await updateCustomerAction(organizationId, editingCustomer.id, {
            full_name: values.full_name,
            phone: values.phone || null,
            email: values.email || null,
            line_id: values.line_id || null,
            total_balance: values.total_balance
        })
        setIsLoading(false)
        if (result.success) {
            setEditingCustomer(null)
        } else {
            alert(result.error)
        }
    }

    return (
        <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">CRM Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-white">Customer Base</h1>
                    <p className="text-zinc-500 font-medium mt-1">Strengthen your business relationships.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all font-bold flex items-center gap-2 text-sm">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-12 px-8 rounded-2xl bg-white text-black font-bold shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Register Customer
                    </button>
                </div>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20 text-2xl font-black">
                        {initialCustomers.length}
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-2">Total Contacts</p>
                        <h3 className="text-2xl font-display font-bold text-white">Registered</h3>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-2">Good Standing</p>
                        <h3 className="text-2xl font-display font-bold text-white">
                            {initialCustomers.length > 0 ? Math.round(((initialCustomers.length - highExposureCount) / initialCustomers.length) * 100) : 0}% of total
                        </h3>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mb-2">High Exposure</p>
                        <h3 className="text-2xl font-display font-bold text-white">{highExposureCount} customers</h3>
                    </div>
                </div>
            </div>

            <div className="glass rounded-3xl p-4 border-white/5 mb-8 flex flex-col md:flex-row gap-4">
                <CustomerSearch />
                <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white flex items-center gap-2 font-bold text-sm">
                    <Filter size={18} />
                    Filter Debt
                </button>
            </div>

            <CustomerTable
                customers={initialCustomers}
                onEdit={setEditingCustomer}
            />

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Register New Customer"
            >
                <CustomerForm onSubmit={handleCreateCustomer} isLoading={isLoading} />
            </Modal>

            <Modal
                isOpen={!!editingCustomer}
                onClose={() => setEditingCustomer(null)}
                title="Edit Customer"
            >
                {editingCustomer && (
                    <CustomerForm
                        initialData={editingCustomer}
                        onSubmit={handleUpdateCustomer}
                        isLoading={isLoading}
                    />
                )}
            </Modal>
        </>
    )
}
