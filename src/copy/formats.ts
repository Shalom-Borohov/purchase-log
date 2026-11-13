import { dayDateToLocal } from '../domain/dayDate'

const SHORT_DATE = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric', year: '2-digit' })

const DAY_AND_MONTH = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric' })

const MONTH_NAME = new Intl.DateTimeFormat('he-IL', { month: 'long' })

const MONTH_AND_YEAR = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' })

const FIRST_DAY = '-01'

const SINGLE = 1

const TWO = 2

export const shortDate = (dayDate: string) => SHORT_DATE.format(dayDateToLocal(dayDate))

export const dayAndMonth = (dayDate: string) => DAY_AND_MONTH.format(dayDateToLocal(dayDate))

export const monthName = (month: string) => MONTH_NAME.format(dayDateToLocal(`${month}${FIRST_DAY}`))

export const monthAndYear = (month: string) => MONTH_AND_YEAR.format(dayDateToLocal(`${month}${FIRST_DAY}`))

export function daysCount(days: number) {
  if (days === SINGLE) {
    return 'יום אחד'
  }

  return days === TWO ? 'יומיים' : `${days} ימים`
}
