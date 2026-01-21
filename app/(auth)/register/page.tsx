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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>
                    Enter your information to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            {...register('name')}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
