const TABS_PATH = '/tabs'

export const PURCHASES_PATH = `${TABS_PATH}/purchases`

export const ATTENTION_PATH = `${PURCHASES_PATH}/attention`

export const SHOPS_PATH = `${TABS_PATH}/shops`

export const SUMMARY_PATH = `${TABS_PATH}/summary`

const SUMMARY_ITEMS_PATH = `${SUMMARY_PATH}/items`

export const SETTINGS_PATH = `${TABS_PATH}/settings`

const SHOP_ITEMS_PATH = `${SHOPS_PATH}/items`

const PATH_SEPARATOR = '/'

export const purchasesItemPath = (itemId: string) => `${PURCHASES_PATH}/${itemId}`

export const shopPath = (shopKey: string) => `${SHOPS_PATH}/${encodeURIComponent(shopKey)}`

export const shopsItemPath = (itemId: string) => `${SHOP_ITEMS_PATH}/${itemId}`

export const summaryItemPath = (itemId: string) => `${SUMMARY_ITEMS_PATH}/${itemId}`

export const summaryItemsPath = (filter: Record<string, string>) =>
  `${SUMMARY_ITEMS_PATH}?${new URLSearchParams(filter)}`

export type ItemStack = 'purchases' | 'shops' | 'summary'

export const STACK_ROOTS: Record<ItemStack, string> = {
  purchases: PURCHASES_PATH,
  shops: SHOPS_PATH,
  summary: SUMMARY_PATH,
}

const STACK_ITEM_PATHS: Record<ItemStack, (itemId: string) => string> = {
  purchases: purchasesItemPath,
  shops: shopsItemPath,
  summary: summaryItemPath,
}

const NESTED_STACKS: ItemStack[] = ['shops', 'summary']

export const itemStackOf = (pathname: string): ItemStack =>
  NESTED_STACKS.find((stack) => pathname.startsWith(`${STACK_ROOTS[stack]}${PATH_SEPARATOR}`)) ?? 'purchases'

export const itemPathInStack = (pathname: string, itemId: string) => STACK_ITEM_PATHS[itemStackOf(pathname)](itemId)
