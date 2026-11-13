import { addDays, addYears } from '../../domain/dayDate'

export const RETURN_PICKS = ['twoDays', 'twoWeeks', 'month'] as const

type ReturnPick = (typeof RETURN_PICKS)[number]

const RETURN_PICK_DAYS: Record<ReturnPick, number> = { twoDays: 2, twoWeeks: 14, month: 30 }

export const WARRANTY_PICKS = ['oneYear', 'twoYears', 'threeYears'] as const

type WarrantyPick = (typeof WARRANTY_PICKS)[number]

const WARRANTY_PICK_YEARS: Record<WarrantyPick, number> = { oneYear: 1, twoYears: 2, threeYears: 3 }

export const returnPickDate = (boughtOn: string, pick: ReturnPick) => addDays(boughtOn, RETURN_PICK_DAYS[pick])

export const warrantyPickDate = (boughtOn: string, pick: WarrantyPick) =>
  addYears(boughtOn, WARRANTY_PICK_YEARS[pick])

type PickedDates = {
  boughtOn: string
  returnBy: string
  warrantyUntil: string
}

function followPick<Pick extends string>(
  picks: readonly Pick[],
  dateOf: (boughtOn: string, pick: Pick) => string,
  date: string,
  from: string,
  to: string,
) {
  const pick = picks.find((candidate) => dateOf(from, candidate) === date)

  return pick ? dateOf(to, pick) : date
}

export const withPurchaseDate = (dates: PickedDates, boughtOn: string): PickedDates => ({
  boughtOn,
  returnBy: followPick(RETURN_PICKS, returnPickDate, dates.returnBy, dates.boughtOn, boughtOn),
  warrantyUntil: followPick(WARRANTY_PICKS, warrantyPickDate, dates.warrantyUntil, dates.boughtOn, boughtOn),
})
