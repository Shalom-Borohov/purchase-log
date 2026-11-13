import { KIND_COLOURS, type Kind, type KindColour } from './types'

export const OTHER_KIND_ID = 'other'

const SEEDED_AT = 0

const FALLBACK_COLOUR: KindColour = 'grey'

const seededKind = (id: string, name: string, colour: KindColour, position: number): Kind => ({
  id,
  name,
  colour,
  position,
  createdAt: SEEDED_AT,
})

export const DEFAULT_KINDS: Kind[] = [
  seededKind('clothes', 'בגדים', 'sky', 0),
  seededKind('shoes', 'נעליים', 'lilac', 1),
  seededKind('electronics', 'אלקטרוניקה', 'pink', 2),
  seededKind('home', 'בית', 'mint', 3),
  seededKind('sport', 'ספורט', 'lime', 4),
  seededKind(OTHER_KIND_ID, 'אחר', 'grey', 5),
]

export function nextKindColour(kinds: Kind[]): KindColour {
  const used = new Set(kinds.map(({ colour }) => colour))

  return KIND_COLOURS.find((colour) => !used.has(colour)) ?? FALLBACK_COLOUR
}

export const kindIdOf = (kinds: Kind[], kindId: string | undefined) =>
  kindId && kinds.some(({ id }) => id === kindId) ? kindId : OTHER_KIND_ID

export const kindOf = (kinds: Kind[], kindId: string | undefined) => {
  const shownId = kindIdOf(kinds, kindId)

  return kinds.find(({ id }) => id === shownId)
}

export const kindsInOrder = (kinds: Kind[]) => kinds.toSorted((first, second) => first.position - second.position)
