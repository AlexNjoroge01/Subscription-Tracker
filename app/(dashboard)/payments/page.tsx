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
        <Badge className="gap-1.5 bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/20 hover:bg-[#b5f542]/10">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="gap-1.5 bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400/10">
          <XCircle className="w-3 h-3" />
          Failed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-400/30 hover:bg-amber-500/10">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      )
    default:
      return (
        <Badge className="gap-1.5 bg-white/[0.04] text-white/65 border border-white/[0.08] hover:bg-white/[0.04]">
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
    <div className="flex-1 bg-[#070e08] text-white selection:bg-[#a3e635]/15">
      <main className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-[#0d1b0f] text-[#a3e635] text-[10px] font-bold uppercase tracking-widest">
            <CreditCard className="w-3 h-3" />
            Payment History
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white leading-none">
            Your billing records.
          </h1>
          <p className="text-white/45 font-light text-sm">
            A complete log of every charge processed against your account.
          </p>
        </section>

        {/* Table card */}
        <Card className="bg-[#0d1b0f] border-white/[0.06] shadow-sm rounded-2xl overflow-hidden">
          {isLoading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/35">
              <Loader2 className="w-6 h-6 animate-spin text-[#a3e635]" />
              <p className="text-sm font-medium text-white/45">
                Fetching payment history…
              </p>
            </div>
          ) : payments.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 px-6">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <ReceiptText className="w-7 h-7 text-white/35" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">
                  No payments on record
                </h2>
                <p className="text-sm text-white/45 max-w-sm">
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
                  <TableRow className="bg-[#0a1409] border-b border-white/[0.06]">
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white/35 py-3 pl-6">
                      Date
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white/35 py-3">
                      Plan
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white/35 py-3">
                      Amount
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white/35 py-3">
                      Currency
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white/35 py-3">
                      Status
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white/35 py-3 pr-6">
                      Reference
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="border-b border-white/[0.05] hover:bg-[#0d1b0f]/[0.03] transition-colors"
                    >
                      {/* Date */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-white">
                            {formatDate(payment.paidAt ?? payment.createdAt)}
                          </span>
                          {payment.paidAt && (
                            <span className="text-[11px] text-white/35">
                              Initiated {formatDate(payment.createdAt)}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Plan */}
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-white">
                            {payment.planName ?? 'Unknown Plan'}
                          </span>
                          {payment.planInterval && (
                            <span className="text-[11px] text-white/35 capitalize">
                              {payment.planInterval}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="py-4">
                        <span className="text-sm font-bold text-white tabular-nums">
                          {formatCurrency(payment.amount, payment.currency)}
                        </span>
                      </TableCell>

                      {/* Currency */}
                      <TableCell className="py-4">
                        <span className="text-sm text-white/65 font-mono uppercase">
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
                          <code className="text-[11px] font-mono text-white/45 bg-white/[0.04] px-2 py-0.5 rounded-md break-all">
                            {payment.providerRef}
                          </code>
                        ) : (
                          <span className="text-xs text-white/35">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Footer count */}
              <div className="px-6 py-3 border-t border-white/[0.06] bg-[#0a1409]">
                <p className="text-[11px] text-white/35">
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
