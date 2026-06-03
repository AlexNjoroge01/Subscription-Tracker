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
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Download,
  List,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { LogoPicker, getLogoUrl } from '@/components/logo-picker'
import { getCurrencyOptions, DEFAULT_CURRENCY } from '@/lib/currencies'

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
import type { Subscription, Category } from '@/lib/db/schema'
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

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editing, setEditing] = useState<SubscriptionWithCategory | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'overdue' | 'cancelled' | 'scheduled'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [calendarDate, setCalendarDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      currency: DEFAULT_CURRENCY,
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

  const currencyOptions = useMemo(() => getCurrencyOptions(), [])

 const editForm = useForm({
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

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Name', 'Amount', 'Currency', 'Billing Cycle', 'Next Billing Date', 'Status', 'Category', 'Family Member', 'Notes']
    const rows = filtered.map((s) => [
      s.name,
      s.amount,
      s.currency,
      s.billingCycle,
      formatDate(s.nextBillingDate as unknown as Date),
      s.status ?? '',
      s.category?.name ?? '',
      s.familyMember ?? '',
      s.notes ?? '',
    ])
    const escape = (val: string | number) => {
      const str = String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escape).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'subscriptions.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  // Calendar helpers
  const calendarYear = calendarDate.getFullYear()
  const calendarMonth = calendarDate.getMonth()

  const prevMonth = () => setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1))
  const nextMonth = () => setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1))

  const calendarCells = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay()
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [calendarYear, calendarMonth])

  const subscriptionsByDay = useMemo(() => {
    const map: Record<number, SubscriptionWithCategory[]> = {}
    for (const sub of filtered) {
      const date = new Date(sub.nextBillingDate as unknown as string)
      if (isNaN(date.getTime())) continue
      if (date.getFullYear() === calendarYear && date.getMonth() === calendarMonth) {
        const day = date.getDate()
        if (!map[day]) map[day] = []
        map[day].push(sub)
      }
    }
    return map
  }, [filtered, calendarYear, calendarMonth])

  const statusDotColor = (status: string | null | undefined) => {
    switch (status) {
      case 'active': return 'bg-[#a3e635]'
      case 'overdue': return 'bg-red-400/100'
      case 'scheduled': return 'bg-amber-400'
      case 'cancelled': return 'bg-slate-400'
      default: return 'bg-slate-300'
    }
  }

  const todayDay = new Date().getDate()
  const todayMonth = new Date().getMonth()
  const todayYear = new Date().getFullYear()
  const isToday = (day: number) =>
    day === todayDay && calendarMonth === todayMonth && calendarYear === todayYear

  return (
    <div className="min-h-screen bg-[#070e08] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Subscriptions
            </h1>
            <p className="text-white/45 mt-2">
              Centralize every recurring charge in one audit-ready dashboard.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by name, member, category..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={exportToCSV}
              disabled={filtered.length === 0}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#a3e635] hover:bg-[#b5f542]">
                  <Plus className="w-4 h-4" />
                  Add Subscription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Add Subscription</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto -mx-6 px-6">
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
                              <select
                                className="block w-full rounded-md border border-white/[0.08] bg-[#0d1b0f] px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                value={field.value}
                                onChange={field.onChange}
                              >
                                {currencyOptions.map((c) => (
                                  <option key={c.value} value={c.value}>
                                    {c.label}
                                  </option>
                                ))}
                              </select>
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
                                className="block w-full rounded-md border border-white/[0.08] bg-[#0d1b0f] px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                                <CalendarDays className="w-4 h-4 text-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
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
                                <Tag className="w-4 h-4 text-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                  className="block w-full rounded-md border border-white/[0.08] bg-[#0d1b0f] px-3 py-2 text-sm pl-9 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                                <User className="w-4 h-4 text-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
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
                          <FormLabel>Service Logo</FormLabel>
                          <FormControl>
                            <LogoPicker
                              value={field.value || ''}
                              onChange={field.onChange}
                              serviceName={form.watch('name')}
                            />
                          </FormControl>
                          <p className="text-xs text-white/45 mt-1">
                            Select from popular services or use a custom logo URL
                          </p>
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
                      className="w-full gap-2 bg-[#0d1b0f] hover:bg-[#b5f542]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      Save Subscription
                    </Button>
                  </form>
                </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Card className="p-4 md:p-6 shadow-2xl shadow-black/30 border-white/[0.06] bg-[#0d1b0f] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            <div className="flex items-center gap-1 border border-white/[0.08] rounded-lg p-1 self-start sm:self-auto">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className={`gap-1.5 h-7 px-2 ${viewMode === 'list' ? 'bg-[#0d1b0f] text-white hover:bg-[#0d1b0f]/[0.05]' : 'text-white/45 hover:text-white'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-xs">List</span>
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                className={`gap-1.5 h-7 px-2 ${viewMode === 'calendar' ? 'bg-[#0d1b0f] text-white hover:bg-[#0d1b0f]/[0.05]' : 'text-white/45 hover:text-white'}`}
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs">Calendar</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-3 text-white/45">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">
                Loading your subscriptions...
              </span>
            </div>
          ) : viewMode === 'list' ? (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-white/35" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  No subscriptions yet
                </h2>
                <p className="text-white/45 text-sm max-w-sm">
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
                            src={getLogoUrl(sub.logo) || sub.logo}
                            alt={sub.name}
                            className="w-8 h-8 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-[#0d1b0f] text-white flex items-center justify-center text-xs font-bold">
                            {sub.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm text-white">
                            {sub.name}
                          </p>
                          {sub.notes && (
                            <p className="text-xs text-white/35">{sub.notes}</p>
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
                          <span className="text-xs text-white/35">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-white/80">
                        {sub.familyMember || (
                          <span className="text-white/35 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-white">
                        {formatCurrency(sub.amount, sub.currency)}
                      </TableCell>
                      <TableCell className="text-sm text-white/80">
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
                              className="text-white/45 hover:text-white"
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
            )
          ) : (
            /* Calendar View */
            <div className="space-y-4">
              {/* Calendar header: month navigation */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={prevMonth} className="gap-1 text-white/65">
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <h2 className="text-base font-semibold text-white">
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </h2>
                <Button variant="ghost" size="sm" onClick={nextMonth} className="gap-1 text-white/65">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 flex-wrap text-xs text-white/45">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a3e635] inline-block" />Active</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400/100 inline-block" />Overdue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Scheduled</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />Cancelled</span>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 gap-px">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-white/35 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid: 6 rows x 7 cols */}
              <div className="grid grid-cols-7 gap-px bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden">
                {calendarCells.map((day, idx) => {
                  const subs = day !== null ? (subscriptionsByDay[day] ?? []) : []
                  const today = day !== null && isToday(day)
                  return (
                    <div
                      key={idx}
                      className={`bg-[#0d1b0f] min-h-[72px] p-1.5 flex flex-col ${day === null ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                      {day !== null && (
                        <>
                          <span
                            className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                              today
                                ? 'bg-[#a3e635] text-white'
                                : 'text-white/65'
                            }`}
                          >
                            {day}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            {subs.slice(0, 3).map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-1 group"
                                title={`${sub.name} — ${formatCurrency(sub.amount, sub.currency)}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotColor(sub.status)}`}
                                />
                                <span className="text-[10px] text-white/65 truncate leading-tight">
                                  {sub.name}
                                </span>
                              </div>
                            ))}
                            {subs.length > 3 && (
                              <span className="text-[10px] text-white/35">
                                +{subs.length - 3} more
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Edit dialog */}
        {editing && (
          <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
            <DialogContent className="max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit Subscription</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto -mx-6 px-6">
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
                            <select
                              className="block w-full rounded-md border border-white/[0.08] bg-[#0d1b0f] px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {currencyOptions.map((c) => (
                                <option key={c.value} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
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
                              className="block w-full rounded-md border border-white/[0.08] bg-[#0d1b0f] px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                              <CalendarDays className="w-4 h-4 text-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
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
                              className="block w-full rounded-md border border-white/[0.08] bg-[#0d1b0f] px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                              className="block w-full rounded-md border border-white/[0.08] bg-[#0d1b0f] px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                        <FormLabel>Service Logo</FormLabel>
                        <FormControl>
                          <LogoPicker
                            value={field.value || ''}
                            onChange={field.onChange}
                            serviceName={editForm.watch('name')}
                          />
                        </FormControl>
                        <p className="text-xs text-white/45 mt-1">
                          Select from popular services or use a custom logo URL
                        </p>
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
                    className="w-full gap-2 bg-[#0d1b0f] hover:bg-[#b5f542]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </Form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
