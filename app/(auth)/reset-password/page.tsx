'use client'

import { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'

const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [isValid, setIsValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const token = searchParams.get('token')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    })

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValid(false)
                setIsValidating(false)
                return
            }
            try {
                const response = await fetch(`/api/auth/reset-password?token=${token}`)
                const result = await response.json()
                setIsValid(response.ok && result.valid)
            } catch {
                setIsValid(false)
            } finally {
                setIsValidating(false)
            }
        }
        validateToken()
    }, [token])

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token) return
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: data.password }),
            })
            const result = await response.json()
            if (!response.ok) {
                toast.error(result.error || 'Failed to reset password')
                return
            }
            toast.success('Password reset successfully!')
            router.push('/login')
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const Logo = () => (
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8 mx-auto w-fit">
            <div className="w-9 h-9 bg-[#a3e635] rounded-[10px] flex items-center justify-center shadow-[0_0_16px_rgba(163,230,53,0.45)]">
                <svg className="w-[18px] h-[18px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <span className="text-[17px] font-semibold text-white tracking-tight">SubTrack</span>
        </Link>
    )

    if (isValidating) {
        return (
            <div className="min-h-screen bg-[#060c08] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#a3e635]" />
                    <p className="text-white/45 text-[14px]">Validating reset link…</p>
                </div>
            </div>
        )
    }

    if (!isValid) {
        return (
            <div className="min-h-screen bg-[#060c08] flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-[#0d1b0f] border border-white/[0.07] rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">Invalid or expired link</h1>
                        <p className="text-white/50 mb-6">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center justify-center w-full h-12 bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl transition-all lime-glow text-[14px]"
                        >
                            Request new reset link
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#060c08] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Logo />
                    <h1 className="text-3xl font-bold text-white mb-2">Reset your password</h1>
                    <p className="text-white/45">Enter a new password for your account.</p>
                </div>

                <div className="bg-[#0d1b0f] border border-white/[0.07] rounded-2xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[13px] font-semibold text-white/70">
                                New password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={isLoading}
                                    className="pl-11 pr-12 h-12 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/25 focus:border-[#a3e635]/60 focus:ring-[#a3e635]/20 rounded-xl text-[14px]"
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[12px] text-red-400">{errors.password.message}</p>}
                            <p className="text-[11px] text-white/30 leading-relaxed">
                                Min. 8 chars · uppercase · lowercase · number
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-white/70">
                                Confirm new password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('confirmPassword')}
                                    disabled={isLoading}
                                    className="pl-11 pr-12 h-12 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/25 focus:border-[#a3e635]/60 focus:ring-[#a3e635]/20 rounded-xl text-[14px]"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-[12px] text-red-400">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl text-[14px] lime-glow transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset password'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-white/35 hover:text-white/65 transition-colors text-[13px]">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#060c08] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#a3e635]" />
                    <p className="text-white/45 text-[14px]">Loading…</p>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
