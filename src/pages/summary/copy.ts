import { COMMON_COPY } from '../../copy/common'
import { monthAndYear } from '../../copy/formats'
import type { Period } from '../../domain/summary'
import type { PeriodUnit } from './periodChoice'

export const SUMMARY_COPY = {
  title: COMMON_COPY.summary,
  unitLabel: 'תקופה',
  units: { month: 'חודש', year: 'שנה' } satisfies Record<PeriodUnit, string>,
  previous: { month: 'חודש קודם', year: 'שנה קודמת' } satisfies Record<PeriodUnit, string>,
  next: { month: 'חודש הבא', year: 'שנה הבאה' } satisfies Record<PeriodUnit, string>,
  mostExpensive: 'הכי יקרים',
  byKind: 'לפי סוג',
  byShop: 'לפי חנות',
  emptyPeriod: 'לא נרשמו רכישות בתקופה הזו.',
  noItems: 'אין כאן פריטים.',
} as const

export const periodLabel = (period: Period) =>
  period.unit === 'month' ? monthAndYear(period.month) : String(period.year)
