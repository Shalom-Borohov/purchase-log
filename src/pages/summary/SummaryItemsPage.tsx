import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react'
import { useSearchParams } from 'react-router-dom'
import { COMMON_COPY } from '../../copy/common'
import { useRecords } from '../../data/hooks'
import { kindOf } from '../../domain/kinds'
import { spentTotal } from '../../domain/totals'
import type { Item, Records } from '../../domain/types'
import { SUMMARY_PATH, summaryItemPath } from '../../navigation/paths'
import { ItemRow } from '../../components/ItemRow'
import { shopAndDate } from '../../copy/itemCopy'
import { periodLabel, SUMMARY_COPY } from './copy'
import { filteredItems, filterFromParams, type ItemsFilter } from './itemsFilter'
import './summary.css'

function filterTitle(records: Records, filter: ItemsFilter, items: Item[]) {
  if (filter.kindId !== null) {
    return kindOf(records.kinds, filter.kindId)?.name
  }

  return filter.shopKey === null ? undefined : items.find(({ shop }) => shop)?.shop
}

function FilteredItems({ records, filter }: { records: Records; filter: ItemsFilter }) {
  const items = filteredItems(records, filter)
  const title = filterTitle(records, filter, items)

  return (
    <>
      <h1 className="wall-title">
        <bdi>{title ?? periodLabel(filter.period)}</bdi>
      </h1>
      {title && <p className="wall-subtitle">{periodLabel(filter.period)}</p>}
      {items.length === 0 ? (
        <p className="empty-note">{SUMMARY_COPY.noItems}</p>
      ) : (
        <>
          <div className="summary-items-total">
            <b className="summary-total-amount num">{COMMON_COPY.shekels(spentTotal(items))}</b>
            <span className="quiet-text">{COMMON_COPY.itemCount(items.length)}</span>
          </div>
          <ul className="item-rows">
            {items.map((item) => (
              <ItemRow key={item.id} item={item} details={shopAndDate(item)} to={summaryItemPath(item.id)} />
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export function SummaryItemsPage() {
  const records = useRecords()
  const [params] = useSearchParams()
  const filter = filterFromParams(params)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={SUMMARY_PATH} text={COMMON_COPY.summary} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="page-body">
          {records && !filter && <p className="empty-note">{SUMMARY_COPY.noItems}</p>}
          {records && filter && <FilteredItems records={records} filter={filter} />}
        </div>
      </IonContent>
    </IonPage>
  )
}
