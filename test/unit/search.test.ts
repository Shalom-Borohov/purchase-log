import { describe, expect, it } from 'vitest'
import { itemNumber } from '../../src/domain/itemNumber'
import { searchItems } from '../../src/domain/search'
import { item } from '../helpers/records'

describe('itemNumber', () => {
  it('writes the year and a three-digit sequence', () => {
    expect(itemNumber(item({ id: 'shoes', name: 'Shoes', year: 2026, sequence: 41 }))).toBe('2026/041')
    expect(itemNumber(item({ id: 'tv', name: 'TV', year: 2027, sequence: 1204 }))).toBe('2027/1204')
  })
})

describe('searchItems', () => {
  const items = [
    item({ id: 'shoes', name: 'נעלי ריצה Asics', shop: 'מגה ספורט', place: 'קניון עזריאלי', sequence: 41 }),
    item({ id: 'shirt', name: 'חולצת פשתן', shop: 'Castro', place: 'דיזנגוף סנטר', note: 'מידה M', sequence: 7 }),
    item({ id: 'kettle', name: 'קומקום', sequence: 12 }),
  ]

  const found = (query: string) => searchItems(items, query).map(({ id }) => id)

  it('finds by name, shop, place and note, ignoring case and spaces', () => {
    expect(found('  asics ')).toEqual(['shoes'])
    expect(found('castro')).toEqual(['shirt'])
    expect(found('עזריאלי')).toEqual(['shoes'])
    expect(found('מידה')).toEqual(['shirt'])
  })

  it('finds by running number, whole or in part', () => {
    expect(found('2026/041')).toEqual(['shoes'])
    expect(found('012')).toEqual(['kettle'])
  })

  it('finds nothing for a word on no item', () => {
    expect(found('מקרר')).toEqual([])
  })
})
