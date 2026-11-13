import { describe, expect, it } from 'vitest'
import {
  addDays,
  addYears,
  daysBetween,
  dayYear,
  isAfterToday,
  isDayDate,
  todayDate,
} from '../../src/domain/dayDate'

describe('day date', () => {
  it('accepts a real calendar day', () => {
    expect(isDayDate('2026-11-10')).toBe(true)
  })

  it('rejects a year alone, a day that does not exist and other text', () => {
    expect(isDayDate('2026')).toBe(false)
    expect(isDayDate('2026-02-30')).toBe(false)
    expect(isDayDate('yesterday')).toBe(false)
  })

  it('gives today in local time', () => {
    expect(todayDate(new Date(2026, 10, 10, 23, 30))).toBe('2026-11-10')
  })

  it('gives the year of a day', () => {
    expect(dayYear('2026-11-10')).toBe(2026)
  })

  it('moves a day forward across months, years and a leap day', () => {
    expect(addDays('2026-11-09', 14)).toBe('2026-11-23')
    expect(addDays('2026-12-30', 2)).toBe('2027-01-01')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2026-11-01', -1)).toBe('2026-10-31')
  })

  it('moves a day forward by whole years, landing a leap day on 28 February', () => {
    expect(addYears('2026-11-09', 2)).toBe('2028-11-09')
    expect(addYears('2028-02-29', 1)).toBe('2029-02-28')
  })

  it('counts the days between two days, across the clock change', () => {
    expect(daysBetween('2026-11-09', '2026-11-23')).toBe(14)
    expect(daysBetween('2026-03-20', '2026-03-30')).toBe(10)
    expect(daysBetween('2026-11-23', '2026-11-20')).toBe(-3)
  })

  it('tells a future day from today and earlier days', () => {
    expect(isAfterToday('2026-11-11', '2026-11-10')).toBe(true)
    expect(isAfterToday('2027-01-01', '2026-11-10')).toBe(true)
    expect(isAfterToday('2026-11-10', '2026-11-10')).toBe(false)
    expect(isAfterToday('2025-12-31', '2026-11-10')).toBe(false)
  })
})
