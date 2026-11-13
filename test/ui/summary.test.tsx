import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addItem, type ItemDraft } from '../../src/data/repo'
import { summaryItemPath, summaryItemsPath } from '../../src/navigation/paths'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { expectInOrder, pageOf } from '../helpers/ionic'
import { currentPath, currentSearch, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 13, 12).getTime()

const addPurchase = (draft: ItemDraft) => addItem(draft, {}, NOW)

function controlledBy(toggle: HTMLElement) {
  const controlledId = toggle.getAttribute('aria-controls')
  const controlled = controlledId && document.getElementById(controlledId)

  if (!controlled) {
    throw new Error('no controlled element')
  }

  return controlled
}

async function seedYear() {
  await addPurchase({ name: 'אוזניות', price: 1190, shop: 'KSP', kindId: 'electronics', boughtOn: '2026-11-02' })
  await addPurchase({ name: 'נעלי ריצה', price: 449, shop: 'מגה ספורט', kindId: 'shoes', boughtOn: '2026-11-09' })
  await addPurchase({ name: 'גרביים', price: 45, shop: 'מגה ספורט', kindId: 'clothes', boughtOn: '2026-11-05' })
  await addPurchase({ name: 'מעיל', price: 600, shop: 'זארה', kindId: 'clothes', boughtOn: '2026-11-03', returned: true })
  await addPurchase({ name: 'מסך', price: 890, shop: 'KSP', kindId: 'electronics', boughtOn: '2026-04-06' })
  await addPurchase({ name: 'ג׳ינס', price: 399, shop: 'לוויס', kindId: 'clothes', boughtOn: '2026-10-03' })
}

