import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react'
import { COMMON_COPY } from '../../copy/common'
import type { Item } from '../../domain/types'
import { usePhotoUrl } from '../../photo/usePhotoUrl'
import { ITEM_PAGE_COPY } from './copy'

type ReceiptModalProps = {
  item: Item
  isOpen: boolean
  onClose: () => void
}

function ReceiptPhoto({ item }: { item: Item }) {
  const url = usePhotoUrl(item.id, 'receipt')

  return url ? <img className="item-receipt-photo" src={url} alt={ITEM_PAGE_COPY.receiptOf(item.name)} /> : null
}

export function ReceiptModal({ item, isOpen, onClose }: ReceiptModalProps) {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{ITEM_PAGE_COPY.receipt}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>{COMMON_COPY.close}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{isOpen && <ReceiptPhoto item={item} />}</IonContent>
    </IonModal>
  )
}
