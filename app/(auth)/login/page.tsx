'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { loginSchema, type LoginInput } from '@/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Lock, Mail, Zap, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true)
        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                toast.error('Invalid credentials. Check your audit and try again.')
                return
            }

            toast.success('Access Granted. Welcome to MySubMonitor.com.')
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            toast.error('System bypass failed. Try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 selection:bg-emerald-100 font-poppins">
            {/* Background Decorative Blobs - Matches Entry Page */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px] -z-10" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-[500px] space-y-12">
                {/* Brand Logo */}
                <div className="flex flex-col items-center gap-6">
                    <Link href="/" className="flex items-center gap-3 font-bold text-3xl tracking-tighter">
                        <div className="w-14 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white italic shadow-lg shadow-emerald-500/20">
                            MSM
                        </div>
                        MySubMonitor.com
                    </Link>
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 font-semibold">
                            Continue your journey to capital mastery.
                        </p>
                    </div>
                </div>

                {/* Login Card Shell */}
                <div className="bg-white border border-slate-200/60 rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 backdrop-blur-xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="alex@example.com"
                                        {...register('email')}
                                        disabled={isLoading}
                                        className="pl-13 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs font-semibold text-red-500 ml-2">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-2">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Security Token
                                    </Label>
                                    <Link href="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        disabled={isLoading}
                                        className="pl-13 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-semibold text-red-500 ml-2">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/10 group active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-3 text-base">
                                    Access Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                        <p className="text-sm font-semibold text-slate-500">
                            New to the inner circle?{' '}
                            <Link href="/register" className="text-emerald-600 font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-3 text-slate-400">
                    <Zap className="w-4 h-4 fill-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        End-to-End Encryption Secured
                    </span>
                </div>
            </div>
        </div>
    )
}