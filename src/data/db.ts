import Dexie, { type EntityTable, type Table } from 'dexie'
import { DEFAULT_KINDS } from '../domain/kinds'
import type { Counter, Item, Kind, PhotoRole, StoredPhoto } from '../domain/types'

const DB_NAME = 'purchase-log'

export type PhotoKey = [string, PhotoRole]

class PurchaseLogDb extends Dexie {
  declare items: EntityTable<Item, 'id'>
  declare kinds: EntityTable<Kind, 'id'>
  declare counters: EntityTable<Counter, 'year'>
  declare photos: Table<StoredPhoto, PhotoKey>
  declare thumbnails: Table<StoredPhoto, PhotoKey>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      items: 'id',
      kinds: 'id',
      counters: 'year',
      photos: '[itemId+role]',
      thumbnails: '[itemId+role]',
    })
    this.on('populate', (transaction) => transaction.table('kinds').bulkAdd(DEFAULT_KINDS))
  }
}

export const db = new PurchaseLogDb()

export const allTables = () => [db.items, db.kinds, db.counters, db.photos, db.thumbnails]

export const itemTables = () => [db.items, db.counters, db.photos, db.thumbnails]
