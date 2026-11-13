import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { addItem, allItems, allKinds } from '../../src/data/repo'
import { OTHER_KIND_ID } from '../../src/domain/kinds'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import {
  actionSheetButtons,
  actionSheetShown,
  alertDismissed,
  alertHeader,
  alertMessage,
  alertShown,
  clickActionSheetButton,
  clickAlertButton,
} from '../helpers/overlays'
import { shrunkPhoto } from '../helpers/photo'
import { item, kind } from '../helpers/records'
import { renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 13, 9, 30).getTime()

const DEFAULT_KIND_NAMES = ['בגדים', 'נעליים', 'אלקטרוניקה', 'בית', 'ספורט', 'אחר']

const ALERT_SETTLE_MS = 300

const versionLine = new RegExp(
  `^גרסה ${__APP_VERSION__.replaceAll('.', '\\.')} · עודכנה \\d{1,2}\\.\\d{1,2}\\.\\d{4}, \\d{1,2}:\\d{2}$`,
)

const BACKUP_NAME = 'purchases-backup-2026-11-13.zip'

type ShareMock = ReturnType<typeof vi.fn<(shared: ShareData) => Promise<void>>>

const toasts = () => Array.from(document.querySelectorAll('ion-toast'), (toast) => toast.message)

const itemNamesStored = async () => (await allItems()).map(({ name }) => name).toSorted()

const backupArchive = () =>
  zipSync({
    'data.json': strToU8(
      JSON.stringify({
        version: 1,
        exportedAt: NOW,
        items: [item({ id: 'lamp', name: 'מנורה', kindId: 'lights' })],
        kinds: [
          kind({ id: 'lights', name: 'תאורה' }),
          kind({ id: OTHER_KIND_ID, name: 'אחר', colour: 'grey', position: 1 }),
        ],
        counters: [{ year: 2026, last: 1 }],
      }),
    ),
  })

function sharedFile(share: ShareMock, call: number) {
  const [file] = share.mock.calls[call][0].files ?? []

  if (!file) {
    throw new Error('nothing shared')
  }

  return file
}

function chooseFile(bytes: Uint8Array<ArrayBuffer>) {
  fireEvent.change(screen.getByLabelText('קובץ גיבוי'), {
    target: { files: [new File([bytes], 'backup.zip', { type: 'application/zip' })] },
  })
}

async function exportBackupWith(share: ShareMock) {
  Object.assign(navigator, { share, canShare: () => true })
  renderAt('/tabs/settings')
  fireEvent.click(await screen.findByRole('button', { name: 'ייצוא גיבוי' }))
}

async function seedPurchases() {
  const photos = {
    item: shrunkPhoto(new Uint8Array([1, 2, 3]).buffer, new Uint8Array([4]).buffer),
    receipt: shrunkPhoto(new Uint8Array([5, 6]).buffer, new Uint8Array([7]).buffer),
  }

  await addItem({ name: 'מעיל', boughtOn: '2026-11-10', shop: 'זארה', kindId: 'clothes' }, photos, NOW)
  await addItem({ name: 'כבל', boughtOn: '2026-11-11' }, {}, NOW)
}

const kindNamesStored = async () => (await allKinds()).map(({ name }) => name)

function alertInput() {
  const inputs = document.querySelectorAll('ion-alert input')
  const input = inputs.item(inputs.length - 1)

  if (!input) {
    throw new Error('no alert input')
  }

  return input
}

const typeInAlert = (text: string) => fireEvent.input(alertInput(), { target: { value: text } })

async function openKindActions(kindName: string) {
  const shown = actionSheetShown()

  fireEvent.click(await screen.findByRole('button', { name: kindName }))
  await shown
}

async function shownKindNames() {
  const list = await screen.findByRole('list', { name: 'סוגים' })

  return within(list)
    .getAllByRole('listitem')
    .map((row) => row.querySelector('.kind-dot')?.textContent)
}

