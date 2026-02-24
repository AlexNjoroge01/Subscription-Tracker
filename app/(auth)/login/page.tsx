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
import { ArrowRight, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

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
                toast.error('Invalid credentials. Please try again.')
                return
            }

            toast.success('Welcome back!')
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 flex">
            {/* Left Panel - Branding */}
            <div className="w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 p-12 lg:p-20 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full" />
                
                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                            <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-3xl font-semibold text-white">SubTrack</span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
                    <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-white leading-tight mb-8">
                        Start tracking your subscriptions today.
                    </h1>
                    <p className="text-emerald-100 text-xl lg:text-2xl max-w-xl">
                        Join thousands of users saving money every month.
                    </p>
                </div>

                {/* Features */}
                <div className="relative z-10 space-y-5">
                    {[
                        'Track unlimited subscriptions',
                        'Get timely renewal reminders',
                        'Analyze your spending patterns',
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 text-white">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-lg">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-1/2 p-12 lg:p-20 flex items-center justify-center bg-white">
                <div className="w-full max-w-lg">
                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="font-heading text-4xl font-semibold text-slate-900 mb-4">
                            Welcome back
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-base font-medium text-slate-700">
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    disabled={isLoading}
                                    className="pl-14 h-14 text-base"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-base font-medium text-slate-700">
                                    Password
                                </Label>
                                <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={isLoading}
                                    className="pl-14 pr-14 h-14 text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all group text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign in <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-500 text-base">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-emerald-600 font-medium hover:text-emerald-700">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
