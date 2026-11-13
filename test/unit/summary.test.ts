import { describe, expect, it } from 'vitest'
import { DEFAULT_KINDS, kindOf, nextKindColour, OTHER_KIND_ID } from '../../src/domain/kinds'
import { periodSummary } from '../../src/domain/summary'
import { item, kind } from '../helpers/records'

const items = [
  item({ id: 'phones', name: 'Phones', kindId: 'electronics', shop: 'KSP', price: 1190, boughtOn: '2026-11-02' }),
  item({ id: 'shoes', name: 'Shoes', kindId: 'shoes', shop: 'מגה ספורט', price: 449, boughtOn: '2026-11-09' }),
  item({ id: 'socks', name: 'Socks', kindId: 'clothes', shop: 'מגה ספורט', price: 45, boughtOn: '2026-11-09' }),
  item({ id: 'bottle', name: 'Bottle', shop: 'מגה ספורט', price: 59, boughtOn: '2026-11-10' }),
  item({ id: 'pen', name: 'Pen', kindId: 'deleted-kind', boughtOn: '2026-11-11' }),
  item({ id: 'coat', name: 'Coat', kindId: 'clothes', price: 600, boughtOn: '2026-11-03', returned: true }),
  item({ id: 'screen', name: 'Screen', kindId: 'electronics', shop: 'KSP', price: 890, boughtOn: '2026-04-06' }),
  item({ id: 'old', name: 'Old', price: 999, boughtOn: '2025-12-31' }),
]

const records = { items, kinds: DEFAULT_KINDS }

describe('periodSummary', () => {
  it('totals a month without returned items', () => {
    const november = periodSummary(records, { unit: 'month', month: '2026-11' })

    expect(november.total).toBe(1743)
    expect(november.count).toBe(5)
  })

  it('totals a year', () => {
    const year = periodSummary(records, { unit: 'year', year: 2026 })

    expect(year.total).toBe(2633)
    expect(year.count).toBe(6)
  })

  it('lists the five most expensive priced items, dearest first', () => {
    const year = periodSummary(records, { unit: 'year', year: 2026 })

    expect(year.mostExpensive.map(({ id }) => id)).toEqual(['phones', 'screen', 'shoes', 'bottle', 'socks'])
  })

  it('breaks the period down by kind, items without a kind or with a deleted one under אחר, biggest first', () => {
    const november = periodSummary(records, { unit: 'month', month: '2026-11' })

    expect(november.byKind.map(({ kindId, total, count }) => ({ kindId, total, count }))).toEqual([
      { kindId: 'electronics', total: 1190, count: 1 },
      { kindId: 'shoes', total: 449, count: 1 },
      { kindId: OTHER_KIND_ID, total: 59, count: 2 },
      { kindId: 'clothes', total: 45, count: 1 },
    ])
  })

  it('breaks the period down by shop, biggest first, leaving out items with no shop', () => {
    const november = periodSummary(records, { unit: 'month', month: '2026-11' })

    expect(november.byShop.map(({ name, total, count }) => ({ name, total, count }))).toEqual([
      { name: 'KSP', total: 1190, count: 1 },
      { name: 'מגה ספורט', total: 553, count: 3 },
    ])
  })
})

describe('kinds', () => {
  it('starts with six kinds, אחר last and grey', () => {
    expect(DEFAULT_KINDS.map(({ name }) => name)).toEqual(['בגדים', 'נעליים', 'אלקטרוניקה', 'בית', 'ספורט', 'אחר'])
    expect(DEFAULT_KINDS.at(-1)).toMatchObject({ id: OTHER_KIND_ID, colour: 'grey' })
  })

  it('gives a new kind the next colour no kind uses yet', () => {
    const used = [kind({ id: 'a', name: 'a', colour: 'sky' }), kind({ id: 'b', name: 'b', colour: 'pink' })]

    expect(nextKindColour(used)).toBe('lilac')
    expect(nextKindColour(DEFAULT_KINDS)).toBe('peach')
  })

  it('finds an item’s kind, falling back to אחר for no kind or a missing one', () => {
    const kinds = [kind({ id: 'shoes', name: 'נעליים' }), kind({ id: OTHER_KIND_ID, name: 'אחר' })]

    expect(kindOf(kinds, 'shoes')?.name).toBe('נעליים')
    expect(kindOf(kinds, undefined)?.name).toBe('אחר')
    expect(kindOf(kinds, 'gone')?.name).toBe('אחר')
  })
})
