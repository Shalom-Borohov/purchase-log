import { addDays } from './dayDate'

export type CalendarEvent = {
  uid: string
  title: string
  day: string
  description: string
}

const LINE_BREAK = '\r\n'

const FOLD_PREFIX = ' '

const MAX_LINE_OCTETS = 75

const NEXT_DAY = 1

const ALARM_HOURS_INTO_DAY = 9

const PRODUCT_ID = '-//purchase-log//רכישות//HE'

const DATE_SEPARATOR = /-/g

const STAMP_PUNCTUATION = /[-:]|\.\d{3}/g

const TEXT_SPECIALS = /[\\;,\n]/g

const TEXT_ESCAPES: Record<string, string> = { '\\': '\\\\', ';': '\\;', ',': '\\,', '\n': '\\n' }

const OCTETS = new TextEncoder()

const escapeText = (text: string) => text.replace(TEXT_SPECIALS, (special) => TEXT_ESCAPES[special])

const calendarDate = (day: string) => day.replace(DATE_SEPARATOR, '')

const calendarStamp = (now: number) => new Date(now).toISOString().replace(STAMP_PUNCTUATION, '')

function foldLine(line: string) {
  const parts: string[] = []
  let part = ''

  for (const character of line) {
    const limit = parts.length ? MAX_LINE_OCTETS - FOLD_PREFIX.length : MAX_LINE_OCTETS

    if (OCTETS.encode(part + character).length > limit) {
      parts.push(part)
      part = ''
    }

    part += character
  }

  return [...parts, part].join(`${LINE_BREAK}${FOLD_PREFIX}`)
}

export function calendarEventText({ uid, title, day, description }: CalendarEvent, now: number) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODUCT_ID}`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${calendarStamp(now)}`,
    `DTSTART;VALUE=DATE:${calendarDate(day)}`,
    `DTEND;VALUE=DATE:${calendarDate(addDays(day, NEXT_DAY))}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `TRIGGER;RELATED=START:PT${ALARM_HOURS_INTO_DAY}H`,
    `DESCRIPTION:${escapeText(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.map((line) => `${foldLine(line)}${LINE_BREAK}`).join('')
}
