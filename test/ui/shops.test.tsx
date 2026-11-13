import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addItem, type ItemDraft } from '../../src/data/repo'
import { shopPath } from '../../src/navigation/paths'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { expectInOrder, pageOf } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 13, 12).getTime()

const addPurchase = (draft: ItemDraft) => addItem(draft, {}, NOW)

async function seedShops() {
  await addPurchase({ name: 'נעלי ריצה', price: 449, shop: 'מגה ספורט', place: 'קניון איילון', boughtOn: '2026-10-12' })
  await addPurchase({ name: 'כדור', price: 283, shop: 'מגה ספורט', place: 'קניון עזריאלי', boughtOn: '2026-10-20' })
  await addPurchase({ name: 'חולצה', price: 537, shop: 'קסטרו', place: 'דיזנגוף סנטר', boughtOn: '2026-11-05' })
  await addPurchase({ name: 'מחברת', price: 189, shop: 'אופיס דיפו', place: 'פתח תקווה', boughtOn: '2026-11-10' })
}

describe('shops', () => {
  freezeDate(NOW)
  beforeEach(resetDb)

  it('ranks shops by total with their latest place and item count, and re-sorts by the switch', async () => {
    await seedShops()
    renderAt('/tabs/shops')

    await expectInOrder(['מגה ספורט', 'קסטרו', 'אופיס דיפו'])
    expect(screen.getByText('קניון עזריאלי · 2 פריטים')).toBeVisible()
    expect(screen.getByText('₪732')).toBeVisible()
    expect(screen.getByRole('button', { name: 'סכום' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'אחרונה' }))
    await expectInOrder(['אופיס דיפו', 'קסטרו', 'מגה ספורט'])

    fireEvent.click(screen.getByRole('button', { name: 'א-ב' }))
    await expectInOrder(['אופיס דיפו', 'מגה ספורט', 'קסטרו'])
  })

  it('leaves a returned item out of its shop total and sizes bars against the top shop', async () => {
    await addPurchase({ name: 'מעיל', price: 400, shop: 'זארה', boughtOn: '2026-11-01' })
    await addPurchase({ name: 'צעיף', price: 900, shop: 'זארה', boughtOn: '2026-11-02', returned: true })
    await addPurchase({ name: 'גרביים', price: 100, shop: 'גולף', boughtOn: '2026-11-03' })
    renderAt('/tabs/shops')

    const topRow = await screen.findByRole('link', { name: /זארה/ })
    const secondRow = screen.getByRole('link', { name: /גולף/ })

    expect(within(topRow).getByText('₪400')).toBeVisible()
    expect(topRow.querySelector('.shop-rank-bar i')).toHaveStyle({ width: '100%' })
    expect(secondRow.querySelector('.shop-rank-bar i')).toHaveStyle({ width: '25%' })
  })

  it('opens a shop page with its places, total and items newest first, returned ones marked', async () => {
    await seedShops()

    const returnedId = await addPurchase({
      name: 'מגבת',
      price: 60,
      shop: 'מגה ספורט',
      place: 'קניון עזריאלי',
      boughtOn: '2026-11-01',
      returned: true,
    })

    renderAt('/tabs/shops')
    fireEvent.click(await screen.findByRole('link', { name: /מגה ספורט/ }))

    await waitFor(() => expect(currentPath()).toBe(shopPath('מגה ספורט')))
    const heading = await screen.findByRole('heading', { level: 1, name: 'מגה ספורט' })
    const shopPage = within(pageOf(heading))

    expect(heading).toBeVisible()
    expect(shopPage.getByText('קניון עזריאלי · קניון איילון')).toBeVisible()
    expect(shopPage.getByText('₪732')).toBeVisible()
    expect(shopPage.getByText('3 פריטים')).toBeVisible()
    await expectInOrder(['מגבת', 'כדור', 'נעלי ריצה'])

    const returnedRow = shopPage.getByRole('link', { name: /מגבת/ })

    expect(within(returnedRow).getByText('הוחזר')).toBeVisible()
    expect(returnedRow).toHaveAttribute('href', `/tabs/shops/items/${returnedId}`)
  })

  it('says so calmly for a shop that does not exist', async () => {
    renderAt('/tabs/shops/nowhere')

    expect(await screen.findByText('החנות הזו לא נמצאה.')).toBeVisible()
  })

  it('says so calmly when no item has a shop yet', async () => {
    await addPurchase({ name: 'מטריה', boughtOn: '2026-11-01' })
    renderAt('/tabs/shops')

    expect(await screen.findByText(/עדיין אין חנויות/)).toBeVisible()
  })
})
