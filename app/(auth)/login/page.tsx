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

            toast.success('Access Granted. Welcome to Zenith.')
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            toast.error('System bypass failed. Try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 selection:bg-emerald-100">
            {/* Background Decorative Blobs - Matches Entry Page */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px] -z-10" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-[800x] space-y-8">
                {/* Brand Logo */}
                <div className="flex flex-col items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white italic shadow-lg shadow-emerald-500/20">
                            Z
                        </div>
                        ZENITH
                    </Link>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Continue your journey to capital mastery.
                        </p>
                    </div>
                </div>

                {/* Login Card Shell */}
                <div className="bg-white border border-slate-200/60 rounded-[32px] shadow-2xl shadow-slate-200/50 p-8 backdrop-blur-xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="alex@example.com"
                                        {...register('email')}
                                        disabled={isLoading}
                                        className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Security Token
                                    </Label>
                                    <Link href="/forgot-password"  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        disabled={isLoading}
                                        className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-medium text-red-500 ml-1">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/10 group" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Access Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                        <p className="text-sm font-medium text-slate-500">
                            New to the inner circle?{' '}
                            <Link href="/register" className="text-emerald-600 font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Zap className="w-3 h-3 fill-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        End-to-End Encryption Secured
                    </span>
                </div>
            </div>
        </div>
    )
}