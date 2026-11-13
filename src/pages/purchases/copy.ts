import { COMMON_COPY } from '../../copy/common'

export const PURCHASES_COPY = {
  title: COMMON_COPY.purchases,
  allItems: 'כל הרכישות',
  searchPlaceholder: 'חיפוש פריט או חנות',
  kindFilter: 'סינון לפי סוג',
  newItemCamera: 'צילום רכישה חדשה',
  newItemWithoutPhoto: 'בלי תמונה',
  noItems: 'עוד אין כאן רכישות. הראשונה מתחילה בצילום למטה.',
  moreClosing: (count: number) => `ועוד ${count}`,
  closingTitle: 'להחזרה בקרוב',
} as const
