import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react'
import { useParams } from 'react-router-dom'
import { COMMON_COPY } from '../../copy/common'
import { shortDate } from '../../copy/formats'
import { joinParts } from '../../copy/joinParts'
import { useRecords } from '../../data/hooks'
import { itemsAtShop, type ShopGroup, shopGroups } from '../../domain/shops'
import { SHOPS_PATH, shopsItemPath } from '../../navigation/paths'
import { SHOPS_COPY } from './copy'
import { ItemRow } from '../../components/ItemRow'
import './shops.css'

function ShopDetails({ group }: { group: ShopGroup }) {
  return (
    <>
      <h1 className="wall-title">
        <bdi>{group.name}</bdi>
      </h1>
      {group.places.length > 0 && <p className="wall-subtitle">{joinParts(group.places)}</p>}
      <div className="shop-page-facts">
        <p className="shop-page-total num">{COMMON_COPY.shekels(group.total)}</p>
        <p className="quiet-text">{COMMON_COPY.itemCount(group.count)}</p>
      </div>
      <h2 className="section-heading">{SHOPS_COPY.itemsHeading}</h2>
      <ul className="item-rows">
        {group.items.map((item) => (
          <ItemRow key={item.id} item={item} details={shortDate(item.boughtOn)} to={shopsItemPath(item.id)} />
        ))}
      </ul>
    </>
  )
}

export function ShopPage() {
  const { shopKey } = useParams()
  const records = useRecords()
  const shownKey = shopKey && decodeURIComponent(shopKey)
  const [group] = records && shownKey ? shopGroups(itemsAtShop(records.items, shownKey)) : []

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={SHOPS_PATH} text={COMMON_COPY.shops} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="page-body">
          {records && !group && <p className="empty-note">{SHOPS_COPY.notFound}</p>}
          {group && <ShopDetails group={group} />}
        </div>
      </IonContent>
    </IonPage>
  )
}
