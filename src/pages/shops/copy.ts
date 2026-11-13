import { COMMON_COPY } from '../../copy/common'
import type { ShopOrder } from '../../domain/shops'

export const SHOPS_COPY = {
  title: COMMON_COPY.shops,
  orderLabel: 'מיון',
  orders: { total: 'סכום', recent: 'אחרונה', name: 'א-ב' } satisfies Record<ShopOrder, string>,
  empty: 'עדיין אין חנויות. חנות מופיעה כאן כשרושמים פריט עם שם החנות.',
  notFound: 'החנות הזו לא נמצאה.',
  itemsHeading: 'פריטים',
} as const
