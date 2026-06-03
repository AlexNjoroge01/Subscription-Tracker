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
import { ArrowRight, Lock, Mail, User, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const BENEFITS = [
  'Track unlimited subscriptions',
  'Renewal alerts before you forget',
  'Spot savings you\'re missing',
]

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch {
      toast.error('Something went wrong. Please try again.')
      setIsGoogleLoading(false)
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      })
      const result = await response.json()
      if (!response.ok) {
        toast.error(result.error || 'Registration failed')
        return
      }
      toast.success('Account created successfully!')
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
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060c08] flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[48%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden border-r border-white/[0.06]">
        {/* Ambient */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#a3e635]/[0.05] rounded-full blur-[120px] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 bg-[#a3e635] rounded-[10px] flex items-center justify-center shadow-[0_0_16px_rgba(163,230,53,0.5)]">
            <svg className="w-[18px] h-[18px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold text-white tracking-tight">SubTrack</span>
        </Link>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <p className="text-[#a3e635] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">Free to start</p>
          <h1 className="text-[44px] xl:text-[52px] font-extrabold text-white leading-[1.06] tracking-tight mb-6">
            Your subscriptions,{' '}
            <em className="font-heading font-light italic not-italic text-[#a3e635] text-[50px] xl:text-[60px] leading-none">
              finally under control.
            </em>
          </h1>
          <p className="text-white/40 text-[16px] leading-relaxed max-w-sm mb-10">
            Set up in under 2 minutes. No credit card needed.
          </p>

          <ul className="space-y-4">
            {BENEFITS.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#a3e635]/15 border border-[#a3e635]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e635]" />
                </div>
                <span className="text-white/65 text-[15px]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom savings highlight */}
        <div className="relative z-10 p-5 bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-2xl">
          <p className="text-white/50 text-[12px] font-semibold uppercase tracking-wide mb-1">Average savings</p>
          <p className="text-[#a3e635] text-3xl font-extrabold">$156<span className="text-lg text-[#a3e635]/60 font-normal"> / year</span></p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10 mx-auto w-fit">
            <div className="w-8 h-8 bg-[#a3e635] rounded-[10px] flex items-center justify-center shadow-[0_0_16px_rgba(163,230,53,0.4)]">
              <svg className="w-[17px] h-[17px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-white">SubTrack</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-[32px] font-extrabold text-white mb-2 tracking-tight">Create your account</h2>
            <p className="text-white/45 text-[15px]">Free forever — no credit card required</p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07] rounded-xl text-white text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-5"
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
                Sign up with Google
              </>
            )}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[12px]">
              <span className="px-3 bg-[#060c08] text-white/30 font-medium">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] font-semibold text-white/70">Full name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  disabled={isLoading}
                  className="pl-11 h-12 bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/25 focus:border-[#a3e635]/60 focus:ring-[#a3e635]/20 rounded-xl text-[14px]"
                />
              </div>
              {errors.name && <p className="text-[12px] text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-semibold text-white/70">Email address</Label>
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-semibold text-white/70">Password</Label>
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
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-white/70">Confirm password</Label>
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
              disabled={isLoading}
              className="w-full h-12 bg-[#a3e635] hover:bg-[#b5f542] text-[#060c08] font-bold rounded-xl text-[14px] lime-glow transition-all group mt-2"
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

          <p className="mt-8 text-center text-[13px] text-white/40">
            Already have an account?{' '}
            <Link href="/login" className="text-[#a3e635] font-semibold hover:text-[#b5f542] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
