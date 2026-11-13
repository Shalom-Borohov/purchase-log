import {
  boolean,
  check,
  type InferOutput,
  integer,
  is,
  minLength,
  minValue,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  trim,
} from 'valibot'
import { isDayDate } from './dayDate'
import { isPriceAmount } from './price'

const MINIMUM_NAME_LENGTH = 1

const FIRST_SEQUENCE = 1

export const KIND_COLOURS = [
  'sky',
  'lilac',
  'pink',
  'mint',
  'lime',
  'grey',
  'peach',
  'sand',
  'teal',
  'violet',
] as const

export type KindColour = (typeof KIND_COLOURS)[number]

export const PHOTO_ROLES = ['item', 'receipt'] as const

export type PhotoRole = (typeof PHOTO_ROLES)[number]

export const PHOTO_FLAGS: Record<PhotoRole, 'hasPhoto' | 'hasReceipt'> = { item: 'hasPhoto', receipt: 'hasReceipt' }

const nameSchema = pipe(string(), trim(), minLength(MINIMUM_NAME_LENGTH))

export const isName = (text: string) => is(nameSchema, text)

const optionalTextSchema = optional(
  pipe(
    string(),
    trim(),
    transform((text) => text || undefined),
  ),
)

const dayDateSchema = pipe(string(), check(isDayDate))

export const kindSchema = object({
  id: string(),
  name: nameSchema,
  colour: picklist(KIND_COLOURS),
  position: number(),
  createdAt: number(),
})

export type Kind = InferOutput<typeof kindSchema>

export const itemSchema = object({
  id: string(),
  year: pipe(number(), integer()),
  sequence: pipe(number(), integer(), minValue(FIRST_SEQUENCE)),
  name: nameSchema,
  boughtOn: dayDateSchema,
  createdAt: number(),
  price: optional(pipe(number(), check(isPriceAmount))),
  shop: optionalTextSchema,
  place: optionalTextSchema,
  kindId: optional(string()),
  note: optionalTextSchema,
  returnBy: optional(dayDateSchema),
  warrantyUntil: optional(dayDateSchema),
  returned: optional(boolean()),
  keeping: optional(boolean()),
  hasPhoto: optional(boolean()),
  hasReceipt: optional(boolean()),
})

export type Item = InferOutput<typeof itemSchema>

export const counterSchema = object({
  year: pipe(number(), integer()),
  last: pipe(number(), integer()),
})

export type Counter = InferOutput<typeof counterSchema>

export type Records = {
  items: Item[]
  kinds: Kind[]
}

export type StoredPhoto = {
  itemId: string
  role: PhotoRole
  bytes: ArrayBuffer
}

export type ShrunkPhoto = {
  photo: ArrayBuffer
  thumbnail: ArrayBuffer
}
