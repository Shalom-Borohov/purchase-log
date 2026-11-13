import { Fragment } from 'react'
import { COMMON_COPY } from '../copy/common'
import { ITEM_COPY, provenance, returnStatus, returnStatusWithDate } from '../copy/itemCopy'
import { itemNumber } from '../domain/itemNumber'
import { isClosed, returnWindow } from '../domain/returnWindow'
import type { Item, Kind } from '../domain/types'
import './ItemLabel.css'
import { KindDot } from './KindDot'
import { ReturnBar } from './ReturnBar'

type ItemLabelProps = {
  item: Item
  today: string
  kind?: Kind
  isPageHeading?: boolean
}

const WORD_GAP = ' '

const HYPHEN = '-'

const FIRST_WORD = 0

function WordsKeptWhole({ text }: { text: string }) {
  return text.split(WORD_GAP).map((word, index) => (
    <Fragment key={index}>
      {index > FIRST_WORD && WORD_GAP}
      {word.includes(HYPHEN) ? <span className="item-label-whole-word">{word}</span> : word}
    </Fragment>
  ))
}

function ReturnLine({ item, today, isPageHeading }: Pick<ItemLabelProps, 'item' | 'today' | 'isPageHeading'>) {
  if (item.returned) {
    return <p className="item-label-returned">{ITEM_COPY.returned}</p>
  }

  const window = returnWindow(item, today)

  if (!window) {
    return null
  }

  if (isClosed(window)) {
    return isPageHeading ? <p className="item-label-closed">{returnStatus(window)}</p> : null
  }

  return <ReturnBar window={window} text={isPageHeading ? returnStatusWithDate(window) : returnStatus(window)} />
}

export function ItemLabel({ item, today, kind, isPageHeading = false }: ItemLabelProps) {
  const Name = isPageHeading ? 'h1' : 'strong'

  return (
    <div className={isPageHeading ? 'item-label item-label-page' : 'item-label'}>
      <div className="item-label-row">
        <div className="item-label-facts">
          <Name className="item-label-name">
            <WordsKeptWhole text={item.name} />
          </Name>
          <p className="item-label-provenance">{provenance(item)}</p>
        </div>
        <div className="item-label-amount">
          {item.price !== undefined && <p className="item-label-price num">{COMMON_COPY.shekels(item.price)}</p>}
          {!isPageHeading && <p className="item-label-number num">{itemNumber(item)}</p>}
        </div>
      </div>
      {isPageHeading && (
        <div className="item-label-meta">
          {kind ? <KindDot kind={kind} /> : <span />}
          <span className="num">{itemNumber(item)}</span>
        </div>
      )}
      <ReturnLine item={item} today={today} isPageHeading={isPageHeading} />
    </div>
  )
}
