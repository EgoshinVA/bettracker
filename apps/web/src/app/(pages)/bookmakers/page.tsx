'use client'

import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Plus } from 'lucide-react'
import { useGetBookmakerStatsQuery } from '@/entities/bookmaker/api/bookmakers.api'

function RoiBadge({ roi }: { roi: number }) {
  const positive = roi >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? '+' : ''}{roi}%
    </span>
  )
}

export default function BookmakersPage() {
  const { t } = useTranslation()
  const { data: stats = [], isLoading } = useGetBookmakerStatsQuery()

  const totalVolume = stats.reduce((sum, s) => sum + s.volume, 0)
  const bestRoi = stats.length > 0 ? Math.max(...stats.map((s) => s.roi)) : 0

  const summaryCards = [
    { label: t('bookmakers.platforms'), value: isLoading ? '...' : String(stats.length), icon: BarChart2 },
    { label: t('bookmakers.totalVolume'), value: isLoading ? '...' : `$${totalVolume.toLocaleString()}`, icon: DollarSign },
    { label: t('bookmakers.bestRoi'), value: isLoading ? '...' : `+${bestRoi}%`, icon: TrendingUp },
  ]

  const tableHeaders = [
    t('bookmakers.bookmaker'),
    t('bookmakers.totalVolume'),
    t('bookmakers.portfolioShare'),
    t('bookmakers.roi'),
    t('bookmakers.status'),
  ]

  return (
    <>
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('bookmakers.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('bookmakers.subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          {t('bookmakers.addBookmaker')}
        </button>
      </div>

      {/* Summary row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <Icon className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bookmaker cards */}
      {isLoading ? (
        <div className="mb-8 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />
                  <div>
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="mt-1 h-3 w-12 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : stats.length === 0 ? (
        <div className="mb-8 rounded-xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-400">{t('bookmakers.noBookmakers')}</p>
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4">
          {stats.map(({ bookmaker, volume, roi, volumePct }) => (
            <div
              key={bookmaker.id}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-white"
                    style={{ backgroundColor: bookmaker.color }}
                  >
                    {bookmaker.shortName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{bookmaker.name}</p>
                    <p className="text-xs text-slate-400">{bookmaker.shortName}</p>
                  </div>
                </div>
                <RoiBadge roi={roi} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{t('bookmakers.volume')}</p>
                  <p className="mt-1 font-semibold text-slate-900">${volume.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{t('bookmakers.portfolioShare')}</p>
                  <p className="mt-1 font-semibold text-slate-900">{volumePct}%</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{t('bookmakers.shareOfVolume')}</span>
                  <span>{volumePct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${volumePct}%`, backgroundColor: bookmaker.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison table */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-50 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">{t('bookmakers.detailedComparison')}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-50">
              {tableHeaders.map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))
            ) : stats.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                  {t('bookmakers.noneToCompare')}
                </td>
              </tr>
            ) : (
              stats.map(({ bookmaker, volume, volumePct, roi }) => (
                <tr key={bookmaker.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                        style={{ backgroundColor: bookmaker.color }}
                      >
                        {bookmaker.shortName.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{bookmaker.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">${volume.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${volumePct}%`, backgroundColor: bookmaker.color }}
                        />
                      </div>
                      <span className="text-slate-500">{volumePct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoiBadge roi={roi} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${bookmaker.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {bookmaker.isActive ? t('bookmakers.active') : t('bookmakers.inactive')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
