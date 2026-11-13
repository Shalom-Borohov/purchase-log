import { createContext } from 'react'
import type { Records } from '../domain/types'
import { allItems, allKinds } from './repo'

export const RecordsContext = createContext<Records | undefined>(undefined)

export async function allRecords(): Promise<Records> {
  const [items, kinds] = await Promise.all([allItems(), allKinds()])

  return { items, kinds }
}
