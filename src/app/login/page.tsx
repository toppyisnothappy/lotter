import { BarChart3, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { loginAction } from "@/features/auth/api/actions"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                        <BarChart3 className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-3xl font-display font-extrabold text-white">Welcome to Lotter</h2>
                    <p className="mt-2 text-sm text-zinc-400">Sign in to manage your retail store</p>
                </div>

                <div className="glass rounded-[2rem] p-8 border border-white/5 bg-zinc-950/50 shadow-2xl transition-all hover:border-white/10">
                    <form action={loginAction} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2 font-display uppercase tracking-widest text-[10px]">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 h-5 w-5 transition-colors group-focus-within:text-violet-500" />
                                <input
                                    name="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-violet-500 transition-all font-medium placeholder:text-zinc-700"
                                    placeholder="owner@store.com"
                                    type="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2 font-display uppercase tracking-widest text-[10px]">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 h-5 w-5 transition-colors group-focus-within:text-violet-500" />
                                <input
                                    name="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-violet-500 transition-all font-medium placeholder:text-zinc-700"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                        >
                            Sign In to Dashboard
                        </button>
                    </form>
                </div>


                <p className="text-center text-sm text-zinc-500 font-medium tracking-tight">
                    New here?{" "}
                    <Link href="/request-account" className="text-violet-400 hover:text-white transition-colors font-bold">
                        Register your business
                    </Link>
                </p>
            </div>
        </div>
    )
}
