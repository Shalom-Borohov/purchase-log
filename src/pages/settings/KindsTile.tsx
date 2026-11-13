import { useIonActionSheet } from '@ionic/react'
import { useId } from 'react'
import { PlusIcon } from '../../components/icons'
import { KindDot } from '../../components/KindDot'
import { useConfirmDelete } from '../../components/useConfirmDelete'
import { COMMON_COPY } from '../../copy/common'
import { useRecords } from '../../data/hooks'
import { addKind, deleteKind, renameKind } from '../../data/repo'
import { OTHER_KIND_ID } from '../../domain/kinds'
import type { Kind } from '../../domain/types'
import { SETTINGS_COPY } from './copy'
import { useKindNamePrompt } from './useKindNamePrompt'

const stayOnSettings = () => {}

type KindRowProps = {
  kind: Kind
  otherKind: Kind | undefined
}

function KindRow({ kind, otherKind }: KindRowProps) {
  const promptName = useKindNamePrompt()
  const confirmDelete = useConfirmDelete()
  const [presentActions] = useIonActionSheet()

  const askRename = () =>
    promptName({
      header: SETTINGS_COPY.renameKindOf(kind.name),
      currentName: kind.name,
      save: (name) => renameKind(kind.id, name),
    })

  const askDelete = (movedTo: Kind) =>
    confirmDelete({
      header: COMMON_COPY.deleteQuestion(kind.name),
      message: SETTINGS_COPY.deleteKindMessage(movedTo.name),
      remove: () => deleteKind(kind.id),
      onDeleted: stayOnSettings,
    })

  const deleteActions =
    otherKind && kind.id !== OTHER_KIND_ID
      ? [{ text: COMMON_COPY.delete, role: 'destructive', handler: () => askDelete(otherKind) }]
      : []

  const showActions = () =>
    void presentActions({
      header: kind.name,
      buttons: [
        { text: SETTINGS_COPY.rename, handler: askRename },
        ...deleteActions,
        { text: COMMON_COPY.cancel, role: 'cancel' },
      ],
    })

  return (
    <li className="settings-kind">
      <button type="button" className="settings-kind-name" aria-haspopup="menu" onClick={showActions}>
        <KindDot kind={kind} />
      </button>
    </li>
  )
}

export function KindsTile() {
  const headingId = useId()
  const records = useRecords()
  const promptName = useKindNamePrompt()
  const otherKind = records?.kinds.find(({ id }) => id === OTHER_KIND_ID)

  async function saveNewKind(name: string) {
    await addKind(name, Date.now())
  }

  const askNewKind = () => promptName({ header: SETTINGS_COPY.addKind, save: saveNewKind })

  return (
    <section className="panel settings-tile" aria-labelledby={headingId}>
      <h2 id={headingId}>{SETTINGS_COPY.kinds}</h2>
      <ul className="settings-kinds" aria-labelledby={headingId}>
        {records?.kinds.map((kind) => <KindRow key={kind.id} kind={kind} otherKind={otherKind} />)}
      </ul>
      <button type="button" className="quiet-button settings-action" onClick={askNewKind}>
        <PlusIcon />
        {SETTINGS_COPY.addKind}
      </button>
    </section>
  )
}
