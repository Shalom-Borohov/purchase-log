import { useIonActionSheet } from '@ionic/react'
import { ITEM_SHEET_COPY } from './copy'

const DROP_ROLE = 'destructive'

const KEEP_ROLE = 'cancel'

export function useDropDraftQuestion() {
  const [presentActionSheet] = useIonActionSheet()

  return () =>
    new Promise<boolean>((resolve) => {
      void presentActionSheet({
        buttons: [
          { text: ITEM_SHEET_COPY.dropDraft, role: DROP_ROLE },
          { text: ITEM_SHEET_COPY.keepEditing, role: KEEP_ROLE },
        ],
        onDidDismiss: ({ detail }) => resolve(detail.role === DROP_ROLE),
      })
    })
}
