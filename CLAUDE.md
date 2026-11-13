# CLAUDE.md

## What this is

רכישות: a personal iPhone PWA recording non-food purchases item by item (photo, receipt photo, name, price, shop, place, date, kind, return-by and warranty dates), so the owner can later find where they bought something, what it cost, what they spend and whether they can still return it. Hebrew, RTL. Everything lives in IndexedDB on the device, with a zip backup file (`data.json`, `photos/<item id>-<role>.jpg` and `thumbnails/<item id>-<role>.jpg`, role `item` or `receipt`).

## Commands

- `npm run dev`: Vite at `http://localhost:5173/purchase-log/`. The app uses a hash router.
- `npm test`: the Vitest suite. One file: `npx vitest run test/unit/repo.test.ts`.
- `npm run lint`: oxlint.
- `npm run build`: `tsc -b && vite build`. This is the type check.

## Sources of truth

- `docs/specs/2026-11-12-purchase-log-design.md`: numbered decisions. Add new behaviour there as a new numbered decision.
- `PRODUCT.md`: product principles.
- `.impeccable/surfaces/src-app-tsx.md` and the chosen sketches in `.impeccable/mocks/decision/`: the visual system ("Gallery wall").

## Architecture

Imports go downward only: `pages` → `components` → `photo` → `data` → `copy` → `domain`. A folder may skip levels downward, never import upward, so `domain` imports nothing and `copy` only imports `domain`.

- `src/domain/`: pure functions with no React or Dexie. `types.ts` holds the valibot schemas; `returnWindow.ts` the days left and the attention rule; `shops.ts` grouping by normalised shop name; `summary.ts` period totals; `calendarEvent.ts` the `.ics` text; `kinds.ts` the default kinds and colours.
- `src/data/`: the Dexie database, the repo and backup. Writes go through `repo.ts`, which parses with the schemas. Photo bytes live in `photos` and `thumbnails`, keyed by `[itemId+role]`; an item's `hasPhoto` and `hasReceipt` say which exist. Running numbers come from the `counters` table inside the add transaction and are never reused. Deleting a kind moves its items to אחר. New fields must be optional so old backups still import. `RecordsProvider` runs the one live query of items and kinds; screens read it with `useRecords()`.
- `src/photo/`: shrinking photos and turning their bytes into object URLs.
- `src/components/`: UI shared by several screens (`LitTile`, `ItemLabel`, `ReturnBar`, `KindDot`, photo inputs, choice pills, text fields, icons).
- `src/navigation/paths.ts`: every route. An item page exists in three stacks (רכישות, חנויות, סיכום); `itemPathInStack` keeps links in the current one.
- `src/pages/<feature>/`: one folder per screen, each with its own `copy.ts` and CSS. `pages/itemSheet/ItemSheet.tsx` is the add and edit sheet, opened from רכישות and the item page.

## Tests

- `test/unit` covers logic and data. `test/ui` renders screens with `renderAt(path)`.
- Storage isn't mocked: `fake-indexeddb` backs the real Dexie database. Call `resetDb` in `beforeEach`; it also seeds the default kinds.
- `test/helpers/records.ts` builds items and kinds; `freezeDate` pins "today".
- jsdom has no canvas, so photo shrinking is stubbed in UI tests with `vi.mock('../../src/photo/shrink', ...)`. Check photo and CSS changes in a browser.
