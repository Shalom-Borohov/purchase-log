import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react'
import { Link } from 'react-router-dom'
import { LitTile } from '../../components/LitTile'
import { useToday } from '../../components/useToday'
import { COMMON_COPY } from '../../copy/common'
import { returnStatus } from '../../copy/itemCopy'
import { useRecords } from '../../data/hooks'
import { attentionItems, returnWindow } from '../../domain/returnWindow'
import type { Item } from '../../domain/types'
import { PURCHASES_PATH, purchasesItemPath } from '../../navigation/paths'
import { PURCHASES_COPY } from './copy'
import './purchases.css'

function AttentionRow({ item, today }: { item: Item; today: string }) {
  const window = returnWindow(item, today)

  return (
    <Link className="attention-row" to={purchasesItemPath(item.id)}>
      <LitTile item={item} size="row" />
      <span className="attention-row-text">
        <span className="attention-row-name">{item.name}</span>
        {window && <span className="attention-row-status">{returnStatus(window)}</span>}
      </span>
    </Link>
  )
}

export function AttentionPage() {
  const records = useRecords()
  const today = useToday()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={PURCHASES_PATH} text={COMMON_COPY.purchases} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="page-body">
          <h1 className="wall-title">{PURCHASES_COPY.closingTitle}</h1>
          {records && (
            <ul className="attention-list" aria-label={PURCHASES_COPY.closingTitle}>
              {attentionItems(records.items, today).map((item) => (
                <li key={item.id}>
                  <AttentionRow item={item} today={today} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}
