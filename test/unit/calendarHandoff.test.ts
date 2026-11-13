import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handOverCalendarEvent } from '../../src/pages/item/calendarHandoff'

const EVENT_TEXT = 'BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n'

const DOWNLOAD_URL = 'blob:calendar-event'

const ORIGINAL_CREATE = URL.createObjectURL

const ORIGINAL_REVOKE = URL.revokeObjectURL

type NavigatorSharing = {
  share: Navigator['share'] | undefined
  canShare: Navigator['canShare'] | undefined
}

function stubNavigator(fields: NavigatorSharing) {
  Object.defineProperty(navigator, 'share', { configurable: true, value: fields.share })
  Object.defineProperty(navigator, 'canShare', { configurable: true, value: fields.canShare })
}

function sharedFile(share: ReturnType<typeof vi.fn<Navigator['share']>>) {
  const [shared] = share.mock.calls[0]
  const [file] = shared?.files ?? []

  if (!file) {
    throw new Error('no file was shared')
  }

  return file
}

describe('calendar hand-off', () => {
  afterEach(() => {
    stubNavigator({ share: undefined, canShare: undefined })
  })

  it('shares an .ics calendar file named after the item when the phone can share files', async () => {
    const share = vi.fn<Navigator['share']>().mockResolvedValue()

    stubNavigator({ share, canShare: () => true })

    await handOverCalendarEvent('נעלי ריצה', EVENT_TEXT)

    const file = sharedFile(share)

    expect(file.name).toBe('נעלי ריצה.ics')
    expect(file.type).toBe('text/calendar')
    expect(await file.text()).toBe(EVENT_TEXT)
  })

  it('treats a cancelled share sheet as done', async () => {
    const share = vi.fn<Navigator['share']>().mockRejectedValue(new DOMException('cancelled', 'AbortError'))

    stubNavigator({ share, canShare: () => true })

    await expect(handOverCalendarEvent('נעלי ריצה', EVENT_TEXT)).resolves.toBe('delivered')
  })

  it('asks for another tap when the share tap has expired', async () => {
    const share = vi.fn<Navigator['share']>().mockRejectedValue(new DOMException('expired', 'NotAllowedError'))

    stubNavigator({ share, canShare: () => true })

    await expect(handOverCalendarEvent('נעלי ריצה', EVENT_TEXT)).resolves.toBe('needsAnotherTap')
  })

  it('passes on any other share failure', async () => {
    const share = vi.fn<Navigator['share']>().mockRejectedValue(new DOMException('broken', 'DataError'))

    stubNavigator({ share, canShare: () => true })

    await expect(handOverCalendarEvent('נעלי ריצה', EVENT_TEXT)).rejects.toThrow('broken')
  })

  describe('when the phone cannot share files', () => {
    const revoke = vi.fn<typeof URL.revokeObjectURL>()

    let downloaded: HTMLAnchorElement[] = []

    beforeEach(() => {
      vi.useFakeTimers()
      downloaded = []
      revoke.mockReset()
      URL.createObjectURL = () => DOWNLOAD_URL
      URL.revokeObjectURL = revoke
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function recordDownload(this: HTMLAnchorElement) {
        downloaded.push(this)
      })
      stubNavigator({ share: undefined, canShare: () => false })
    })

    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
      URL.createObjectURL = ORIGINAL_CREATE
      URL.revokeObjectURL = ORIGINAL_REVOKE
    })

    it('downloads the file and frees its address only after a delay', async () => {
      await handOverCalendarEvent('נעלי ריצה', EVENT_TEXT)

      const [link] = downloaded

      expect(link.href).toBe(DOWNLOAD_URL)
      expect(link.download).toBe('נעלי ריצה.ics')
      expect(revoke).not.toHaveBeenCalled()

      vi.runAllTimers()

      expect(revoke).toHaveBeenCalledWith(DOWNLOAD_URL)
    })
  })
})
