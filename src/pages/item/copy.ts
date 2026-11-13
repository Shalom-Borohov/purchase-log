import { ITEM_COPY } from '../../copy/itemCopy'

export const ITEM_PAGE_COPY = {
  notFound: 'הפריט לא נמצא',
  returned: ITEM_COPY.returned,
  notReturned: 'לא הוחזר',
  keeping: 'נשאר אצלי',
  addToCalendar: 'הוספה ליומן',
  tapAgain: 'צריך ללחוץ שוב על הוספה ליומן',
  returnEventTitle: (name: string) => `להחזיר: ${name}`,
  warrantyEventTitle: (name: string) => `האחריות נגמרת: ${name}`,
  fromShop: (shop: string) => `עוד מ${shop}`,
  papers: 'קבלה ואחריות',
  receipt: 'קבלה',
  receiptOf: (name: string) => `קבלה: ${name}`,
  addWarrantyToCalendar: 'הוספה ליומן: סוף האחריות',
  deleteWarning: 'גם התמונה והקבלה שלו יימחקו.',
} as const
