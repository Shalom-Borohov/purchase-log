import { describe, expect, it } from 'vitest'
import { calendarEventText } from '../../src/domain/calendarEvent'

const NOW = Date.UTC(2026, 10, 12, 8, 30, 5)

const MAX_LINE_OCTETS = 75

const LINE_BREAK = '\r\n'

const unfold = (text: string) => text.replaceAll(`${LINE_BREAK} `, '')

const event = (title: string, description = 'מגה ספורט, קניון עזריאלי; 2026/041') =>
  calendarEventText({ uid: 'shoes-return@purchase-log', title, day: '2026-11-22', description }, NOW)

describe('calendarEventText', () => {
  it('writes one all-day event with a morning alarm, in CRLF lines', () => {
    const lines = unfold(event('להחזיר נעלי ריצה')).split(LINE_BREAK)

    expect(lines).toEqual([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//purchase-log//רכישות//HE',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:shoes-return@purchase-log',
      'DTSTAMP:20261112T083005Z',
      'DTSTART;VALUE=DATE:20261122',
      'DTEND;VALUE=DATE:20261123',
      'SUMMARY:להחזיר נעלי ריצה',
      'DESCRIPTION:מגה ספורט\\, קניון עזריאלי\\; 2026/041',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'TRIGGER;RELATED=START:PT9H',
      'DESCRIPTION:להחזיר נעלי ריצה',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ])
  })

  it('escapes line breaks and backslashes in text', () => {
    expect(unfold(event('a\\b', 'שורה\nשנייה'))).toContain('DESCRIPTION:שורה\\nשנייה')
    expect(unfold(event('a\\b'))).toContain('SUMMARY:a\\\\b')
  })

  it('folds long lines at 75 octets without splitting a Hebrew letter', () => {
    const title = 'להחזיר '.repeat(30)
    const text = event(title)
    const encoder = new TextEncoder()

    text.split(LINE_BREAK).forEach((line) => expect(encoder.encode(line).length).toBeLessThanOrEqual(MAX_LINE_OCTETS))
    expect(unfold(text)).toContain(`SUMMARY:${title}`)
  })
})
