'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  CreditCard,
  Loader2,
  ReceiptText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type PaymentRecord = {
  id: string
  amount: number
  currency: string
  status: string
  provider: string
  providerRef: string | null
  paidAt: string | null
  createdAt: string
  planId: string
  planName: string | null
  planInterval: string | null
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  return isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return (
        <Badge className="gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="gap-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-50">
          <XCircle className="w-3 h-3" />
          Failed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      )
    default:
      return (
        <Badge className="gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-100">
          <AlertCircle className="w-3 h-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/payments/history')
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json.error ?? 'Failed to load payment history')
        }
        setPayments(json.data ?? json)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load payment history')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <div className="flex-1 bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100">
      <main className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-slate-900 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
            <CreditCard className="w-3 h-3" />
            Payment History
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            Your billing records.
          </h1>
          <p className="text-slate-500 font-light text-sm">
            A complete log of every charge processed against your account.
          </p>
        </section>

        {/* Table card */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          {isLoading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              <p className="text-sm font-medium text-slate-500">
                Fetching payment history…
              </p>
            </div>
          ) : payments.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <ReceiptText className="w-7 h-7 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-slate-900">
                  No payments on record
                </h2>
                <p className="text-sm text-slate-500 max-w-sm">
                  Once you complete a subscription payment, each transaction will
                  appear here with its full details.
                </p>
              </div>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-100">
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 pl-6">
                      Date
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3">
                      Plan
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3">
                      Amount
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3">
                      Currency
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3">
                      Status
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 pr-6">
                      Reference
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Date */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-slate-900">
                            {formatDate(payment.paidAt ?? payment.createdAt)}
                          </span>
                          {payment.paidAt && (
                            <span className="text-[11px] text-slate-400">
                              Initiated {formatDate(payment.createdAt)}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Plan */}
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-slate-900">
                            {payment.planName ?? 'Unknown Plan'}
                          </span>
                          {payment.planInterval && (
                            <span className="text-[11px] text-slate-400 capitalize">
                              {payment.planInterval}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="py-4">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {formatCurrency(payment.amount, payment.currency)}
                        </span>
                      </TableCell>

                      {/* Currency */}
                      <TableCell className="py-4">
                        <span className="text-sm text-slate-600 font-mono uppercase">
                          {payment.currency}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        <StatusBadge status={payment.status} />
                      </TableCell>

                      {/* Reference */}
                      <TableCell className="py-4 pr-6">
                        {payment.providerRef ? (
                          <code className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md break-all">
                            {payment.providerRef}
                          </code>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Footer count */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-[11px] text-slate-400">
                  {payments.length} {payments.length === 1 ? 'record' : 'records'} total
                </p>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
