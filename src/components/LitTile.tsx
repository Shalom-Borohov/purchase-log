import type { ReactNode } from 'react'
import type { Item } from '../domain/types'
import { usePhotoUrl, useThumbnailUrl } from '../photo/usePhotoUrl'
import { BagGlyph } from './icons'
import './LitTile.css'

type LitTileSize = 'lead' | 'piece' | 'tile' | 'mini' | 'row'

type LitTileProps = {
  item: Item
  size: LitTileSize
  children?: ReactNode
}

const FULL_PHOTO_SIZES: readonly LitTileSize[] = ['lead', 'piece']

function TilePhoto({ item, isFull }: { item: Item; isFull: boolean }) {
  const photoId = item.hasPhoto ? item.id : undefined
  const fullUrl = usePhotoUrl(isFull ? photoId : undefined, 'item')
  const thumbnailUrl = useThumbnailUrl(photoId, 'item')
  const url = fullUrl ?? thumbnailUrl

  if (!url) {
    return (
      <span className="lit-tile-placeholder">
        <BagGlyph />
      </span>
    )
  }

  return <img className="lit-tile-photo" src={url} alt={item.name} />
}

export function LitTile({ item, size, children }: LitTileProps) {
  return (
    <div className={item.returned ? `lit-tile lit-tile-${size} lit-tile-returned` : `lit-tile lit-tile-${size}`}>
      <TilePhoto item={item} isFull={FULL_PHOTO_SIZES.includes(size)} />
      <span className="lit-tile-light" aria-hidden="true" />
      {children}
    </div>
  )
}
