import { useMemo, useState } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { PlusIcon } from '../../components/icons'
import { TextField } from '../../components/TextField'
import { shopSuggestions } from '../../domain/shops'
import type { Item } from '../../domain/types'
import { ITEM_SHEET_COPY } from './copy'
import { chipFor, placeSuggestions, recentShops } from './shopChoices'

type ShopFieldsProps = {
  items: Item[]
  shop: string
  place: string
  onShopChange: (shop: string) => void
  onPlaceChange: (place: string) => void
}

const NO_SHOP = ''

const SHOP_FIELD = 'shop'

const PLACE_FIELD = 'place'

export function ShopFields({ items, shop, place, onShopChange, onPlaceChange }: ShopFieldsProps) {
  const shops = useMemo(() => shopSuggestions(items), [items])
  const places = useMemo(() => placeSuggestions(items, shop), [items, shop])
  const chips = recentShops(shops)
  const matchingChip = chipFor(chips, shop)
  const [isOtherShop, setIsOtherShop] = useState(() => shop !== NO_SHOP && !matchingChip)
  const chosenChip = isOtherShop ? undefined : matchingChip

  function chooseChip(chip: string | undefined) {
    setIsOtherShop(false)
    onShopChange(chip ?? NO_SHOP)
  }

  function toggleOtherShop() {
    setIsOtherShop(!isOtherShop)
    onShopChange(NO_SHOP)
  }

  return (
    <section className="item-sheet-section">
      <h2 className="item-sheet-heading">{ITEM_SHEET_COPY.shop}</h2>
      <div className="item-sheet-chips">
        <ChoiceGroup
          className="item-sheet-chip-group"
          choices={chips}
          chosen={chosenChip}
          labelOf={(chip) => chip}
          tapAgainClears
          onChoose={chooseChip}
        />
        <button
          type="button"
          className="choice item-sheet-other-shop"
          aria-pressed={isOtherShop}
          onClick={toggleOtherShop}
        >
          <PlusIcon />
          {ITEM_SHEET_COPY.otherShop}
        </button>
      </div>
      <div className="item-sheet-text-fields">
        {isOtherShop && (
          <TextField
            label={ITEM_SHEET_COPY.shopName}
            name={SHOP_FIELD}
            defaultValue={shop}
            suggestions={shops}
            onTextChange={onShopChange}
          />
        )}
        <TextField
          label={ITEM_SHEET_COPY.place}
          name={PLACE_FIELD}
          defaultValue={place}
          suggestions={places}
          onTextChange={onPlaceChange}
        />
      </div>
    </section>
  )
}
