import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { allItems } from '../../src/data/repo'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import {
  addEarlierPurchases,
  expectSaveDisabled,
  openSheet,
  save,
  savedNamed,
  SHEET_NOW,
  SHEET_TODAY,
  suggestionsOf,
  typeInto,
} from '../helpers/itemSheet'
import { OPEN_SHEET, SAVED_ID } from '../helpers/ItemSheetHarness'

describe('item sheet', () => {
  beforeEach(resetDb)
  freezeDate(SHEET_NOW)

  it('saves a new item with only a name, dated today, once a name is typed', async () => {
    await openSheet()

    expect(screen.getByText('פריט חדש')).toBeInTheDocument()
    await expectSaveDisabled(true)
    await typeInto('שם', 'נעלי ריצה')
    await expectSaveDisabled(false)
    await save()

    const [saved] = await allItems()

    expect(saved).toMatchObject({ name: 'נעלי ריצה', boughtOn: SHEET_TODAY, year: 2026, sequence: 1 })
    expect(saved.price).toBeUndefined()
    expect(saved.shop).toBeUndefined()
    expect(await screen.findByTestId(SAVED_ID)).toHaveTextContent(saved.id)
  })

  it('blocks saving an invalid price with a visible message, and keeps agorot', async () => {
    await openSheet()
    await typeInto('שם', 'מטען')
    await typeInto('מחיר', '12.345')

    expect(await screen.findByText('מחיר לא תקין')).toBeInTheDocument()
    await expectSaveDisabled(true)

    await typeInto('מחיר', '89,90')
    await expectSaveDisabled(false)
    expect(screen.queryByText('מחיר לא תקין')).not.toBeInTheDocument()
    await save()

    expect((await allItems())[0].price).toBe(89.9)
  })

  it('dates the item today by default, takes an earlier day and refuses a future one', async () => {
    await openSheet()

    expect(screen.getByText('היום, 12.11.26')).toBeInTheDocument()
    expect(screen.getByLabelText('תאריך')).toHaveAttribute('max', SHEET_TODAY)

    await typeInto('תאריך', '2026-11-13')
    expect(screen.getByText('היום, 12.11.26')).toBeInTheDocument()

    await typeInto('תאריך', '2026-11-03')
    expect(await screen.findByText('3.11.26')).toBeInTheDocument()

    await typeInto('שם', 'כרית')
    await save()

    expect(await savedNamed('כרית')).toMatchObject({ boughtOn: '2026-11-03' })
  })

  it('starts the second item of the day with the last item’s shop, place and date, but not one entered yesterday', async () => {
    await addEarlierPurchases()
    await openSheet()

    expect(screen.getByRole('button', { name: 'Castro' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByLabelText('מקום')).toHaveValue('')

    fireEvent.click(screen.getByRole('button', { name: 'Castro' }))
    await typeInto('מקום', 'קניון עזריאלי')
    await typeInto('תאריך', '2026-11-10')
    await typeInto('שם', 'חולצה')
    await save()

    fireEvent.click(screen.getByText(OPEN_SHEET))
    await waitFor(() => expect(screen.getByLabelText('שם')).toHaveValue(''))

    expect(screen.getByRole('button', { name: 'Castro' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText('מקום')).toHaveValue('קניון עזריאלי')
    expect(screen.getByText('10.11.26')).toBeInTheDocument()

    await typeInto('שם', 'גרביים')
    await save()

    expect(await savedNamed('גרביים')).toMatchObject({
      shop: 'Castro',
      place: 'קניון עזריאלי',
      boughtOn: '2026-11-10',
    })
  })

  it('offers the kinds in order, each with its colour, and a second tap clears the kind', async () => {
    await openSheet()

    const kindGroup = screen.getByRole('group', { name: 'סוג' })
    const kindNames = Array.from(kindGroup.querySelectorAll('button')).map((button) => button.textContent)

    expect(kindNames).toEqual(['בגדים', 'נעליים', 'אלקטרוניקה', 'בית', 'ספורט', 'אחר'])
    expect(screen.getByRole('button', { name: 'נעליים' }).querySelector('.kind-colour-lilac')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'נעליים' }))
    expect(screen.getByRole('button', { name: 'נעליים' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'נעליים' }))
    expect(screen.getByRole('button', { name: 'נעליים' })).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'ספורט' }))
    await typeInto('שם', 'כדור')
    await save()

    expect(await savedNamed('כדור')).toMatchObject({ kindId: 'sport' })
  })

  it('sets return-by and warranty dates from quick picks counted from the purchase date, or as a date', async () => {
    await openSheet()
    await typeInto('תאריך', '2026-11-10')
    fireEvent.click(screen.getByRole('button', { name: 'החזרה ואחריות' }))

    expect(screen.getByRole('button', { name: 'החזרה ואחריות' })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByRole('button', { name: '14 יום' }))
    expect(screen.getByLabelText('החזרה עד')).toHaveValue('2026-11-24')
    fireEvent.click(screen.getByRole('button', { name: 'יומיים' }))
    expect(screen.getByLabelText('החזרה עד')).toHaveValue('2026-11-12')
    expect(screen.getByRole('button', { name: '14 יום' })).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'שנתיים' }))
    expect(screen.getByLabelText('אחריות עד')).toHaveValue('2028-11-10')
    fireEvent.click(screen.getByRole('button', { name: 'שנתיים' }))
    expect(screen.getByLabelText('אחריות עד')).toHaveValue('')
    await typeInto('אחריות עד', '2027-05-01')

    await typeInto('הערה', 'מידה 42')
    await typeInto('שם', 'נעליים')
    await save()

    expect(await savedNamed('נעליים')).toMatchObject({
      returnBy: '2026-11-12',
      warrantyUntil: '2027-05-01',
      note: 'מידה 42',
    })
  })

  it('keeps a quick pick counted from the purchase date when the date changes, but not a typed date', async () => {
    await openSheet()
    fireEvent.click(screen.getByRole('button', { name: 'החזרה ואחריות' }))
    fireEvent.click(screen.getByRole('button', { name: '14 יום' }))
    fireEvent.click(screen.getByRole('button', { name: 'שנה' }))

    await typeInto('תאריך', '2026-11-03')

    expect(screen.getByLabelText('החזרה עד')).toHaveValue('2026-11-17')
    expect(screen.getByLabelText('אחריות עד')).toHaveValue('2027-11-03')
    expect(screen.getByRole('button', { name: '14 יום' })).toHaveAttribute('aria-pressed', 'true')

    await typeInto('החזרה עד', '2026-11-20')
    await typeInto('תאריך', '2026-11-01')

    expect(screen.getByLabelText('החזרה עד')).toHaveValue('2026-11-20')
  })

  it('starts return-by from the chosen shop’s last return window until the owner sets one', async () => {
    await addEarlierPurchases()
    await openSheet()
    fireEvent.click(screen.getByRole('button', { name: 'החזרה ואחריות' }))
    fireEvent.click(screen.getByRole('button', { name: 'Castro' }))

    expect(screen.getByLabelText('החזרה עד')).toHaveValue('2026-11-26')
    await typeInto('תאריך', '2026-11-10')
    expect(screen.getByLabelText('החזרה עד')).toHaveValue('2026-11-24')

    fireEvent.click(screen.getByRole('button', { name: 'KSP' }))
    expect(screen.getByLabelText('החזרה עד')).toHaveValue('')

    fireEvent.click(screen.getByRole('button', { name: '30 יום' }))
    fireEvent.click(screen.getByRole('button', { name: 'Castro' }))
    expect(screen.getByLabelText('החזרה עד')).toHaveValue('2026-12-10')

    await typeInto('שם', 'חגורה')
    await save()

    expect(await savedNamed('חגורה')).toMatchObject({ shop: 'Castro', returnBy: '2026-12-10' })
  })

  it('shows a return date the shop filled in on the closed החזרה ואחריות row', async () => {
    await addEarlierPurchases()
    await openSheet()

    const returnRow = screen.getByRole('button', { name: 'החזרה ואחריות' })

    expect(returnRow).not.toHaveAccessibleDescription()

    fireEvent.click(screen.getByRole('button', { name: 'Castro' }))

    expect(returnRow).toHaveAttribute('aria-expanded', 'false')
    expect(returnRow).toHaveAccessibleDescription('להחזרה עד 26.11.26')
  })

  it('refuses a return-by or warranty date before the purchase date', async () => {
    await openSheet()
    await typeInto('תאריך', '2026-11-10')
    fireEvent.click(screen.getByRole('button', { name: 'החזרה ואחריות' }))

    expect(screen.getByLabelText('החזרה עד')).toHaveAttribute('min', '2026-11-10')
    expect(screen.getByLabelText('אחריות עד')).toHaveAttribute('min', '2026-11-10')

    await typeInto('החזרה עד', '2026-11-09')
    await typeInto('אחריות עד', '2026-01-01')

    expect(screen.getByLabelText('החזרה עד')).toHaveValue('')
    expect(screen.getByLabelText('אחריות עד')).toHaveValue('')
  })

  it('offers recent shops as chips and suggests the places used with the chosen shop', async () => {
    await addEarlierPurchases()
    await openSheet()

    expect(screen.getByRole('button', { name: 'KSP' })).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'Castro' }))

    expect(screen.getByRole('button', { name: 'Castro' })).toHaveAttribute('aria-pressed', 'true')
    expect(suggestionsOf('מקום')).toEqual(['קניון עזריאלי'])

    await typeInto('שם', 'חולצה')
    await typeInto('מקום', 'קניון עזריאלי')
    await save()

    expect(await savedNamed('חולצה')).toMatchObject({ shop: 'Castro', place: 'קניון עזריאלי' })
  })

  it('takes a shop that is not among the chips from חנות אחרת, suggesting every earlier place', async () => {
    await addEarlierPurchases()
    await openSheet()
    fireEvent.click(screen.getByRole('button', { name: 'חנות אחרת' }))
    await typeInto('שם החנות', 'Zara')

    expect(suggestionsOf('מקום')).toEqual(['דיזנגוף סנטר', 'קניון עזריאלי'])

    await typeInto('שם', 'מעיל')
    await save()

    expect(await savedNamed('מעיל')).toMatchObject({ shop: 'Zara' })
  })
})
