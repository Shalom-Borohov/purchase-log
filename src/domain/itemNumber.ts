import type { Item } from './types'

const SEQUENCE_DIGITS = 3

const SEQUENCE_PAD = '0'

export const itemNumber = ({ year, sequence }: Pick<Item, 'year' | 'sequence'>) =>
  `${year}/${String(sequence).padStart(SEQUENCE_DIGITS, SEQUENCE_PAD)}`
