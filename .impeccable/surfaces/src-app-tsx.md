---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/pages"]
---

## Scope

The whole app shell and its screens: רכישות (purchases), item page, add-item sheet, חנויות, סיכום. Mode: Operate. Platform: iOS Home Screen web app, Ionic iOS mode, Hebrew RTL. Build path: code-led; the chosen sketch is `.impeccable/mocks/decision/assigned.html`.

## Audience and job

The owner, at a shop or at home unpacking: log one item, photo first. Weeks later: find where an item was bought and what it cost, browse what was bought, see spending, check a return window or warranty.

## Direction contract

THESIS: Every purchase hangs like a new acquisition: the photo lit on a deep wall, with a small label saying where it came from, when and for how much. Refuses the category default of small square thumbnails in a grey list with the amount as the loudest thing.

OWN-WORLD: Matte wall #14342e as the ground, raised tiles #1d463e at 18px radius or more, each holding a photo under a soft warm spotlight. Light label cards #f1efe7 with ink #10201c carry the facts. Brass #d9a441 is the one interactive tint (active tab, camera button). Signal #e2603a appears only on a closing return window. Heebo throughout; two type sizes per screen carry the hierarchy. No frames, serifs, patterns or museum costume; navigation and controls stay standard iOS.

STORY: The owner sees the latest purchase large and recognisable, reads shop, date and price off its label, sees how long is left to return it, and finds older things by photo below.

FIRST VIEWPORT: Status bar on the wall; large title רכישות with the month line (month, item count, total) under it; a 44px rounded search field; the lead piece, a 358×250 lit tile whose label card overlaps its bottom edge with name, shop · place · date, running number, large price and the return bar; a two-column grid of smaller lit tiles with a one-line caption (name, price) and the shop beneath; a brass camera button above a three-tab bar (רכישות, חנויות, סיכום).

Raises carried from the declined hand: the return window is a bar whose length is the exact days left; every purchase has a running number in strict order (2026/041); each kind owns one colour everywhere, and filtering keeps it bright and dims the rest; a total never stands alone but sits beside the photos that add up to it; two type sizes per screen.

FORM: Gallery wall (a museum's new-acquisitions wall), position 7 on the ordered list. seed:fb63bab4c1499dd1

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

Opening the app and recognising the thing itself, lit, with its label beneath it, before reading a word.

## Chosen sketches

Each was picked by the owner on impeccable's decision page on 2026-11-12 and is the composition the build matches. All are in `.impeccable/mocks/decision/`.

- רכישות (main screen): `assigned.html`
- Item page: `item-neighbours.html`
- Add-item sheet: `add-two-photos.html`
- חנויות: `shops-ranked.html`
- סיכום: `summary-big.html`
- App icon: `icon-piece.html`

The sketches for חנויות and סיכום draw four tabs (the fourth is הגדרות); the main-screen sketch drew three and gains the fourth. הגדרות is a standard grouped list and had no round.

## Unresolved

- Kind colours are in spec 10 as an assumption the owner approved with the build plan: sky #7fb7e6, lilac #b79cf0, pink #ef8fb0, mint #7fd6b5, lime #c5d86d, grey #9db3ad for אחר. The owner has only seen them inside a סיכום sketch that lost its round, so they are checked on the real screen.
- The main-screen sketch predates two spec decisions: the lead slot shows the item needing attention before the newest (spec 20), and grid tiles carry the date (spec 21).
- The add-item sheet has no slot for the place; the build adds it beside the shop (spec 7).
- Empty states, the shop page, the kind and shop breakdowns under סיכום, and the edit form have no sketch; they inherit this system.