describe('settings', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  afterEach(() => {
    vi.restoreAllMocks()
    Object.assign(navigator, { share: undefined, canShare: undefined })
  })

  it('lists the kinds in order, each with its name', async () => {
    renderAt('/tabs/settings')

    expect(await shownKindNames()).toEqual(DEFAULT_KIND_NAMES)
    expect(screen.getByRole('heading', { level: 1, name: 'הגדרות' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).map(({ textContent }) => textContent)).toEqual([
      'סוגים',
      'גיבוי',
      'משוב',
    ])
  })

  it('adds a kind at the end of the list', async () => {
    renderAt('/tabs/settings')

    const shown = alertShown()

    fireEvent.click(await screen.findByRole('button', { name: 'סוג חדש' }))
    await shown
    typeInAlert('תיקים')
    clickAlertButton('שמירה')

    await waitFor(async () => expect(await shownKindNames()).toEqual([...DEFAULT_KIND_NAMES, 'תיקים']))
  })

  it('renames a kind from its row, starting from its current name', async () => {
    renderAt('/tabs/settings')
    await openKindActions('נעליים')

    const shown = alertShown()

    clickActionSheetButton('שינוי שם')
    await shown

    expect(alertInput()).toHaveValue('נעליים')

    typeInAlert('נעלי ספורט')
    clickAlertButton('שמירה')

    await waitFor(async () =>
      expect(await shownKindNames()).toEqual(['בגדים', 'נעלי ספורט', 'אלקטרוניקה', 'בית', 'ספורט', 'אחר']),
    )
  })

  it('deletes a kind after confirming and moves its items to אחר', async () => {
    await db.items.add(item({ id: 'sneakers', name: 'נעלי ריצה', kindId: 'shoes' }))
    renderAt('/tabs/settings')
    await openKindActions('נעליים')

    const shown = alertShown()

    clickActionSheetButton('מחיקה')
    await shown

    expect(alertHeader()).toBe('למחוק את נעליים?')
    expect(alertMessage()).toBe('הפריטים מהסוג הזה יעברו לאחר.')

    clickAlertButton('מחיקה')

    await waitFor(async () =>
      expect(await shownKindNames()).toEqual(['בגדים', 'אלקטרוניקה', 'בית', 'ספורט', 'אחר']),
    )
    expect((await allItems()).map(({ kindId }) => kindId)).toEqual([OTHER_KIND_ID])
  })

  it('offers renaming but no delete for אחר, and no delete words on the list itself', async () => {
    renderAt('/tabs/settings')
    await openKindActions('ספורט')

    expect(actionSheetButtons()).toEqual(['שינוי שם', 'מחיקה', 'ביטול'])

    clickActionSheetButton('ביטול')
    await openKindActions('אחר')

    expect(actionSheetButtons()).toEqual(['שינוי שם', 'ביטול'])
    expect(within(screen.getByRole('list', { name: 'סוגים' })).queryByText('מחיקה')).not.toBeInTheDocument()
  })

  it('says what the backup holds and shows the version with its build time', async () => {
    await seedPurchases()
    renderAt('/tabs/settings')

    expect(await screen.findByText('2 פריטים · 2 תמונות')).toBeVisible()
    expect(screen.getByText(/רק בטלפון הזה/)).toBeVisible()
    expect(screen.getByText(versionLine)).toBeVisible()
  })

  it('exports a dated zip through the share sheet', async () => {
    await seedPurchases()

    const share: ShareMock = vi.fn<(shared: ShareData) => Promise<void>>().mockResolvedValue()

    await exportBackupWith(share)
    await waitFor(() => expect(share).toHaveBeenCalledOnce())

    const file = sharedFile(share, 0)
    const files = unzipSync(new Uint8Array(await file.arrayBuffer()))

    expect(file.name).toBe(BACKUP_NAME)
    expect(file.type).toBe('application/zip')
    expect(JSON.parse(strFromU8(files['data.json'])).items).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'מעיל' }), expect.objectContaining({ name: 'כבל' })]),
    )
  })

  it('offers a second tap to share when iOS refuses the first one', async () => {
    const share: ShareMock = vi
      .fn<(shared: ShareData) => Promise<void>>()
      .mockRejectedValueOnce(new DOMException('too late', 'NotAllowedError'))
      .mockResolvedValue()

    await exportBackupWith(share)
    fireEvent.click(await screen.findByRole('button', { name: 'שיתוף' }))

    await waitFor(() => expect(share).toHaveBeenCalledTimes(2))
    expect(sharedFile(share, 1).name).toBe(BACKUP_NAME)
    await waitFor(() => expect(screen.queryByRole('button', { name: 'שיתוף' })).not.toBeInTheDocument())
  })

  it('downloads the zip where sharing files is not supported', async () => {
    const createObjectURL = vi.fn(() => 'blob:backup')
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() })
    renderAt('/tabs/settings')
    fireEvent.click(await screen.findByRole('button', { name: 'ייצוא גיבוי' }))

    await waitFor(() => expect(click).toHaveBeenCalledOnce())
    expect(click.mock.contexts[0]).toHaveProperty('download', BACKUP_NAME)
  })

  it('restores a backup only after confirming', async () => {
    await seedPurchases()
    renderAt('/tabs/settings')
    await screen.findByRole('button', { name: 'שחזור מגיבוי' })

    const shown = alertShown()

    chooseFile(backupArchive())
    await shown

    expect(await itemNamesStored()).toEqual(['כבל', 'מעיל'])

    clickAlertButton('החלפת הכול')

    await waitFor(async () => expect(await itemNamesStored()).toEqual(['מנורה']))
    await waitFor(async () => expect(await kindNamesStored()).toEqual(['תאורה', 'אחר']))
    await waitFor(() => expect(toasts()).toContain('הגיבוי שוחזר'))
  })

  it('rejects a file that is not a backup and keeps the data', async () => {
    await seedPurchases()
    renderAt('/tabs/settings')
    await screen.findByRole('button', { name: 'שחזור מגיבוי' })

    chooseFile(strToU8('not a zip'))

    await waitFor(() => expect(toasts()).toContain('הקובץ אינו גיבוי תקין'))
    expect(await itemNamesStored()).toEqual(['כבל', 'מעיל'])
  })

  it('keeps asking for a name while it is blank', async () => {
    renderAt('/tabs/settings')

    const shown = alertShown()

    fireEvent.click(await screen.findByRole('button', { name: 'סוג חדש' }))
    await shown
    typeInAlert('   ')

    const dismissed = alertDismissed()

    clickAlertButton('שמירה')
    await new Promise((resolve) => setTimeout(resolve, ALERT_SETTLE_MS))

    expect(document.querySelector('ion-alert')).toBeInTheDocument()

    typeInAlert('תיקים')
    clickAlertButton('שמירה')
    await dismissed

    await waitFor(async () => expect(await kindNamesStored()).toEqual([...DEFAULT_KIND_NAMES, 'תיקים']))
  })
})
