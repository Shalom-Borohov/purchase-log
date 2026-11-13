import { dayMonth, dayYear, todayDate } from '../../domain/dayDate'
import type { Period } from '../../domain/summary'

export type PeriodUnit = Period['unit']

export const PERIOD_UNITS = ['month', 'year'] as const satisfies readonly PeriodUnit[]

export type PeriodChoice = { unit: PeriodUnit; month: string }

const MONTHS_PER_STEP: Record<PeriodUnit, number> = { month: 1, year: 12 }

const MONTH_OFFSET = 1

const FIRST_DAY = 1

const MONTH_PARAM_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

const YEAR_PARAM_PATTERN = /^\d{4}$/

const MONTH_PART_SEPARATOR = '-'

function shiftMonth(month: string, months: number) {
  const [year, monthNumber] = month.split(MONTH_PART_SEPARATOR).map(Number)

  return dayMonth(todayDate(new Date(year, monthNumber - MONTH_OFFSET + months, FIRST_DAY)))
}

export const currentChoice = (currentMonth: string): PeriodChoice => ({ unit: 'month', month: currentMonth })

export const periodOf = ({ unit, month }: PeriodChoice): Period =>
  unit === 'month' ? { unit, month } : { unit, year: dayYear(month) }

export const periodParam = (period: Period) => (period.unit === 'month' ? period.month : String(period.year))

export function parsePeriodParam(param: string | null): Period | undefined {
  if (param && MONTH_PARAM_PATTERN.test(param)) {
    return { unit: 'month', month: param }
  }

  return param && YEAR_PARAM_PATTERN.test(param) ? { unit: 'year', year: Number(param) } : undefined
}

export const previousChoice = (choice: PeriodChoice): PeriodChoice => ({
  ...choice,
  month: shiftMonth(choice.month, -MONTHS_PER_STEP[choice.unit]),
})

export function nextChoice(choice: PeriodChoice, currentMonth: string): PeriodChoice {
  const shifted = shiftMonth(choice.month, MONTHS_PER_STEP[choice.unit])

  return { ...choice, month: shifted < currentMonth ? shifted : currentMonth }
}

export const isLatestPeriod = (choice: PeriodChoice, currentMonth: string) =>
  periodParam(periodOf(choice)) === periodParam(periodOf({ unit: choice.unit, month: currentMonth }))
