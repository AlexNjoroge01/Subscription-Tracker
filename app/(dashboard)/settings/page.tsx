'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface NotificationPreferences {
    emailNotificationsEnabled: boolean;
    notifySevenDays: boolean;
    notifyThreeDays: boolean;
    notifyOneDay: boolean;
    notifyOverdue: boolean;
    notifyBudgetWarning: boolean;
    dailyDigestEnabled: boolean;
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
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const response = await fetch('/api/settings/preferences');
            if (!response.ok) {
                throw new Error('Failed to fetch preferences');
            }
            const data = await response.json();
            setPreferences(data);
        } catch (error) {
            toast.error('Failed to load preferences');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/settings/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error('Failed to save preferences');
            }

            const data = await response.json();
            setPreferences(data);
            toast.success('Preferences saved successfully');
        } catch (error) {
            toast.error('Failed to save preferences');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = (key: keyof NotificationPreferences) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">
                    Manage your notification preferences and account settings
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Email Notifications
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Control when and how you receive email notifications about your subscriptions
                    </p>

                    <div className="space-y-4">
                        {/* Master toggle */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex-1">
                                <Label
                                    htmlFor="emailNotificationsEnabled"
                                    className="text-base font-medium text-gray-900 cursor-pointer"
                                >
                                    Enable Email Notifications
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">
                                    Master switch for all email notifications
                                </p>
                            </div>
                            <button
                                id="emailNotificationsEnabled"
                                type="button"
                                role="switch"
                                aria-checked={preferences.emailNotificationsEnabled}
                                onClick={() => handleToggle('emailNotificationsEnabled')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences.emailNotificationsEnabled
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailNotificationsEnabled
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Renewal reminders */}
                        <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                            <h3 className="font-medium text-gray-900">Renewal Reminders</h3>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Label
                                        htmlFor="notifySevenDays"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        7 days before renewal
                                    </Label>
                                </div>
                                <button
                                    id="notifySevenDays"
                                    type="button"
                                    role="switch"
                                    aria-checked={preferences.notifySevenDays}
                                    onClick={() => handleToggle('notifySevenDays')}
                                    disabled={!preferences.emailNotificationsEnabled}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences.notifySevenDays && preferences.emailNotificationsEnabled
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                        } ${!preferences.emailNotificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifySevenDays
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Label
                                        htmlFor="notifyThreeDays"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        3 days before renewal
                                    </Label>
                                </div>
                                <button
                                    id="notifyThreeDays"
                                    type="button"
                                    role="switch"
                                    aria-checked={preferences.notifyThreeDays}
                                    onClick={() => handleToggle('notifyThreeDays')}
                                    disabled={!preferences.emailNotificationsEnabled}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences.notifyThreeDays && preferences.emailNotificationsEnabled
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                        } ${!preferences.emailNotificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyThreeDays
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Label
                                        htmlFor="notifyOneDay"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        1 day before renewal
                                    </Label>
                                </div>
                                <button
                                    id="notifyOneDay"
                                    type="button"
                                    role="switch"
                                    aria-checked={preferences.notifyOneDay}
                                    onClick={() => handleToggle('notifyOneDay')}
                                    disabled={!preferences.emailNotificationsEnabled}
                                    className={`relative inline-flex h-6 w-11 items-items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences.notifyOneDay && preferences.emailNotificationsEnabled
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                        } ${!preferences.emailNotificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyOneDay
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Other notifications */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Label
                                        htmlFor="notifyOverdue"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        Overdue subscriptions
                                    </Label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Get notified when a subscription becomes overdue
                                    </p>
                                </div>
                                <button
                                    id="notifyOverdue"
                                    type="button"
                                    role="switch"
                                    aria-checked={preferences.notifyOverdue}
                                    onClick={() => handleToggle('notifyOverdue')}
                                    disabled={!preferences.emailNotificationsEnabled}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences.notifyOverdue && preferences.emailNotificationsEnabled
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                        } ${!preferences.emailNotificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyOverdue
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Label
                                        htmlFor="notifyBudgetWarning"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        Budget warnings
                                    </Label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Get notified when spending reaches 80% of category budget
                                    </p>
                                </div>
                                <button
                                    id="notifyBudgetWarning"
                                    type="button"
                                    role="switch"
                                    aria-checked={preferences.notifyBudgetWarning}
                                    onClick={() => handleToggle('notifyBudgetWarning')}
                                    disabled={!preferences.emailNotificationsEnabled}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences.notifyBudgetWarning && preferences.emailNotificationsEnabled
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                        } ${!preferences.emailNotificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyBudgetWarning
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Label
                                        htmlFor="dailyDigestEnabled"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        Daily digest email
                                    </Label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Receive a daily summary of your subscriptions
                                    </p>
                                </div>
                                <button
                                    id="dailyDigestEnabled"
                                    type="button"
                                    role="switch"
                                    aria-checked={preferences.dailyDigestEnabled}
                                    onClick={() => handleToggle('dailyDigestEnabled')}
                                    disabled={!preferences.emailNotificationsEnabled}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences.dailyDigestEnabled && preferences.emailNotificationsEnabled
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                        } ${!preferences.emailNotificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.dailyDigestEnabled
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full sm:w-auto"
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
