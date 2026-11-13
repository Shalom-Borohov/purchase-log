import { todayDate } from '../../domain/dayDate'

const BACKUP_FILE_PREFIX = 'purchases-backup-'

const BACKUP_EXTENSION = '.zip'

const BACKUP_MIME_TYPE = 'application/zip'

export const BACKUP_FILE_ACCEPT = [BACKUP_EXTENSION, BACKUP_MIME_TYPE].join(',')

export const backupFile = (archiveChunks: Uint8Array<ArrayBuffer>[], now: number) =>
  new File(archiveChunks, `${BACKUP_FILE_PREFIX}${todayDate(new Date(now))}${BACKUP_EXTENSION}`, {
    type: BACKUP_MIME_TYPE,
  })
