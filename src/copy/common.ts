const SINGLE = 1

export const COMMON_COPY = {
  purchases: 'רכישות',
  shops: 'חנויות',
  summary: 'סיכום',
  settings: 'הגדרות',
  back: 'חזרה',
  cancel: 'ביטול',
  close: 'סגירה',
  save: 'שמירה',
  edit: 'עריכה',
  delete: 'מחיקה',
  actionFailed: 'הפעולה לא הצליחה',
  separator: ' · ',
  shekels: (amount: number) => `₪${amount.toLocaleString('he-IL', { maximumFractionDigits: 2 })}`,
  itemCount: (count: number) => (count === SINGLE ? 'פריט אחד' : `${count} פריטים`),
  deleteQuestion: (name: string) => `למחוק את ${name}?`,
  photoCount: (count: number) => (count === SINGLE ? 'תמונה אחת' : `${count} תמונות`),
} as const
