const DAY_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const MONTH_OFFSET = 1

const DAY_MONTH_LENGTH = 'YYYY-MM'.length

const DAY_YEAR_LENGTH = 'YYYY'.length

const DATE_PART_SEPARATOR = '-'

const pad = (part: number) => String(part).padStart(2, '0')

export const todayDate = (now: Date) =>
  `${now.getFullYear()}-${pad(now.getMonth() + MONTH_OFFSET)}-${pad(now.getDate())}`

export const isAfterToday = (dayDate: string, today: string) => dayDate > today

export const compareDayDates = (first: string, second: string) => Number(first > second) - Number(first < second)

export const dayMonth = (dayDate: string) => dayDate.slice(0, DAY_MONTH_LENGTH)

export const dayYear = (dayDate: string) => Number(dayDate.slice(0, DAY_YEAR_LENGTH))

export function dayDateToLocal(dayDate: string) {
  const [year, month, day] = dayDate.split(DATE_PART_SEPARATOR).map(Number)

  return new Date(year, month - MONTH_OFFSET, day)
}

const MILLISECONDS_IN_DAY = 86_400_000

const utcMidnight = (dayDate: string) => {
  const [year, month, day] = dayDate.split(DATE_PART_SEPARATOR).map(Number)

  return Date.UTC(year, month - MONTH_OFFSET, day)
}

const utcDayDate = (time: number) => {
  const date = new Date(time)

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + MONTH_OFFSET)}-${pad(date.getUTCDate())}`
}

export const addDays = (dayDate: string, days: number) => utcDayDate(utcMidnight(dayDate) + days * MILLISECONDS_IN_DAY)

export const daysBetween = (from: string, to: string) =>
  Math.round((utcMidnight(to) - utcMidnight(from)) / MILLISECONDS_IN_DAY)

export function addYears(dayDate: string, years: number) {
  const [year, month, day] = dayDate.split(DATE_PART_SEPARATOR).map(Number)
  const lastDayOfMonth = new Date(Date.UTC(year + years, month, 0)).getUTCDate()

  return `${year + years}-${pad(month)}-${pad(Math.min(day, lastDayOfMonth))}`
}

export function isDayDate(text: string) {
  const match = DAY_DATE_PATTERN.exec(text)

  if (!match) {
    return false
  }

  const [, year, month, day] = match.map(Number)
  const date = new Date(year, month - MONTH_OFFSET, day)

  return date.getFullYear() === year && date.getMonth() === month - MONTH_OFFSET && date.getDate() === day
}
