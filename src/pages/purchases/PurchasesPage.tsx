import { IonContent, IonPage } from '@ionic/react'
import { useDeferredValue, useState } from 'react'
import { useToday } from '../../components/useToday'
import { useRecords } from '../../data/hooks'
import { newestFirst } from '../../domain/itemOrder'
import { kindIdOf } from '../../domain/kinds'
import { searchItems } from '../../domain/search'
import type { Records } from '../../domain/types'
import { PURCHASES_COPY } from './copy'
import { ItemGrid } from './ItemGrid'
import { KindFilter } from './KindFilter'
import { LeadPiece } from './LeadPiece'
import { MonthLine } from './MonthLine'
import { NewItemButtons } from './NewItemButtons'
import './purchases.css'
import { SearchField } from './SearchField'
import { wallItems } from './wallItems'

function PurchasesWall({ records, today }: { records: Records; today: string }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [chosenKindId, setChosenKindId] = useState<string>()
  const isSearching = Boolean(deferredQuery.trim())
  const { lead, moreClosing, others } = wallItems(records.items, today)
  const gridItems = isSearching ? searchItems(newestFirst(records.items), deferredQuery) : others

  const shownItems = chosenKindId
    ? gridItems.filter((item) => kindIdOf(records.kinds, item.kindId) === chosenKindId)
    : gridItems

  return (
    <>
      <MonthLine items={records.items} today={today} />
      <SearchField query={query} onQueryChange={setQuery} />
      {!isSearching && lead && <LeadPiece item={lead} today={today} moreClosing={moreClosing} />}
      <KindFilter kinds={records.kinds} chosenId={chosenKindId} onChoose={setChosenKindId} />
      <ItemGrid items={shownItems} />
    </>
  )
}

export function PurchasesPage() {
  const records = useRecords()
  const today = useToday()

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body page-body-camera">
          <h1 className="wall-title">{PURCHASES_COPY.title}</h1>
          {records &&
            (records.items.length ? (
              <PurchasesWall records={records} today={today} />
            ) : (
              <p className="empty-note">{PURCHASES_COPY.noItems}</p>
            ))}
        </div>
        <NewItemButtons />
      </IonContent>
    </IonPage>
  )
}
