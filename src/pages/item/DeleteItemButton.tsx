import { useIonRouter } from '@ionic/react'
import { useConfirmDelete } from '../../components/useConfirmDelete'
import { COMMON_COPY } from '../../copy/common'
import { deleteItem } from '../../data/repo'
import type { Item } from '../../domain/types'
import { ITEM_PAGE_COPY } from './copy'
import { useItemStack } from './itemStack'

export function DeleteItemButton({ item }: { item: Item }) {
  const router = useIonRouter()
  const stack = useItemStack()
  const confirmDeletion = useConfirmDelete()

  function leavePage() {
    if (router.canGoBack()) {
      router.goBack()

      return
    }

    router.push(stack.root, 'back', 'replace')
  }

  const confirmDelete = () =>
    confirmDeletion({
      header: COMMON_COPY.deleteQuestion(item.name),
      message: ITEM_PAGE_COPY.deleteWarning,
      remove: () => deleteItem(item.id),
      onDeleted: leavePage,
    })

  return (
    <button type="button" className="danger-button item-delete" onClick={confirmDelete}>
      {COMMON_COPY.delete}
    </button>
  )
}
