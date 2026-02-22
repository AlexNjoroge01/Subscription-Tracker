'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { registerSchema, type RegisterInput } from '@/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Lock, Mail, User, Shield, Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || 'Registration failed')
                return
            }

            toast.success('Account created successfully!')

            // Auto sign in after registration
            const signInResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (signInResult?.error) {
                router.push('/login')
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-semibold text-white tracking-tight">SubTrack</span>
                    </Link>

                    {/* Headline */}
                    <h1 className="font-heading text-5xl xl:text-6xl font-semibold text-white leading-tight mb-6">
                        Start tracking your<br />
                        <span className="text-emerald-400">subscriptions today.</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Join thousands of users who save money by staying on top of their recurring payments.
                    </p>

                    {/* Features */}
                    <div className="mt-12 space-y-4">
                        {[
                            'Free forever for basic use',
                            'Set up in under 2 minutes',
                            'Cancel anytime, no strings attached',
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                </div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold text-slate-900 tracking-tight">SubTrack</span>
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="font-heading text-3xl font-semibold text-slate-900 mb-2">
                            Create your account
                        </h2>
                        <p className="text-slate-500">
                            Enter your details to get started
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                Full name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...register('name')}
                                    disabled={isLoading}
                                    className="pl-12 h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    disabled={isLoading}
                                    className="pl-12 h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={isLoading}
                                    className="pl-12 h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                                Confirm password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('confirmPassword')}
                                    disabled={isLoading}
                                    className="pl-12 h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-slate-900/10 group mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-medium">
                            Secured with end-to-end encryption
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
