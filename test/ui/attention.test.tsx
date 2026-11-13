import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addItem, type ItemDraft } from '../../src/data/repo'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 13, 12, 0).getTime()

const ATTENTION_URL = '/tabs/purchases/attention'

const seedItem = (name: string, fields: Partial<ItemDraft> = {}) =>
  addItem({ name, boughtOn: '2026-11-09', ...fields }, {}, NOW)

describe('closing return windows', () => {
  freezeDate(NOW)
  beforeEach(resetDb)

  it('lists the items needing attention, closing soonest first, each opening its item', async () => {
    await seedItem('Rain coat', { returnBy: '2026-11-16' })
    const kettle = await seedItem('Kettle', { returnBy: '2026-11-13' })
    await seedItem('Lamp', { returnBy: '2026-11-15' })
    await seedItem('Returned shirt', { returnBy: '2026-11-14', returned: true })
    await seedItem('Far away', { returnBy: '2026-11-30' })
    renderAt(ATTENTION_URL)

    const list = await screen.findByRole('list', { name: 'להחזרה בקרוב' })
    const rows = await within(list).findAllByRole('link')

    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining('Kettle'),
      expect.stringContaining('Lamp'),
      expect.stringContaining('Rain coat'),
    ])
    expect(rows[0]).toHaveAttribute('href', `/tabs/purchases/${kettle}`)
    expect(within(rows[0]).getByText('היום אחרון להחזרה')).toBeInTheDocument()
    expect(within(rows[2]).getByText('להחזרה עוד 3 ימים')).toBeInTheDocument()
  })

  it('goes back to רכישות', async () => {
    renderAt(ATTENTION_URL)

    expect(await screen.findByRole('heading', { level: 1, name: 'להחזרה בקרוב' })).toBeInTheDocument()
    expect(document.querySelector('ion-back-button')).toHaveAttribute('default-href', '/tabs/purchases')
  })
})
