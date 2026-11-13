import { describe, expect, it } from 'vitest'
import { attentionItems, returnWindow } from '../../src/domain/returnWindow'
import { item } from '../helpers/records'

const TODAY = '2026-11-12'

describe('returnWindow', () => {
  it('gives the days left and the share of the window still open', () => {
    const shoes = item({ id: 'shoes', name: 'Shoes', boughtOn: '2026-11-09', returnBy: '2026-11-23' })

    expect(returnWindow(shoes, TODAY)).toEqual({ returnBy: '2026-11-23', daysLeft: 11, openShare: 11 / 14 })
  })

  it('has no window without a return-by date', () => {
    expect(returnWindow(item({ id: 'mug', name: 'Mug' }), TODAY)).toBeUndefined()
  })

  it('has a closed window once the return-by day has passed', () => {
    const coat = item({ id: 'coat', name: 'Coat', boughtOn: '2026-10-01', returnBy: '2026-11-10' })

    expect(returnWindow(coat, TODAY)).toEqual({ returnBy: '2026-11-10', daysLeft: -2, openShare: 0 })
  })

  it('keeps a same-day window full on its only day', () => {
    const socks = item({ id: 'socks', name: 'Socks', boughtOn: TODAY, returnBy: TODAY })

    expect(returnWindow(socks, TODAY)).toEqual({ returnBy: TODAY, daysLeft: 0, openShare: 1 })
  })
})

describe('attentionItems', () => {
  const closingIn = (id: string, days: number, fields = {}) =>
    item({ id, name: id, boughtOn: '2026-11-01', returnBy: `2026-11-${12 + days}`, ...fields })

  it('takes windows closing today and within three days, soonest first', () => {
    const items = [
      closingIn('four', 4),
      closingIn('three', 3),
      closingIn('today', 0),
      closingIn('one', 1),
      item({ id: 'past', name: 'past', boughtOn: '2026-11-01', returnBy: '2026-11-11' }),
      item({ id: 'none', name: 'none' }),
    ]

    expect(attentionItems(items, TODAY).map(({ id }) => id)).toEqual(['today', 'one', 'three'])
  })

  it('leaves out returned items and items the owner is keeping', () => {
    const items = [closingIn('returned', 1, { returned: true }), closingIn('keeping', 1, { keeping: true })]

    expect(attentionItems(items, TODAY)).toEqual([])
  })
})
