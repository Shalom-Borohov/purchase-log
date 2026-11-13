import { describe, expect, it } from 'vitest'
import { newestFirst } from '../../src/domain/itemOrder'
import { placesAtShop, returnDaysAtShop, shopGroups, shopSuggestions, sortShops } from '../../src/domain/shops'
import { item } from '../helpers/records'

const items = [
  item({ id: 'shirt', name: 'Shirt', shop: 'Castro', place: 'דיזנגוף סנטר', price: 159, boughtOn: '2026-10-01' }),
  item({ id: 'jeans', name: 'Jeans', shop: ' castro ', place: 'קניון איילון', price: 249, boughtOn: '2026-11-02' }),
  item({ id: 'socks', name: 'Socks', shop: 'Castro', price: 40, boughtOn: '2026-11-03', returned: true }),
  item({ id: 'phones', name: 'Phones', shop: 'KSP', place: 'פתח תקווה', price: 1190, boughtOn: '2026-09-10' }),
  item({ id: 'mug', name: 'Mug', shop: 'אלמה', boughtOn: '2026-11-05' }),
  item({ id: 'gift', name: 'Gift' }),
]

describe('shopGroups', () => {
  it('groups by shop name ignoring case and spaces, totals without returned items, newest spelling first', () => {
    const castro = shopGroups(items).find(({ key }) => key === 'castro')

    expect(castro).toMatchObject({
      name: 'Castro',
      total: 408,
      count: 3,
      places: ['קניון איילון', 'דיזנגוף סנטר'],
      lastBoughtOn: '2026-11-03',
    })
    expect(castro?.items.map(({ id }) => id)).toEqual(['socks', 'jeans', 'shirt'])
  })

  it('leaves out items with no shop', () => {
    expect(shopGroups(items).map(({ key }) => key)).not.toContain('')
    expect(shopGroups(items)).toHaveLength(3)
  })
})

describe('sortShops', () => {
  const names = (order: Parameters<typeof sortShops>[1]) => sortShops(shopGroups(items), order).map(({ name }) => name)

  it('ranks by total spent, biggest first', () => {
    expect(names('total')).toEqual(['KSP', 'Castro', 'אלמה'])
  })

  it('sorts by the most recent purchase', () => {
    expect(names('recent')).toEqual(['אלמה', 'Castro', 'KSP'])
  })

  it('sorts alphabetically, Hebrew names before Latin ones', () => {
    expect(names('name')).toEqual(['אלמה', 'Castro', 'KSP'])
  })
})

describe('suggestions', () => {
  it('suggests shops most recently bought from first, each once', () => {
    expect(shopSuggestions(items)).toEqual(['אלמה', 'Castro', 'KSP'])
  })

  it('suggests the places used before with a shop', () => {
    expect(placesAtShop(items, 'CASTRO')).toEqual(['קניון איילון', 'דיזנגוף סנטר'])
  })
})

describe('returnDaysAtShop', () => {
  it('takes the return window length from the shop’s latest item', () => {
    const withWindows = [
      item({ id: 'old', name: 'Old', shop: 'Fox', boughtOn: '2026-10-01', returnBy: '2026-10-31' }),
      item({ id: 'new', name: 'New', shop: 'fox', boughtOn: '2026-11-01', returnBy: '2026-11-15' }),
    ]

    expect(returnDaysAtShop(withWindows, 'Fox')).toBe(14)
  })

  it('keeps the last return window picked at the shop when a later item has none', () => {
    const latestWithout = [
      item({ id: 'old', name: 'Old', shop: 'Fox', boughtOn: '2026-10-01', returnBy: '2026-10-31' }),
      item({ id: 'new', name: 'New', shop: 'Fox', boughtOn: '2026-11-01' }),
    ]

    expect(returnDaysAtShop(latestWithout, 'Fox')).toBe(30)
  })

  it('remembers the pick entered last, even on a back-dated item', () => {
    const backDated = [
      item({ id: 'later-dated', name: 'Coat', shop: 'Fox', boughtOn: '2026-11-01', returnBy: '2026-12-01', createdAt: 1 }),
      item({ id: 'entered-last', name: 'Hat', shop: 'Fox', boughtOn: '2026-10-20', returnBy: '2026-11-03', createdAt: 2 }),
    ]

    expect(returnDaysAtShop(backDated, 'Fox')).toBe(14)
  })

  it('has no default at a new shop or one never given a return date', () => {
    const withoutWindows = [item({ id: 'mug', name: 'Mug', shop: 'Fox', boughtOn: '2026-11-01' })]

    expect(returnDaysAtShop(withoutWindows, 'Fox')).toBeUndefined()
    expect(returnDaysAtShop(withoutWindows, 'Zara')).toBeUndefined()
  })
})

describe('newestFirst', () => {
  it('orders by purchase day, then by when the item was entered', () => {
    const sameDay = [
      item({ id: 'first', name: 'First', boughtOn: '2026-11-01', createdAt: 1 }),
      item({ id: 'later', name: 'Later', boughtOn: '2026-11-01', createdAt: 2 }),
      item({ id: 'newer', name: 'Newer', boughtOn: '2026-11-02', createdAt: 0 }),
    ]

    expect(newestFirst(sameDay).map(({ id }) => id)).toEqual(['newer', 'later', 'first'])
  })
})
