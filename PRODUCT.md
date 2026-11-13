# Product

<!-- impeccable:product-schema 1 -->

## Platform

ios

## Stack

React + TypeScript + Vite, Ionic React forced to iOS mode, Dexie (IndexedDB), `vite-plugin-pwa`, `fflate` for a zip backup that holds the photos. The same stack as the owner's מסעדות, סיימתי, אימונים and תפילות apps. Hosted on GitHub Pages; no server.

## Users

One person, the owner, who buys clothes, shoes, electronics and other things in physical shops. Nobody else looks at the app. They log an item at the shop or at home afterwards, and come back weeks or months later with a question about something they bought.

## Product Purpose

Remember every non-food thing the owner buys: what it was, how it looked, where it was bought, when and for how much. Success means that weeks later the owner can answer, within seconds: where did I buy this and what did I pay, what have I bought, how much am I spending, and can I still return it or claim the warranty.

## Positioning

A private, photo-led record of the owner's own purchases, item by item. Bank and credit-card apps know the shop and the amount but not the thing; a camera roll knows the thing but not the shop or the price. No account, no social features.

## Operating Context

- Logging happens at the shop (at the till or just outside, one hand, bags in the other) or at home when unpacking.
- Looking back happens anywhere: in a shop deciding whether to rebuy, at home checking a warranty, at the end of a month looking at spending.
- Installed as an iPhone Home Screen web app; works offline.

## Capabilities and Constraints

- One entry is a single item. Buying three things in one shop means three entries; the shop and date carry over between them.
- An item: name, photo, price in ₪, shop, place of the shop (city or mall), date, kind (clothes, shoes, electronics and so on).
- Four jobs, all confirmed by the owner: find where an item was bought and its price; browse purchases by time, shop and kind; see spending totals; keep return and warranty information.
- Physical shops only for now. Online orders and purchases abroad (other currencies) are out of scope.
- Food and groceries are out of scope.
- Hebrew UI, full RTL. Shop and brand names are often in English, so screens mix RTL and LTR text.
- An item can also keep a receipt photo, a return-by date, a warranty end date and a "returned" mark. A returned item stays in the history and leaves every total.
- Only the name is required. Kinds start as בגדים, נעליים, אלקטרוניקה, בית, ספורט and אחר, and the owner can edit them.
- The app has no server and sends no notifications; a return window that is closing shows at the top of the main screen, and a button hands the date to the iPhone Calendar.
- Photos and data live on the device only, with a zip backup exported by hand.
- Behaviour is decided in `docs/specs/2026-11-12-purchase-log-design.md`.

## Brand Commitments

- Name: רכישות. Folder: `purchase-log`.
- Must feel at home as an iPhone app.
- Owner's standing taste: rounded corners and panels, calm screens with little text at once, no decorative patterns or ornamental bands.

## Evidence on Hand

- Single-user tool: no testimonials, customers or metrics exist, and none should be invented.
- Item photos are the owner's own, taken at runtime; design mockups use labelled placeholder photos and invented sample purchases.

## Product Principles

1. The photo is the memory: an item is recognised by how it looked, so the photo leads and the text supports it.
2. Never blocked: an item can be saved with very little, and the rest can wait.
3. An answer in seconds: where, when and how much are on the first screen you reach for an item.
4. Money stays quiet: totals are there when asked for, and the app never scolds about spending.

## Accessibility & Inclusion

Touch targets of at least 44pt, usable one-handed. Follows the system text size where Ionic allows. Nothing relies on colour alone. Photos carry the item name as their text alternative.
