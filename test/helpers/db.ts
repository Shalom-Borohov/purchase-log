import { db } from '../../src/data/db'
import { DEFAULT_KINDS } from '../../src/domain/kinds'

export async function resetDb() {
  await Promise.all(db.tables.map((table) => table.clear()))
  await db.kinds.bulkAdd(DEFAULT_KINDS)
}
