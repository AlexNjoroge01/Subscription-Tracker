'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react'

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email }),
            })
            const result = await response.json()
            if (!response.ok) {
                toast.error(result.error || 'Failed to send reset email')
                return
            }
            setIsSuccess(true)
            toast.success('Reset instructions sent to your email')
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#060c08] flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-[#0d1b0f] border border-white/[0.07] rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-[#a3e635]/15 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-[#a3e635]" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
                        <p className="text-white/50 mb-6">
                            We&apos;ve sent password reset instructions to your email address.
                            Please check your inbox and follow the link to reset your password.
                        </p>
                        <p className="text-sm text-white/35 mb-6">
                            Didn&apos;t receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-[#a3e635] font-semibold hover:text-[#b5f542] transition-colors"
                            >
                                try again
                            </button>
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-[#a3e635] font-semibold hover:text-[#b5f542] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
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
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-8 mx-auto w-fit">
                        <div className="w-9 h-9 bg-[#a3e635] rounded-[10px] flex items-center justify-center shadow-[0_0_16px_rgba(163,230,53,0.45)]">
                            <svg className="w-[18px] h-[18px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-[17px] font-semibold text-white tracking-tight">SubTrack</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot your password?</h1>
                    <p className="text-white/45">No worries — we&apos;ll send you reset instructions.</p>
                </div>

                <div className="bg-[#0d1b0f] border border-white/[0.07] rounded-2xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[13px] font-semibold text-white/70">
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    disabled={isLoading}
                                    className="pl-11 h-12 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/25 focus:border-[#a3e635]/60 focus:ring-[#a3e635]/20 rounded-xl text-[14px]"
                                />
                            </div>
                            {errors.email && <p className="text-[12px] text-red-400">{errors.email.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl text-[14px] lime-glow transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Send reset instructions'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-[13px]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
