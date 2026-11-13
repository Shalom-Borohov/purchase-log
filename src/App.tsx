import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactHashRouter } from '@ionic/react-router'
import { Navigate, Route } from 'react-router-dom'
import { RecordsProvider } from './data/RecordsProvider'
import { PURCHASES_PATH } from './navigation/paths'
import { Tabs } from './Tabs'

export function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route path="/tabs/*" element={<Tabs />} />
      <Route path="/" element={<Navigate to={PURCHASES_PATH} replace />} />
    </IonRouterOutlet>
  )
}

export function App() {
  return (
    <IonApp>
      <RecordsProvider>
        <IonReactHashRouter>
          <AppRoutes />
        </IonReactHashRouter>
      </RecordsProvider>
    </IonApp>
  )
}
