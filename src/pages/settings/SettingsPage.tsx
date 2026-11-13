import { IonContent, IonPage } from '@ionic/react'
import { BackupTile } from './BackupTile'
import { SETTINGS_COPY } from './copy'
import { FeedbackTile } from './FeedbackTile'
import { KindsTile } from './KindsTile'
import './settings.css'

export function SettingsPage() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body">
          <h1 className="wall-title">{SETTINGS_COPY.title}</h1>
          <div className="settings-stack">
            <KindsTile />
            <BackupTile />
            <FeedbackTile />
            <p className="quiet-text settings-version">{SETTINGS_COPY.version(__APP_VERSION__, __APP_BUILT_AT__)}</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
