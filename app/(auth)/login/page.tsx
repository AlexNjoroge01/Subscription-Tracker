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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        try {
            await signIn('google', { callbackUrl: '/dashboard' })
        } catch {
            toast.error('Something went wrong. Please try again.')
            setIsGoogleLoading(false)
        }
    }

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
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
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
            <div className="w-full lg:w-1/2 px-6 py-12 sm:p-12 lg:p-20 flex items-center justify-center bg-white overflow-y-auto">
                <div className="w-full max-w-lg">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-semibold text-slate-900">SubTrack</span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
                            Welcome back
                        </h2>
                        <p className="text-slate-500 text-base sm:text-lg">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full h-14 flex items-center justify-center gap-3 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-400">or continue with email</span>
                        </div>
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
                        <p className="text-slate-500 text-sm sm:text-base">
                            Don&apos;t have an account?{' '}
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
