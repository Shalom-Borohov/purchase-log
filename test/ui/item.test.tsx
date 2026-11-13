import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { addItem, allItems, type ItemDraft, itemPhoto } from '../../src/data/repo'
import {
  PURCHASES_PATH,
  purchasesItemPath,
  SHOPS_PATH,
  shopsItemPath,
  SUMMARY_PATH,
  summaryItemPath,
} from '../../src/navigation/paths'
import type { ItemSheetProps } from '../../src/pages/itemSheet/ItemSheet'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { ionElement } from '../helpers/ionic'
import {
  alertDismissed,
  alertHeader,
  alertMessage,
  alertShown,
  clickAlertButton,
  modalDismissed,
} from '../helpers/overlays'
import { PHOTO_URL, shrunkPhoto, stubObjectUrls } from '../helpers/photo'
import { currentPath, renderAt } from '../helpers/renderAt'

vi.mock('../../src/pages/itemSheet/ItemSheet', () => ({
  ItemSheet: ({ isOpen, item }: ItemSheetProps) => (isOpen ? <p>{`editing ${item?.name}`}</p> : null),
}))

const EDITING_SHOES = 'editing נעלי ריצה'

const FOLDED_LINE_BREAK = /\r\n /g

const NOW = new Date(2026, 10, 12, 18, 30).getTime()

const SHOES: ItemDraft = {
  name: 'נעלי ריצה',
  boughtOn: '2026-11-09',
  price: 449,
  shop: 'מגה ספורט',
  place: 'קניון עזריאלי',
  kindId: 'shoes',
}

const addShoes = (fields: Partial<ItemDraft> = {}) => addItem({ ...SHOES, ...fields }, {}, NOW)

async function storedItem(itemId: string) {
  const found = (await allItems()).find(({ id }) => id === itemId)

  if (!found) {
    throw new Error(`no item ${itemId}`)
  }

  return found
}

function stubShare() {
  const share = vi.fn<Navigator['share']>().mockResolvedValue()

  Object.defineProperty(navigator, 'share', { configurable: true, value: share })
  Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true })

  return share
}

async function sharedEventText(share: ReturnType<typeof stubShare>) {
  await waitFor(() => expect(share).toHaveBeenCalledOnce())

  const [file] = share.mock.calls[0][0]?.files ?? []

  expect(file?.type).toBe('text/calendar')

  const eventText = await file?.text()

  return eventText?.replace(FOLDED_LINE_BREAK, '')
}

