'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Plus,
  Loader2,
  CalendarDays,
  Tag,
  User,
  CreditCard,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
} from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import type { Subscription } from '@/app/generated/prisma/models/Subscription'
import type { Category } from '@/app/generated/prisma/models/Category'
import { createSubscriptionSchema, updateSubscriptionSchema } from '@/schemas'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const formSchema = createSubscriptionSchema.extend({
  // Override nextBillingDate to use a string input on the client
  nextBillingDate: z.string().min(1, 'Next billing date is required'),
})

type FormValues = z.infer<typeof formSchema>

type SubscriptionWithCategory = Subscription & {
  category: Category | null
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editing, setEditing] = useState<SubscriptionWithCategory | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'overdue' | 'cancelled' | 'scheduled'>('all')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      currency: 'KES',
      billingCycle: 'monthly',
      customDays: undefined,
      nextBillingDate: '',
      status: 'active',
      categoryId: '',
      familyMember: '',
      logo: '',
      notes: '',
    },
  })

  const editForm = useForm<z.infer<typeof updateSubscriptionSchema>>({
    resolver: zodResolver(updateSubscriptionSchema),
  })

  const loadSubscriptions = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/subscriptions')
      if (!res.ok) {
        throw new Error('Failed to load subscriptions')
      }
      const data = await res.json()
      setSubscriptions(data.data ?? data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load subscriptions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSubscriptions()
    void loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const json = await res.json()
      if (!res.ok) return
      setCategories(json.data ?? json)
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

      const payload = {
        ...values,
        amount: Number(values.amount),
        nextBillingDate: values.nextBillingDate,
        categoryId: values.categoryId || undefined,
        familyMember: values.familyMember || undefined,
        logo: values.logo || undefined,
        notes: values.notes || undefined,
      }

      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? 'Failed to create subscription')
        return
      }

      toast.success('Subscription added successfully')
      form.reset()
      void loadSubscriptions()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)

  const formatDate = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString()
  }

  const statusVariant = (status: string | null | undefined) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'overdue':
        return 'destructive'
      case 'cancelled':
        return 'secondary'
      case 'scheduled':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const daysUntil = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value
    if (isNaN(date.getTime())) return null
    const today = new Date()
    const diffMs = date.getTime() - today.setHours(0, 0, 0, 0)
    return Math.round(diffMs / (1000 * 60 * 60 * 24))
  }

  const filtered = useMemo(
    () =>
      subscriptions.filter((s) => {
        const matchesSearch =
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.familyMember?.toLowerCase().includes(search.toLowerCase()) ||
          s.category?.name.toLowerCase().includes(search.toLowerCase())

        const matchesStatus =
          statusFilter === 'all' ? true : s.status === statusFilter

        return matchesSearch && matchesStatus
      }),
    [subscriptions, search, statusFilter],
  )

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name, color: c.color })),
    [categories],
  )

  const openEdit = (sub: SubscriptionWithCategory) => {
    setEditing(sub)
    editForm.reset({
      name: sub.name,
      amount: sub.amount,
      currency: sub.currency,
      billingCycle: sub.billingCycle as any,
      customDays: sub.customDays ?? undefined,
      nextBillingDate: sub.nextBillingDate,
      status: sub.status as any,
      categoryId: sub.categoryId ?? undefined,
      familyMember: sub.familyMember ?? undefined,
      logo: sub.logo ?? undefined,
      notes: sub.notes ?? undefined,
    })
  }

  const handleEdit = async (values: z.infer<typeof updateSubscriptionSchema>) => {
    if (!editing) return
    try {
      setIsSubmitting(true)
      const payload = {
        ...values,
        amount: values.amount ?? editing.amount,
      }
      const res = await fetch(`/api/subscriptions/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to update subscription')
        return
      }
      toast.success('Subscription updated')
      setEditing(null)
      void loadSubscriptions()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (sub: SubscriptionWithCategory) => {
    if (!confirm(`Delete subscription "${sub.name}"?`)) return
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to delete subscription')
        return
      }
      toast.success('Subscription deleted')
      void loadSubscriptions()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Subscriptions
            </h1>
            <p className="text-slate-500 mt-2">
              Centralize every recurring charge in one audit-ready dashboard.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by name, member, category..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4" />
                  Add Subscription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Subscription</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Netflix Premium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="1100"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <Input placeholder="KES" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingCycle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Cycle</FormLabel>
                            <FormControl>
                              <select
                                className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                value={field.value}
                                onChange={field.onChange}
                              >
                                <option value="monthly">Monthly</option>
                                <option value="annual">Annual</option>
                                <option value="custom">Custom</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nextBillingDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Next Billing Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                  type="date"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                  className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm pl-9 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                  value={field.value || ''}
                                  onChange={(e) =>
                                    field.onChange(e.target.value || undefined)
                                  }
                                >
                                  <option value="">No category</option>
                                  {categoryOptions.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="familyMember"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Family Member</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                  placeholder="Who uses this?"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                placeholder="https://logo.clearbit.com/netflix.com"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Payment method, M-Pesa reference, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full gap-2 bg-slate-900 hover:bg-emerald-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      Save Subscription
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Card className="p-4 md:p-6 shadow-2xl shadow-slate-200/60 border-slate-100 bg-white space-y-4">
          <Tabs
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as typeof statusFilter)
            }
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value={statusFilter} />
          </Tabs>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">
                Loading your subscriptions...
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-slate-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                No subscriptions yet
              </h2>
              <p className="text-slate-500 text-sm max-w-sm">
                Start by logging your first recurring charge. We&apos;ll keep
                every renewal on your radar.
              </p>
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Family</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub) => {
                  const d = daysUntil(sub.nextBillingDate as unknown as Date)
                  const label =
                    d === null
                      ? null
                      : d < 0
                        ? `${Math.abs(d)} days overdue`
                        : d === 0
                          ? 'Due today'
                          : `In ${d} days`
                  const labelVariant =
                    d === null
                      ? 'outline'
                      : d < 0
                        ? 'destructive'
                        : d <= 3
                          ? 'secondary'
                          : 'outline'
                  return (
                  <TableRow key={sub.id}>
                    <TableCell className="flex items-center gap-3">
                      {sub.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sub.logo}
                          alt={sub.name}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                          {sub.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm text-slate-900">
                          {sub.name}
                        </p>
                        {sub.notes && (
                          <p className="text-xs text-slate-400">{sub.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sub.category ? (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: sub.category.color }}
                        >
                          {sub.category.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {sub.familyMember || (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-slate-900">
                      {formatCurrency(sub.amount, sub.currency)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      <div className="flex flex-col gap-1">
                        <span>{formatDate(sub.nextBillingDate as unknown as Date)}</span>
                        {label && (
                          <Badge
                            variant={labelVariant as any}
                            className="w-fit text-[10px]"
                          >
                            {label}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant(sub.status)}
                        className="text-xs capitalize"
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(sub)}>
                            <Pencil className="w-3 h-3" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(sub)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Edit dialog */}
        {editing && (
          <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Subscription</DialogTitle>
              </DialogHeader>
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(handleEdit)}
                  className="space-y-4"
                >
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === '' ? undefined : e.target.valueAsNumber,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="billingCycle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Cycle</FormLabel>
                          <FormControl>
                            <select
                              className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="monthly">Monthly</option>
                              <option value="annual">Annual</option>
                              <option value="custom">Custom</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="nextBillingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next Billing Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                type="date"
                                className="pl-9"
                                value={
                                  typeof field.value === 'string'
                                    ? field.value.slice(0, 10)
                                    : ''
                                }
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(e.target.value || undefined)
                              }
                            >
                              <option value="">No category</option>
                              {categoryOptions.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <select
                              className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="active">Active</option>
                              <option value="overdue">Overdue</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={editForm.control}
                    name="familyMember"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Family Member</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full gap-2 bg-slate-900 hover:bg-emerald-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

