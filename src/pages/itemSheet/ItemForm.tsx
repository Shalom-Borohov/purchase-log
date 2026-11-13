import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { todayDate } from '../../domain/dayDate'
import type { Item, Records } from '../../domain/types'
import { ITEM_SHEET_COPY } from './copy'
import { DatesPanel } from './DatesPanel'
import {
  draftOf,
  formFromItem,
  isFormChanged,
  type ItemFormState,
  newItemForm,
  withShopReturn,
} from './itemForm'
import { KindChips } from './KindChips'
import { NamePriceFields } from './NamePriceFields'
import { PhotoSlots } from './PhotoSlots'
import { saveItem } from './saveItem'
import { ShopFields } from './ShopFields'
import { usePhotoChanges } from './usePhotoChanges'

type ItemFormProps = {
  item: Item | undefined
  firstPhoto: File | undefined
  records: Records
  onCancel: () => void
  onSaved: (itemId: string) => void
  onDraftChange: (isDraftChanged: boolean) => void
}

export function ItemForm({
  item,
  firstPhoto,
  records: { items, kinds },
  onCancel,
  onSaved,
  onDraftChange,
}: ItemFormProps) {
  const [today] = useState(() => todayDate(new Date()))
  const [openedForm] = useState(() => (item ? formFromItem(item) : newItemForm(items, today)))
  const [form, setForm] = useState(openedForm)
  const [isSaving, setIsSaving] = useState(false)
  const photos = usePhotoChanges(firstPhoto)
  const toast = useMessageToast()
  const change = (changes: Partial<ItemFormState>) => setForm((current) => ({ ...current, ...changes }))
  const shownForm = withShopReturn(form, items)
  const draft = draftOf(shownForm)
  const isSaveDisabled = !draft || isSaving || photos.shrinkingRoles.length > 0
  const isDraftChanged = isFormChanged(form, openedForm) || photos.isChanged

  useEffect(() => onDraftChange(isDraftChanged), [isDraftChanged, onDraftChange])

  async function save() {
    if (!draft || isSaveDisabled) {
      return
    }

    setIsSaving(true)

    try {
      onSaved(await saveItem(item, draft, photos.changes))
    } catch {
      setIsSaving(false)
      void toast(COMMON_COPY.actionFailed)
    }
  }

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onCancel}>{COMMON_COPY.cancel}</IonButton>
          </IonButtons>
          <IonTitle>{item ? ITEM_SHEET_COPY.editItem : ITEM_SHEET_COPY.newItem}</IonTitle>
          <IonButtons slot="end">
            <IonButton className="item-sheet-save" strong disabled={isSaveDisabled} onClick={() => void save()}>
              {COMMON_COPY.save}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form className="item-sheet-body" onSubmit={(event) => event.preventDefault()}>
          <PhotoSlots
            itemId={item?.id}
            itemName={form.name}
            changes={photos.changes}
            shrinkingRoles={photos.shrinkingRoles}
            onPick={photos.pick}
            onRemove={photos.remove}
          />
          <NamePriceFields form={form} onChange={change} />
          <ShopFields
            items={items}
            shop={form.shop}
            place={form.place}
            onShopChange={(shop) => change({ shop })}
            onPlaceChange={(place) => change({ place })}
          />
          <KindChips kinds={kinds} kindId={form.kindId} onChange={(kindId) => change({ kindId })} />
          <DatesPanel form={shownForm} today={today} onChange={change} />
        </form>
      </IonContent>
    </>
  )
}