describe('summary', () => {
  freezeDate(NOW)
  beforeEach(resetDb)

  it('totals the current month and, on שנה, the current year, leaving returned items out', async () => {
    await seedYear()
    renderAt('/tabs/summary')

    expect(await screen.findByText('נובמבר 2026')).toBeVisible()
    expect(await screen.findByText('₪1,684')).toBeVisible()
    expect(screen.getByText('3 פריטים')).toBeVisible()
    expect(screen.getByRole('button', { name: 'חודש' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'שנה' }))

    expect(await screen.findByText('₪2,973')).toBeVisible()
    expect(screen.getByText('2026')).toBeVisible()
    expect(screen.getByText('5 פריטים')).toBeVisible()
  })

  it('steps to the previous month and back, never past the current one', async () => {
    await seedYear()
    renderAt('/tabs/summary')

    const nextMonth = await screen.findByRole('button', { name: 'חודש הבא' })

    expect(nextMonth).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'חודש קודם' }))

    expect(await screen.findByText('אוקטובר 2026')).toBeVisible()

    const totalLink = screen.getByRole('link', { name: /פריט אחד/ })

    expect(within(totalLink).getByText('₪399')).toBeVisible()
    expect(totalLink).toHaveAttribute('href', summaryItemsPath({ period: '2026-10' }))
    expect(nextMonth).toBeEnabled()

    fireEvent.click(nextMonth)

    expect(await screen.findByText('נובמבר 2026')).toBeVisible()
    expect(nextMonth).toBeDisabled()
  })

  it('reaches a new month that began while the app stayed open', async () => {
    renderAt('/tabs/summary')

    const nextMonth = await screen.findByRole('button', { name: 'חודש הבא' })

    expect(nextMonth).toBeDisabled()

    vi.setSystemTime(new Date(2026, 11, 1, 9))
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    await waitFor(() => expect(nextMonth).toBeEnabled())
    fireEvent.click(nextMonth)

    expect(await screen.findByText('דצמבר 2026')).toBeVisible()
  })

  it('lists the five most expensive items of the period in order, without returned ones', async () => {
    await seedYear()

    const cameraId = await addPurchase({ name: 'מצלמה', price: 2000, shop: 'KSP', boughtOn: '2026-11-07' })

    await addPurchase({ name: 'תיק', price: 300, shop: 'זארה', boughtOn: '2026-11-08' })
    await addPurchase({ name: 'כובע', price: 80, boughtOn: '2026-11-10' })
    renderAt('/tabs/summary')

    const section = within(await screen.findByRole('region', { name: 'הכי יקרים' }))

    await expectInOrder(['מצלמה', 'אוזניות', 'נעלי ריצה', 'תיק', 'כובע'])
    expect(section.getAllByRole('link')).toHaveLength(5)
    expect(section.queryByText('גרביים')).not.toBeInTheDocument()
    expect(section.queryByText('מעיל')).not.toBeInTheDocument()

    const cameraRow = section.getByRole('link', { name: /מצלמה/ })

    expect(within(cameraRow).getByText('KSP · 7.11.26')).toBeVisible()
    expect(within(cameraRow).getByText('₪2,000')).toBeVisible()
    expect(cameraRow).toHaveAttribute('href', summaryItemPath(cameraId))
  })

  it('opens לפי סוג in place and a kind opens the items of that kind in the period', async () => {
    await seedYear()
    renderAt('/tabs/summary')
    await screen.findByText('₪1,684')

    const byKind = screen.getByRole('button', { name: 'לפי סוג' })

    expect(byKind).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(byKind)

    expect(byKind).toHaveAttribute('aria-expanded', 'true')
    await expectInOrder(['אלקטרוניקה', 'נעליים', 'בגדים'])

    const electronicsLine = within(controlledBy(byKind)).getByRole('link', { name: /אלקטרוניקה/ })

    expect(within(electronicsLine).getByText('₪1,190')).toBeVisible()
    expect(within(electronicsLine).getByText('פריט אחד')).toBeVisible()

    fireEvent.click(electronicsLine)

    await waitFor(() => expect(currentPath()).toBe('/tabs/summary/items'))
    expect(currentSearch()).toBe('?period=2026-11&kind=electronics')

    const itemsPage = within(pageOf(await screen.findByRole('heading', { level: 1, name: 'אלקטרוניקה' })))

    expect(itemsPage.getByText('נובמבר 2026')).toBeVisible()
    expect(itemsPage.getAllByRole('link').map((link) => link.getAttribute('href'))).toHaveLength(1)
    expect(itemsPage.getByRole('link', { name: /אוזניות/ })).toBeVisible()
  })

  it('opens לפי חנות in place and a shop opens its items in the period, newest first', async () => {
    await seedYear()
    renderAt('/tabs/summary')
    await screen.findByText('₪1,684')

    const byShop = screen.getByRole('button', { name: 'לפי חנות' })

    fireEvent.click(byShop)

    const shopLines = within(controlledBy(byShop))
    const shopLine = shopLines.getByRole('link', { name: /מגה ספורט/ })

    expect(within(shopLine).getByText('₪494')).toBeVisible()
    expect(within(shopLine).getByText('2 פריטים')).toBeVisible()
    expect(shopLines.queryByText('זארה')).not.toBeInTheDocument()

    fireEvent.click(shopLine)

    await waitFor(() => expect(currentPath()).toBe('/tabs/summary/items'))
    expect(currentSearch()).toBe('?period=2026-11&shop=%D7%9E%D7%92%D7%94+%D7%A1%D7%A4%D7%95%D7%A8%D7%98')

    const itemsPage = within(pageOf(await screen.findByRole('heading', { level: 1, name: 'מגה ספורט' })))
    const rowNames = itemsPage.getAllByRole('link').map((row) => row.querySelector('strong')?.textContent)

    expect(itemsPage.getByText('₪494')).toBeVisible()
    expect(rowNames).toEqual(['נעלי ריצה', 'גרביים'])
  })

  it('opens the items behind the big total, newest first', async () => {
    await seedYear()
    renderAt('/tabs/summary')

    fireEvent.click(await screen.findByText('₪1,684'))

    const itemsPage = within(pageOf(await screen.findByRole('heading', { level: 1, name: 'נובמבר 2026' })))
    const rowNames = itemsPage.getAllByRole('link').map((row) => row.querySelector('strong')?.textContent)

    expect(itemsPage.getByText('₪1,684')).toBeVisible()
    expect(rowNames).toEqual(['נעלי ריצה', 'גרביים', 'אוזניות'])
  })

  it('says so calmly when the period has no purchases', async () => {
    renderAt('/tabs/summary')

    expect(await screen.findByText('לא נרשמו רכישות בתקופה הזו.')).toBeVisible()
  })
})
