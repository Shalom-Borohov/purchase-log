import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetDb } from '../helpers/db'
import { selectedTab } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

describe('tabs', () => {
  beforeEach(resetDb)

  it('opens on רכישות and shows the four tabs in order', async () => {
    renderAt('/')

    await waitFor(() => expect(currentPath()).toBe('/tabs/purchases'))
    await waitFor(() => expect(selectedTab()).toBe('purchases'))

    const labels = Array.from(document.querySelectorAll('ion-tab-button')).map((tab) => tab.textContent?.trim())

    expect(labels).toEqual(['רכישות', 'חנויות', 'סיכום', 'הגדרות'])
    expect(screen.getByRole('heading', { level: 1, name: 'רכישות' })).toBeInTheDocument()
  })
})
