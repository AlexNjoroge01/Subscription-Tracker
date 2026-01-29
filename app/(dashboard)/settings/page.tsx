'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Zap, Bell } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {Switch} from '@/components/ui/switch'

interface NotificationPreferences {
  emailNotificationsEnabled: boolean
  notifySevenDays: boolean
  notifyThreeDays: boolean
  notifyOneDay: boolean
  notifyOverdue: boolean
  notifyBudgetWarning: boolean
  dailyDigestEnabled: boolean
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotificationsEnabled: true,
    notifySevenDays: true,
    notifyThreeDays: true,
    notifyOneDay: true,
    notifyOverdue: true,
    notifyBudgetWarning: true,
    dailyDigestEnabled: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/settings/preferences')
      if (!response.ok) {
        throw new Error('Failed to fetch preferences')
      }
      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      toast.error('Failed to load preferences')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      const data = await response.json()
      setPreferences(data)
      toast.success('Preferences saved successfully')
    } catch (error) {
      toast.error('Failed to save preferences')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (loading) {
    return (
      <div className="flex-1 bg-[#FAFAFA] min-h-screen flex items-center justify-center">
        <div className="text-emerald-600 animate-pulse font-black tracking-tight">
          Loading configuration...
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100 min-h-screen">
      {/* Top bar – matched to dashboard */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase tracking-wider">
            Settings Mode
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button className="relative rounded-full bg-slate-100 p-2 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="px-6 py-10 w-full space-y-10">
        {/* Greeting */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-emerald-700" />
            Alert Configuration
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
            Settings <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Center</span>.
          </h1>
          <p className="text-slate-500 font-light text-lg">
            Define how the system communicates risk & renewals.
          </p>
        </section>

        <Card className="bg-white border-slate-100 shadow-sm rounded-[32px] p-8 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Notification Rules
            </h2>
            <p className="text-sm text-slate-500 font-light mt-1.5">
              Control interruption frequency and urgency.
            </p>
          </div>

          <div className="space-y-8">
            {/* Master toggle */}
            <div className="flex items-center justify-between p-6 bg-emerald-50/40 rounded-2xl border border-emerald-100">
              <div className="flex-1">
                <Label
                  htmlFor="emailNotificationsEnabled"
                  className="text-lg font-black text-slate-900 cursor-pointer tracking-tight"
                >
                  Enable Email Notifications
                </Label>
                <p className="text-sm text-slate-600 mt-1 font-light">
                  Master switch — disables all alerts when turned off
                </p>
              </div>
              <Switch
                id="emailNotificationsEnabled"
                checked={preferences.emailNotificationsEnabled}
                onCheckedChange={() => handleToggle('emailNotificationsEnabled')}
                className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300"
              />
            </div>

            {/* Sub-sections */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Renewal Reminders
                </h3>
                <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifySevenDays" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                      7 days before renewal
                    </Label>
                    <Switch
                      id="notifySevenDays"
                      checked={preferences.notifySevenDays}
                      onCheckedChange={() => handleToggle('notifySevenDays')}
                      disabled={!preferences.emailNotificationsEnabled}
                      className={`data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300 ${
                        !preferences.emailNotificationsEnabled ? 'opacity-50' : ''
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyThreeDays" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                      3 days before renewal
                    </Label>
                    <Switch
                      id="notifyThreeDays"
                      checked={preferences.notifyThreeDays}
                      onCheckedChange={() => handleToggle('notifyThreeDays')}
                      disabled={!preferences.emailNotificationsEnabled}
                      className={`data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300 ${
                        !preferences.emailNotificationsEnabled ? 'opacity-50' : ''
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyOneDay" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                      1 day before renewal
                    </Label>
                    <Switch
                      id="notifyOneDay"
                      checked={preferences.notifyOneDay}
                      onCheckedChange={() => handleToggle('notifyOneDay')}
                      disabled={!preferences.emailNotificationsEnabled}
                      className={`data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300 ${
                        !preferences.emailNotificationsEnabled ? 'opacity-50' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Critical Alerts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="notifyOverdue" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Overdue subscriptions
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Get notified when a subscription becomes overdue
                      </p>
                    </div>
                    <Switch
                      id="notifyOverdue"
                      checked={preferences.notifyOverdue}
                      onCheckedChange={() => handleToggle('notifyOverdue')}
                      disabled={!preferences.emailNotificationsEnabled}
                      className={`data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300 ${
                        !preferences.emailNotificationsEnabled ? 'opacity-50' : ''
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="notifyBudgetWarning" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Budget warnings
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Get notified when spending reaches 80% of category budget
                      </p>
                    </div>
                    <Switch
                      id="notifyBudgetWarning"
                      checked={preferences.notifyBudgetWarning}
                      onCheckedChange={() => handleToggle('notifyBudgetWarning')}
                      disabled={!preferences.emailNotificationsEnabled}
                      className={`data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300 ${
                        !preferences.emailNotificationsEnabled ? 'opacity-50' : ''
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="dailyDigestEnabled" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Daily digest email
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Receive a daily summary of your subscriptions
                      </p>
                    </div>
                    <Switch
                      id="dailyDigestEnabled"
                      checked={preferences.dailyDigestEnabled}
                      onCheckedChange={() => handleToggle('dailyDigestEnabled')}
                      disabled={!preferences.emailNotificationsEnabled}
                      className={`data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-300 ${
                        !preferences.emailNotificationsEnabled ? 'opacity-50' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-6 rounded-xl shadow-md shadow-emerald-900/10"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}