'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Plus,
  Loader2,
  Edit3,
  Trash2,
  Palette,
  AlertTriangle,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
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
import { IconPicker, getIconUrl } from '@/components/icon-picker'
import { DEFAULT_CURRENCY, getCurrencySymbol } from '@/lib/currencies'
import type { Category } from '@/lib/db/schema'
import { createCategorySchema, updateCategorySchema } from '@/schemas'

type CategoryWithCount = Category & {
  _count?: {
    subscriptions: number
  }
}

const createSchema = createCategorySchema
const editSchema = updateCategorySchema

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editing, setEditing] = useState<CategoryWithCount | null>(null)

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      color: '#3b82f6',
      icon: '',
      budgetLimit: undefined,
    },
  })

  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
  })

  const totalBudget = useMemo(
    () =>
      categories.reduce(
        (sum, c) => sum + (c.budgetLimit ?? 0),
        0,
      ),
    [categories],
  )

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/categories')
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to load categories')
      }
      setCategories(json.data ?? json)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadCategories()
  }, [])

  const handleCreate = async (values: z.infer<typeof createSchema>) => {
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to create category')
        return
      }
      toast.success('Category created')
      createForm.reset()
      void loadCategories()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEdit = (category: CategoryWithCount) => {
    setEditing(category)
    editForm.reset({
      name: category.name,
      color: category.color,
      icon: category.icon ?? '',
      budgetLimit: category.budgetLimit ?? undefined,
    })
  }

  const handleEdit = async (values: z.infer<typeof editSchema>) => {
    if (!editing) return

    try {
      setIsSubmitting(true)
      const res = await fetch(`/api/categories/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to update category')
        return
      }
      toast.success('Category updated')
      setEditing(null)
      void loadCategories()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (category: CategoryWithCount) => {
    if (!confirm(`Delete category "${category.name}"?`)) return

    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to delete category')
        return
      }
      toast.success('Category deleted')
      void loadCategories()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#070e08] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Categories
            </h1>
            <p className="text-white/45 mt-2">
              Group subscriptions into clean spending lanes with color-coded control.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#a3e635] hover:bg-[#b5f542]">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="space-y-4"
                >
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Entertainment" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input type="color" className="w-12 h-10 p-1" {...field} />
                            <Input
                              className="font-mono text-xs"
                              placeholder="#3b82f6"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (optional)</FormLabel>
                        <FormControl>
                          <IconPicker
                            value={field.value || ''}
                            onChange={field.onChange}
                            color={createForm.watch('color')}
                          />
                        </FormControl>
                        <p className="text-xs text-white/45 mt-1">
                          Select an icon that represents this category
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="budgetLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Budget (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 5000"
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
                  <Button
                    type="submit"
                    className="w-full gap-2 bg-[#0d1b0f] hover:bg-[#b5f542]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Category
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="p-4 md:p-6 shadow-2xl shadow-black/30 border-white/[0.06] bg-[#0d1b0f] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#a3e635]/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-[#a3e635]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
                  Overview
                </p>
                <p className="text-sm text-white/65">
                  {categories.length} categories ·{' '}
                  {totalBudget > 0
                    ? `${getCurrencySymbol(DEFAULT_CURRENCY)} ${totalBudget.toLocaleString()} monthly budget configured`
                    : 'No budgets set yet'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/35">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>
                Deleting a category with subscriptions is blocked until they are reassigned.
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-3 text-white/45">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading your categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <Palette className="w-6 h-6 text-white/35" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                No categories yet
              </h2>
              <p className="text-white/45 text-sm max-w-sm">
                Create your first category to start tracking how much you burn per lane:
                Entertainment, Tools, Cloud, and more.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {categories.map((category) => {
                const iconUrl = getIconUrl(category.icon)
                return (
                  <div
                    key={category.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#0d1b0f]/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}22` }}
                        >
                          {iconUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={iconUrl}
                              alt={category.name}
                              className="w-5 h-5"
                              style={{ filter: `invert(0) sepia(1) saturate(10000%) hue-rotate(0deg)` }}
                            />
                          ) : category.icon ? (
                            <span className="text-lg">{category.icon}</span>
                          ) : (
                            <span className="text-lg font-bold" style={{ color: category.color }}>
                              {category.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-white">
                              {category.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[10px] font-semibold"
                            >
                              {category._count?.subscriptions ?? 0} subs
                            </Badge>
                          </div>
                          {category.budgetLimit && (
                            <p className="text-xs text-white/45 mt-1">
                              Budget: {getCurrencySymbol(DEFAULT_CURRENCY)} {category.budgetLimit.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="border-white/[0.08]"
                          onClick={() => startEdit(category)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="border-white/[0.08] text-red-400 hover:text-red-400 hover:border-red-400/30"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Edit dialog */}
        {editing && (
          <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
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
                  <FormField
                    control={editForm.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input type="color" className="w-12 h-10 p-1" {...field} />
                            <Input
                              className="font-mono text-xs"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <IconPicker
                            value={field.value || ''}
                            onChange={field.onChange}
                            color={editForm.watch('color')}
                          />
                        </FormControl>
                        <p className="text-xs text-white/45 mt-1">
                          Select an icon that represents this category
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="budgetLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Budget</FormLabel>
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
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