describe('item page', () => {
  freezeDate(NOW)
  beforeEach(resetDb)

  afterEach(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined })
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: undefined })
  })

  it('shows the item label as the page heading with its kind and running number', async () => {
    const itemId = await addShoes()

    renderAt(purchasesItemPath(itemId))

    expect(await screen.findByRole('heading', { level: 1, name: 'נעלי ריצה' })).toBeVisible()
    expect(screen.getByText('מגה ספורט · קניון עזריאלי · 9.11.26')).toBeVisible()
    expect(screen.getByText('נעליים')).toBeVisible()
    expect(screen.getByText('2026/001')).toBeVisible()
    expect(screen.getByText('₪449')).toBeVisible()
  })

  it.each([
    [purchasesItemPath, PURCHASES_PATH],
    [shopsItemPath, SHOPS_PATH],
    [summaryItemPath, SUMMARY_PATH],
  ])('goes back to the root of the stack it was opened in', async (itemPath, rootPath) => {
    const itemId = await addShoes()

    renderAt(itemPath(itemId))

    fireEvent.click(await ionElement('ion-back-button'))

    await waitFor(() => expect(currentPath()).toBe(rootPath))
  })

  it('opens the edit sheet with this item', async () => {
    const itemId = await addShoes()

    renderAt(purchasesItemPath(itemId))

    expect(screen.queryByText(EDITING_SHOES)).not.toBeInTheDocument()

    fireEvent.click(await screen.findByRole('button', { name: 'עריכה' }))

    expect(await screen.findByText(EDITING_SHOES)).toBeInTheDocument()
  })

  it('marks the item returned and can undo it', async () => {
    const itemId = await addShoes({ returnBy: '2026-11-23' })

    renderAt(purchasesItemPath(itemId))

    fireEvent.click(await screen.findByRole('button', { name: 'הוחזר' }))

    await waitFor(async () => expect((await storedItem(itemId)).returned).toBe(true))
    fireEvent.click(await screen.findByRole('button', { name: 'לא הוחזר' }))

    await waitFor(async () => expect((await storedItem(itemId)).returned).toBe(false))
    expect(await screen.findByRole('button', { name: 'הוחזר' })).toBeVisible()
  })

  it('offers to keep an item whose return window is closing, and stops asking once kept', async () => {
    const itemId = await addShoes({ returnBy: '2026-11-14' })

    renderAt(purchasesItemPath(itemId))

    fireEvent.click(await screen.findByRole('button', { name: 'נשאר אצלי' }))

    await waitFor(async () => expect((await storedItem(itemId)).keeping).toBe(true))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'נשאר אצלי' })).not.toBeInTheDocument())
  })

  it('does not offer to keep an item whose return window is still far', async () => {
    const itemId = await addShoes({ returnBy: '2026-11-23' })

    renderAt(purchasesItemPath(itemId))

    expect(await screen.findByRole('button', { name: 'הוחזר' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'נשאר אצלי' })).not.toBeInTheDocument()
  })

  it('shows the other items from the same shop, newest first, and opens them in the same stack', async () => {
    const itemId = await addShoes()
    const bottleId = await addShoes({ name: 'בקבוק שתייה', shop: ' מגה ספורט ', price: 59, boughtOn: '2026-11-11' })

    await addShoes({ name: 'מכנסי ריצה', boughtOn: '2026-10-20' })
    await addShoes({ name: 'מנורה', shop: 'איקאה' })
    renderAt(shopsItemPath(itemId))

    const rail = await screen.findByRole('region', { name: 'עוד ממגה ספורט' })
    const names = within(rail).getAllByRole('link').map((link) => link.textContent)

    expect(within(rail).getByText('2 פריטים')).toBeVisible()
    expect(names).toEqual(['בקבוק שתייה₪59', 'מכנסי ריצה₪449'])

    fireEvent.click(within(rail).getByRole('link', { name: /בקבוק שתייה/ }))

    await waitFor(() => expect(currentPath()).toBe(shopsItemPath(bottleId)))
  })

  it('leaves out the same-shop row when the shop has nothing else or the item has no shop', async () => {
    const itemId = await addShoes({ shop: undefined })

    await addShoes({ name: 'מכנסי ריצה', shop: undefined })
    renderAt(purchasesItemPath(itemId))

    expect(await screen.findByRole('heading', { level: 1, name: 'נעלי ריצה' })).toBeVisible()
    expect(screen.queryByRole('region', { name: /^עוד מ/ })).not.toBeInTheDocument()
  })

  describe('receipt, warranty and note', () => {
    stubObjectUrls()

    it('opens the full receipt photo from its thumbnail and closes it', async () => {
      const receipt = shrunkPhoto(new ArrayBuffer(4), new ArrayBuffer(2))
      const itemId = await addItem(SHOES, { receipt }, NOW)

      renderAt(purchasesItemPath(itemId))

      fireEvent.click(await screen.findByRole('button', { name: 'קבלה' }))

      expect(await screen.findByRole('img', { name: 'קבלה: נעלי ריצה' })).toHaveAttribute('src', PHOTO_URL)

      const dismissed = modalDismissed()

      fireEvent.click(screen.getByText('סגירה'))
      await dismissed
    })

    it('has no receipt button when there is no receipt photo', async () => {
      const itemId = await addShoes({ note: 'מידה 43' })

      renderAt(purchasesItemPath(itemId))

      expect(await screen.findByText('מידה 43')).toBeVisible()
      expect(screen.queryByRole('button', { name: 'קבלה' })).not.toBeInTheDocument()
    })

    it('shows the warranty end and offers a calendar event for the day before it', async () => {
      const share = stubShare()
      const itemId = await addShoes({ warrantyUntil: '2027-11-09' })

      renderAt(purchasesItemPath(itemId))

      expect(await screen.findByText('אחריות עד 9.11.27')).toBeVisible()
      fireEvent.click(screen.getByRole('button', { name: 'הוספה ליומן: סוף האחריות' }))

      const eventText = await sharedEventText(share)

      expect(eventText).toContain(`UID:${itemId}-warranty@purchase-log`)
      expect(eventText).toContain('DTSTART;VALUE=DATE:20271108')
      expect(eventText).toContain('SUMMARY:האחריות נגמרת: נעלי ריצה')
    })

    it('shows an ended warranty without a calendar button', async () => {
      const itemId = await addShoes({ warrantyUntil: '2026-11-12' })

      renderAt(purchasesItemPath(itemId))

      expect(await screen.findByText('אחריות עד 12.11.26')).toBeVisible()
      expect(screen.queryByRole('button', { name: /הוספה ליומן/ })).not.toBeInTheDocument()
    })
  })

  describe('return calendar event', () => {
    it('shares a calendar event for the day before the return window closes', async () => {
      const share = stubShare()
      const itemId = await addShoes({ returnBy: '2026-11-23' })

      renderAt(purchasesItemPath(itemId))

      fireEvent.click(await screen.findByRole('button', { name: 'הוספה ליומן' }))

      const eventText = await sharedEventText(share)

      expect(eventText).toContain(`UID:${itemId}-return@purchase-log`)
      expect(eventText).toContain('DTSTART;VALUE=DATE:20261122')
      expect(eventText).toContain('SUMMARY:להחזיר: נעלי ריצה')
      expect(eventText).toContain('DESCRIPTION:מגה ספורט · קניון עזריאלי · 9.11.26 · 2026/001')
    })

    it('still offers the event when it falls on today', async () => {
      const itemId = await addShoes({ returnBy: '2026-11-13' })

      renderAt(purchasesItemPath(itemId))

      expect(await screen.findByRole('button', { name: 'הוספה ליומן' })).toBeVisible()
    })

    it.each([
      ['the event day has passed', { returnBy: '2026-11-12' }],
      ['the item was returned', { returnBy: '2026-11-23', returned: true }],
      ['there is no return-by date', {}],
    ])('offers no return event when %s', async (_case, fields) => {
      const itemId = await addShoes(fields)

      renderAt(purchasesItemPath(itemId))

      expect(await screen.findByRole('heading', { level: 1, name: 'נעלי ריצה' })).toBeVisible()
      expect(screen.queryByRole('button', { name: 'הוספה ליומן' })).not.toBeInTheDocument()
    })
  })

  it('deletes the item with its photos after asking, then leaves the page', async () => {
    const receipt = shrunkPhoto(new ArrayBuffer(4), new ArrayBuffer(2))
    const itemId = await addItem(SHOES, { item: receipt, receipt }, NOW)

    renderAt(shopsItemPath(itemId))

    const shown = alertShown()

    fireEvent.click(await screen.findByRole('button', { name: 'מחיקה' }))
    await shown

    expect(alertHeader()).toBe('למחוק את נעלי ריצה?')
    expect(alertMessage()).toBe('גם התמונה והקבלה שלו יימחקו.')

    clickAlertButton('מחיקה')

    await waitFor(() => expect(currentPath()).toBe(SHOPS_PATH))
    expect(await allItems()).toEqual([])
    expect(await itemPhoto(itemId, 'receipt')).toBeUndefined()
  })

  it('keeps the item when the deletion is cancelled', async () => {
    const itemId = await addShoes()

    renderAt(purchasesItemPath(itemId))

    const shown = alertShown()

    fireEvent.click(await screen.findByRole('button', { name: 'מחיקה' }))
    await shown

    const dismissed = alertDismissed()

    clickAlertButton('ביטול')
    await dismissed

    expect(await allItems()).toHaveLength(1)
    expect(currentPath()).toBe(purchasesItemPath(itemId))
  })

  it('says so calmly when the item does not exist', async () => {
    renderAt(purchasesItemPath('missing'))

    expect(await screen.findByText('הפריט לא נמצא')).toBeVisible()
  })
})
