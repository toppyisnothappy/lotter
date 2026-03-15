import { Organization } from "@/entities/organization/model/types"
import { ApprovalButtons } from "./ApprovalButtons"
import { cn } from "@/shared/lib/utils/utils"

interface Props {
    organizations: Organization[]
}

export function OrganizationTable({ organizations }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/[0.02] text-zinc-500 text-xs uppercase tracking-widest font-bold">
                        <th className="px-6 py-4">Organization</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {organizations.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                No organizations found.
                            </td>
                        </tr>
                    )}
                    {organizations.map((org) => (
                        <tr key={org.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="px-6 py-6 font-medium">
                                <div>
                                    <div className="text-white">{org.name}</div>
                                    <div className="text-xs text-zinc-500 font-mono">/{org.slug}</div>
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <StatusBadge status={org.status} />
                            </td>
                            <td className="px-6 py-6 text-zinc-400 text-sm">
                                {new Date(org.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-6 text-right">
                                <ApprovalButtons id={org.id} status={org.status} />
                                {org.status !== 'pending' && (
                                    <button className="text-zinc-500 text-xs font-bold hover:text-white transition-colors">
                                        VIEW DETAILS
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        suspended: "bg-red-500/10 text-red-500 border-red-500/20",
    }

    return (
        <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            styles[status] || styles.pending
        )}>
            {status}
        </span>
    )
}
