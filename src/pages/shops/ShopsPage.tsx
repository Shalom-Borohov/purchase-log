import { IonContent, IonPage } from '@ionic/react'
import { useState } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { useRecords } from '../../data/hooks'
import { SHOP_ORDERS, type ShopGroup, type ShopOrder, shopGroups, sortShops } from '../../domain/shops'
import { SHOPS_COPY } from './copy'
import { ShopRankRow } from './ShopRankRow'
import './shops.css'

const NO_TOTAL = 0

function ShopRanking({ groups }: { groups: ShopGroup[] }) {
  const [order, setOrder] = useState<ShopOrder>('total')
  const topTotal = Math.max(NO_TOTAL, ...groups.map(({ total }) => total))

  return (
    <>
      <ChoiceGroup
        label={SHOPS_COPY.orderLabel}
        className="segmented shops-order"
        choices={SHOP_ORDERS}
        chosen={order}
        labelOf={(choice) => SHOPS_COPY.orders[choice]}
        onChoose={setOrder}
      />
      <ol className="shop-rank-list">
        {sortShops(groups, order).map((group) => (
          <ShopRankRow key={group.key} group={group} topTotal={topTotal} />
        ))}
      </ol>
    </>
  )
}

export function ShopsPage() {
  const records = useRecords()
  const groups = records && shopGroups(records.items)

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body">
          <h1 className="wall-title">{SHOPS_COPY.title}</h1>
          {groups && groups.length === 0 && <p className="empty-note">{SHOPS_COPY.empty}</p>}
          {groups && groups.length > 0 && <ShopRanking groups={groups} />}
        </div>
      </IonContent>
    </IonPage>
  )
}
