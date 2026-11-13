import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { Navigate, Route } from 'react-router-dom'
import { PurchasesIcon, SettingsIcon, ShopsIcon, SummaryIcon } from './components/icons'
import { COMMON_COPY } from './copy/common'
import { PURCHASES_PATH, SETTINGS_PATH, SHOPS_PATH, SUMMARY_PATH } from './navigation/paths'
import { ItemPage } from './pages/item/ItemPage'
import { AttentionPage } from './pages/purchases/AttentionPage'
import { PurchasesPage } from './pages/purchases/PurchasesPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { ShopPage } from './pages/shops/ShopPage'
import { ShopsPage } from './pages/shops/ShopsPage'
import { SummaryItemsPage } from './pages/summary/SummaryItemsPage'
import { SummaryPage } from './pages/summary/SummaryPage'

export function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="purchases/attention" element={<AttentionPage />} />
        <Route path="purchases/:itemId" element={<ItemPage />} />
        <Route path="shops" element={<ShopsPage />} />
        <Route path="shops/items/:itemId" element={<ItemPage />} />
        <Route path="shops/:shopKey" element={<ShopPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="summary/items" element={<SummaryItemsPage />} />
        <Route path="summary/items/:itemId" element={<ItemPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route index element={<Navigate to="purchases" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="wall-tab-bar">
        <IonTabButton tab="purchases" href={PURCHASES_PATH}>
          <PurchasesIcon />
          <IonLabel>{COMMON_COPY.purchases}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="shops" href={SHOPS_PATH}>
          <ShopsIcon />
          <IonLabel>{COMMON_COPY.shops}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="summary" href={SUMMARY_PATH}>
          <SummaryIcon />
          <IonLabel>{COMMON_COPY.summary}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href={SETTINGS_PATH}>
          <SettingsIcon />
          <IonLabel>{COMMON_COPY.settings}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}
