import { useIonAlert } from '@ionic/react'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { isName } from '../../domain/types'
import { SETTINGS_COPY } from './copy'

const NAME_INPUT = 'name'

const KEEP_ALERT_OPEN = false

type NamePrompt = {
  header: string
  currentName?: string
  save: (name: string) => Promise<void>
}

const isNameInput = (values: unknown): values is { [NAME_INPUT]: string } =>
  typeof values === 'object' && values !== null && NAME_INPUT in values && typeof values[NAME_INPUT] === 'string'

export function useKindNamePrompt() {
  const [presentAlert] = useIonAlert()
  const toast = useMessageToast()

  return ({ header, currentName, save }: NamePrompt) =>
    void presentAlert({
      header,
      inputs: [
        {
          name: NAME_INPUT,
          type: 'text',
          value: currentName,
          placeholder: SETTINGS_COPY.kindName,
          attributes: { 'aria-label': SETTINGS_COPY.kindName, dir: 'auto' },
        },
      ],
      buttons: [
        { text: COMMON_COPY.cancel, role: 'cancel' },
        {
          text: COMMON_COPY.save,
          handler: (values: unknown) => {
            if (!isNameInput(values) || !isName(values[NAME_INPUT])) {
              return KEEP_ALERT_OPEN
            }

            void save(values[NAME_INPUT].trim()).catch(() => toast(COMMON_COPY.actionFailed))
          },
        },
      ],
    })
}
