import { z } from 'zod'

// Subscription validation schema
export const subscriptionSchema = z.object({
    name: z.string().min(1, 'Subscription name is required').max(100),
    amount: z.number().positive('Amount must be greater than 0'),
    currency: z.string().default('KES'),
    billingCycle: z.enum(['monthly', 'annual', 'custom']),
    customDays: z.number().int().positive().optional(),
    nextBillingDate: z.date(),
    status: z.enum(['active', 'cancelled', 'overdue', 'scheduled']).default('active'),
    categoryId: z.string().optional(),
    familyMember: z.string().max(50).optional(),
    logo: z.string().url().optional(),
    notes: z.string().max(500).optional(),
})

export const createSubscriptionSchema = subscriptionSchema

export const updateSubscriptionSchema = subscriptionSchema.partial()

// Category validation schema
export const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#3b82f6'),
    icon: z.string().max(50).optional(),
    budgetLimit: z.number().positive().optional(),
})

export const createCategorySchema = categorySchema

export const updateCategorySchema = categorySchema.partial()

// User preferences schema
export const userPreferencesSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    currency: z.string().length(3).default('KES'),
    monthlyBudget: z.number().positive().optional(),
})

// Notification schema
export const notificationSchema = z.object({
    subscriptionId: z.string().optional(),
    type: z.enum(['renewal_reminder', 'overdue', 'budget_warning', 'digest']),
    message: z.string().min(1).max(500),
})

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

// Export types
export type SubscriptionInput = z.infer<typeof subscriptionSchema>
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
export type NotificationInput = z.infer<typeof notificationSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
