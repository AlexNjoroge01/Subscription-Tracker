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
import { ArrowRight, Lock, Mail, Loader2, Eye, EyeOff, BarChart3, Bell, TrendingDown } from 'lucide-react'

const PREVIEW_SUBS = [
  { name: 'Netflix', price: '$15.99', urgent: true },
  { name: 'Spotify', price: '$9.99', urgent: false },
  { name: 'Notion', price: '$16.00', urgent: false },
]

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

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
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
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060c08] flex flex-col lg:flex-row">

      {/* ── Left panel — brand/preview ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden border-r border-white/[0.06]">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#a3e635]/[0.05] rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 bg-[#a3e635] rounded-[10px] flex items-center justify-center shadow-[0_0_16px_rgba(163,230,53,0.5)]">
            <svg className="w-[18px] h-[18px] text-[#060c08]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold text-white tracking-tight">SubTrack</span>
        </Link>

        {/* Dashboard preview card */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm bg-[#0d1b0f] border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-white/35 text-[11px] uppercase tracking-widest mb-1">Monthly Total</p>
                <p className="text-[38px] font-extrabold text-white leading-none">
                  $127<span className="text-xl text-white/45">.50</span>
                </p>
              </div>
              <div className="w-10 h-10 bg-[#a3e635]/15 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#a3e635]" />
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-12 mb-5">
              {[30, 52, 40, 68, 55, 80, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[3px]"
                  style={{
                    height: `${h}%`,
                    background: i === 6 ? '#a3e635' : `rgba(163,230,53,${0.1 + i * 0.06})`,
                  }}
                />
              ))}
            </div>

            <div className="space-y-2">
              {PREVIEW_SUBS.map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${sub.urgent ? 'bg-red-500/20 text-red-400' : 'bg-[#a3e635]/15 text-[#a3e635]'}`}>
                      {sub.name[0]}
                    </div>
                    <span className="text-[13px] font-medium text-white">{sub.name}</span>
                  </div>
                  <span className="text-[13px] font-bold text-white">{sub.price}</span>
                </div>
              ))}
            </div>

            {/* Floating pill */}
            <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-xl">
              <TrendingDown className="w-4 h-4 text-[#a3e635]" />
              <span className="text-[12px] text-[#a3e635] font-semibold">Save $156/year identified</span>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white/25 text-sm">
            Trusted by <span className="text-white/50 font-semibold">28M+</span> users worldwide
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 sm:p-10 lg:p-16">
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
            <h2 className="text-[32px] font-extrabold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-white/45 text-[15px]">Sign in to your account to continue</p>
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
                Continue with Google
              </>
            )}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[12px]">
              <span className="px-3 bg-[#060c08] text-white/30 font-medium">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-[13px] font-semibold text-white/70">Password</Label>
                <Link href="/forgot-password" className="text-[12px] text-[#a3e635] hover:text-[#b5f542] font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>
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
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[12px] text-red-400">{errors.password.message}</p>}
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
                  Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-[13px] text-white/40">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#a3e635] font-semibold hover:text-[#b5f542] transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
