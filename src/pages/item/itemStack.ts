import { useLocation } from 'react-router-dom'
import { COMMON_COPY } from '../../copy/common'
import { type ItemStack, itemStackOf, STACK_ROOTS } from '../../navigation/paths'

const STACK_NAMES: Record<ItemStack, string> = {
  purchases: COMMON_COPY.purchases,
  shops: COMMON_COPY.shops,
  summary: COMMON_COPY.summary,
}

export function useItemStack() {
  const stack = itemStackOf(useLocation().pathname)

  return { root: STACK_ROOTS[stack], name: STACK_NAMES[stack] }
}
