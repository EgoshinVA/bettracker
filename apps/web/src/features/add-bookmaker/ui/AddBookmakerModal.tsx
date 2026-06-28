'use client'

import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useCreateBookmakerMutation } from '@/entities/bookmaker/api/bookmakers.api'

interface AddBookmakerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AddBookmakerFormData {
  name: string
  shortName: string
  color: string
}

const PRESET_COLORS = [
  '#7c3aed',
  '#2563eb',
  '#059669',
  '#dc2626',
  '#d97706',
  '#0891b2',
  '#db2777',
  '#64748b',
]

export function AddBookmakerModal({ isOpen, onClose }: AddBookmakerModalProps) {
  const { t } = useTranslation()
  const [createBookmaker, { isLoading }] = useCreateBookmakerMutation()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddBookmakerFormData>({
    defaultValues: { name: '', shortName: '', color: '#7c3aed' },
  })

  const selectedColor = watch('color')
  const shortNameValue = watch('shortName')
  const previewLetter = shortNameValue.trim().charAt(0).toUpperCase() || '?'

  const onSubmit = async (data: AddBookmakerFormData) => {
    try {
      await createBookmaker({
        name: data.name.trim(),
        shortName: data.shortName.trim(),
        color: data.color,
      }).unwrap()
      toast.success(t('addBookmaker.added'))
      reset()
      onClose()
    } catch {
      toast.error(t('addBookmaker.addFailed'))
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-900">{t('addBookmaker.title')}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('addBookmaker.name')}
            </label>
            <input
              {...register('name', {
                required: t('addBookmaker.nameRequired'),
                maxLength: { value: 100, message: t('addBookmaker.nameMaxChars') },
              })}
              placeholder={t('addBookmaker.namePlaceholder')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Short Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('addBookmaker.shortName')}
            </label>
            <input
              {...register('shortName', {
                required: t('addBookmaker.shortNameRequired'),
                maxLength: { value: 10, message: t('addBookmaker.shortNameMaxChars') },
              })}
              placeholder={t('addBookmaker.shortNamePlaceholder')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <p className="mt-1 text-xs text-slate-400">{t('addBookmaker.shortNameHint')}</p>
            {errors.shortName && (
              <p className="mt-1 text-xs text-red-500">{errors.shortName.message}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t('addBookmaker.color')}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c)}
                  className={`h-7 w-7 rounded-full transition-all ${
                    selectedColor === c
                      ? 'scale-110 ring-2 ring-slate-400 ring-offset-2'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <label className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-xs text-slate-400 transition-colors hover:border-violet-400 hover:text-violet-500">
                +
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setValue('color', e.target.value)}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Preview */}
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: selectedColor }}
              >
                {previewLetter}
              </div>
              <p className="text-sm text-slate-500">{t('addBookmaker.colorPreview')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              {t('addBet.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
            >
              {isLoading ? t('addBookmaker.saving') : t('addBookmaker.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
