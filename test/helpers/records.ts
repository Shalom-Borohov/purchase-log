import type { Item, Kind } from '../../src/domain/types'

const CREATED_AT = 1_700_000_000_000

const DEFAULT_YEAR = 2026

const DEFAULT_DAY = '2026-11-09'

export const item = (fields: Partial<Item> & Pick<Item, 'id' | 'name'>): Item => ({
  year: DEFAULT_YEAR,
  sequence: 1,
  boughtOn: DEFAULT_DAY,
  createdAt: CREATED_AT,
  ...fields,
})

export const kind = (fields: Partial<Kind> & Pick<Kind, 'id' | 'name'>): Kind => ({
  colour: 'sky',
  position: 0,
  createdAt: CREATED_AT,
  ...fields,
})
