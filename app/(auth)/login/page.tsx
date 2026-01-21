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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
                toast.error('Invalid email or password')
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
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                <CardDescription>
                    Enter your email and password to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...register('email')}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
