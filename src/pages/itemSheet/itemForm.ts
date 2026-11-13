import type { ItemDraft } from '../../data/repo'
import { addDays, isDayDate, todayDate } from '../../domain/dayDate'
import { INVALID_PRICE, parsePriceText } from '../../domain/price'
import { returnDaysAtShop } from '../../domain/shops'
import { isName, type Item } from '../../domain/types'

export type ItemFormState = {
  name: string
  priceText: string
  shop: string
  place: string
  kindId?: string
  boughtOn: string
  returnBy: string
  isReturnByChosen: boolean
  warrantyUntil: string
  note: string
}

const NO_TEXT = ''

const inputText = (text: string | undefined) => text ?? NO_TEXT

const optionalDate = (text: string) => (isDayDate(text) ? text : undefined)

const lastEntered = (items: Item[]) =>
  items.reduce<Item | undefined>(
    (latest, item) => (latest && latest.createdAt >= item.createdAt ? latest : item),
    undefined,
  )

function enteredToday(items: Item[], today: string) {
  const last = lastEntered(items)

  return last && todayDate(new Date(last.createdAt)) === today ? last : undefined
}

export function newItemForm(items: Item[], today: string): ItemFormState {
  const carried = enteredToday(items, today)

  return {
    name: NO_TEXT,
    priceText: NO_TEXT,
    shop: inputText(carried?.shop),
    place: inputText(carried?.place),
    boughtOn: carried ? carried.boughtOn : today,
    returnBy: NO_TEXT,
    isReturnByChosen: false,
    warrantyUntil: NO_TEXT,
    note: NO_TEXT,
  }
}

export const formFromItem = (item: Item): ItemFormState => ({
  name: item.name,
  priceText: item.price === undefined ? NO_TEXT : String(item.price),
  shop: inputText(item.shop),
  place: inputText(item.place),
  kindId: item.kindId,
  boughtOn: item.boughtOn,
  returnBy: inputText(item.returnBy),
  isReturnByChosen: true,
  warrantyUntil: inputText(item.warrantyUntil),
  note: inputText(item.note),
})

function shopReturnBy(items: Item[], { shop, boughtOn }: ItemFormState) {
  const days = returnDaysAtShop(items, shop)

  return days === undefined ? NO_TEXT : addDays(boughtOn, days)
}

export const withShopReturn = (form: ItemFormState, items: Item[]): ItemFormState =>
  form.isReturnByChosen ? form : { ...form, returnBy: shopReturnBy(items, form) }

export const isFormChanged = (form: ItemFormState, openedForm: ItemFormState) =>
  JSON.stringify(form) !== JSON.stringify(openedForm)

export const isPriceValid =(priceText: string) => parsePriceText(priceText) !== INVALID_PRICE

export function draftOf(form: ItemFormState): ItemDraft | undefined {
  const price = parsePriceText(form.priceText)

  if (!isName(form.name) || price === INVALID_PRICE) {
    return undefined
  }

  return {
    name: form.name,
    price,
    shop: form.shop,
    place: form.place,
    kindId: form.kindId,
    boughtOn: form.boughtOn,
    returnBy: optionalDate(form.returnBy),
    warrantyUntil: optionalDate(form.warrantyUntil),
    note: form.note,
  }
}
