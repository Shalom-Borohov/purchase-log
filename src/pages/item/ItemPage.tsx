import { IonContent, IonPage } from '@ionic/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ItemLabel } from '../../components/ItemLabel'
import { LitTile } from '../../components/LitTile'
import { useToday } from '../../components/useToday'
import { useRecords } from '../../data/hooks'
import { kindOf } from '../../domain/kinds'
import { ItemSheet } from '../itemSheet/ItemSheet'
import { ITEM_PAGE_COPY } from './copy'
import { DeleteItemButton } from './DeleteItemButton'
import { ItemActions } from './ItemActions'
import { ItemHeader } from './ItemHeader'
import { ItemPapers } from './ItemPapers'
import { SameShopRail } from './SameShopRail'
import './item.css'

export function ItemPage() {
  const { itemId } = useParams()
  const records = useRecords()
  const [isEditing, setIsEditing] = useState(false)
  const item = records?.items.find(({ id }) => id === itemId)
  const today = useToday()

  return (
    <IonPage>
      <ItemHeader onEdit={item && (() => setIsEditing(true))} />
      <IonContent>
        {records && !item && <p className="empty-note">{ITEM_PAGE_COPY.notFound}</p>}
        {records && item && (
          <div className="page-body item-page">
            <LitTile item={item} size="piece" />
            <div className="item-page-label">
              <ItemLabel item={item} today={today} kind={kindOf(records.kinds, item.kindId)} isPageHeading />
            </div>
            <ItemActions item={item} today={today} />
            <SameShopRail item={item} items={records.items} />
            <ItemPapers item={item} today={today} />
            <DeleteItemButton item={item} />
            <ItemSheet isOpen={isEditing} item={item} onClose={() => setIsEditing(false)} />
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}
