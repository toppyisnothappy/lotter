'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from "lucide-react"
import { approveOrganization, suspendOrganization } from '../api/actions'

interface Props {
    id: string;
    status: string;
}

export function ApprovalButtons({ id, status }: Props) {
    const [pending, setPending] = useState(false)

    if (status !== 'pending') return null

    async function handleApprove() {
        setPending(true)
        try {
            await approveOrganization(id)
        } finally {
            setPending(false)
        }
    }

    async function handleSuspend() {
        setPending(true)
        try {
            await suspendOrganization(id)
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={handleSuspend}
                disabled={pending}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
                <XCircle size={18} />
            </button>
            <button
                onClick={handleApprove}
                disabled={pending}
                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
                <CheckCircle2 size={18} />
            </button>
        </div>
    )
}
