import { fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { blockSystemEdgeSwipe } from '../../src/navigation/edgeSwipe'

const SCREEN_WIDTH = 390

const INSIDE_EDGE = 5

const OUTSIDE_EDGE = 40

const isBlocked = (target: Element, clientX: number) =>
  !fireEvent.touchStart(target, { touches: [{ clientX }], changedTouches: [{ clientX }] })

const isSecondFingerBlocked = (target: Element, firstX: number, secondX: number) =>
  !fireEvent.touchStart(target, { touches: [{ clientX: firstX }, { clientX: secondX }], changedTouches: [{ clientX: secondX }] })

describe('blocking the iPhone’s own edge swipe', () => {
  let release = () => {}
  let text: HTMLElement

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: SCREEN_WIDTH })
    text = document.createElement('p')
    document.body.append(text)
    release = blockSystemEdgeSwipe(document)
  })

  afterEach(() => {
    release()
    document.body.innerHTML = ''
  })

  it.each([
    ['right', SCREEN_WIDTH - INSIDE_EDGE],
    ['left', INSIDE_EDGE],
  ])('blocks a touch that starts at the %s edge', (_, clientX) => {
    expect(isBlocked(text, clientX)).toBe(true)
  })

  it.each([SCREEN_WIDTH / 2, SCREEN_WIDTH - OUTSIDE_EDGE, OUTSIDE_EDGE])('leaves a touch at x=%d alone', (clientX) => {
    expect(isBlocked(text, clientX)).toBe(false)
  })

  it('judges a second finger by where it lands, not by the first finger', () => {
    expect(isSecondFingerBlocked(text, SCREEN_WIDTH / 2, SCREEN_WIDTH - INSIDE_EDGE)).toBe(true)
    expect(isSecondFingerBlocked(text, SCREEN_WIDTH - INSIDE_EDGE, SCREEN_WIDTH / 2)).toBe(false)
  })

  it('keeps taps on a button at the edge working', () => {
    const button = document.createElement('ion-button')
    document.body.append(button)

    expect(isBlocked(button, SCREEN_WIDTH - INSIDE_EDGE)).toBe(false)
  })

  it('keeps taps on a link at the edge working', () => {
    const tile = document.createElement('a')
    const photo = document.createElement('img')

    tile.append(photo)
    document.body.append(tile)

    expect(isBlocked(photo, INSIDE_EDGE)).toBe(false)
  })

  it('keeps taps on a sheet’s backdrop at the edge working', () => {
    const sheet = document.createElement('div')
    const backdrop = document.createElement('ion-backdrop')

    sheet.attachShadow({ mode: 'open' }).append(backdrop)
    document.body.append(sheet)

    expect(isBlocked(backdrop, INSIDE_EDGE)).toBe(false)
  })

  it('stops blocking once released', () => {
    release()

    expect(isBlocked(text, SCREEN_WIDTH - INSIDE_EDGE)).toBe(false)
  })
})
