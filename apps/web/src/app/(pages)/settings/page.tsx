'use client'

import { useTranslation } from 'react-i18next'
import { User, SlidersHorizontal, Download, AlertCircle, Check } from 'lucide-react'
import { UpdateProfileForm } from '@/features/update-profile'
import { AppPreferencesForm } from '@/features/update-preferences'

const billingHistory = [
  { date: 'Oct 12, 2023', desc: 'Pro Subscription - Monthly', amount: '$19.00', status: 'Paid' },
  { date: 'Sep 12, 2023', desc: 'Pro Subscription - Monthly', amount: '$19.00', status: 'Paid' },
  { date: 'Aug 12, 2023', desc: 'Pro Subscription - Monthly', amount: '$19.00', status: 'Paid' },
]

export default function SettingsPage() {
  const { t } = useTranslation()

  const proFeatures = [
    t('settings.featureUnlimited'),
    t('settings.featureArbitrage'),
    t('settings.featureApi'),
    t('settings.featureCustom'),
  ]

  const billingHeaders = [
    t('settings.date'),
    t('settings.description'),
    t('settings.amount'),
    t('settings.invoiceStatus'),
    t('settings.invoice'),
  ]

  return (
    <>
      <div className="grid h-full grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 min-h-0 overflow-y-auto">
          <div className="space-y-5 pb-1">
            {/* Profile */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                  <User className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">{t('settings.profileSettings')}</h2>
              </div>
              <UpdateProfileForm />
            </div>

            {/* App Preferences */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                  <SlidersHorizontal className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">{t('settings.appPreferences')}</h2>
              </div>
              <AppPreferencesForm />
            </div>

            {/* Billing History */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-50 px-6 py-4">
                <h2 className="text-base font-semibold text-slate-900">{t('settings.billingHistory')}</h2>
                <button className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700">
                  <Download className="h-3.5 w-3.5" /> {t('settings.exportAll')}
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50">
                    {billingHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {billingHistory.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3.5 text-slate-500">{row.date}</td>
                      <td className="px-6 py-3.5 text-slate-700">{row.desc}</td>
                      <td className="px-6 py-3.5 font-medium text-slate-900">{row.amount}</td>
                      <td className="px-6 py-3.5">
                        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <button className="text-slate-400 transition-colors hover:text-violet-600">
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="min-h-0 overflow-y-auto">
          <div className="space-y-4 pb-1">
            {/* Plan card */}
            <div className="rounded-xl bg-slate-900 p-6 text-white">
              <div className="mb-3 flex items-start justify-between">
                <span className="rounded-full bg-violet-500 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  {t('settings.activePlan')}
                </span>
                <div className="text-right">
                  <span className="text-3xl font-bold">$19</span>
                  <span className="text-sm text-slate-400"> {t('settings.perMonth')}</span>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold">{t('settings.proPlan')}</h3>
              <ul className="mb-6 space-y-2">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 flex-shrink-0 text-violet-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-lg border border-slate-600 bg-white/10 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                {t('settings.manageSubscription')}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">
                {t('settings.nextBilling', { date: 'Nov 12, 2023' })}
              </p>
            </div>

            {/* Account Status */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">{t('settings.accountStatus')}</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-widest text-slate-400">{t('settings.apiQuota')}</span>
                    <span className="font-semibold text-slate-700">7.2k / 10k</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[72%] rounded-full bg-violet-600" />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-widest text-slate-400">{t('settings.strategySlots')}</span>
                    <span className="font-semibold text-slate-700">4 / 5</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[80%] rounded-full bg-violet-600" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                <p className="text-xs font-medium text-red-600">{t('settings.twoFADisabled')}</p>
              </div>
              <button className="mt-3 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                {t('settings.securitySettings')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
