# רכישות: design

A personal iPhone PWA that records every non-food thing its owner buys: what it was, how it looked, where it was bought, when and for how much, so that weeks later they can find the shop and price, browse what they bought, see their spending and check a return window or warranty. This file is the source of truth for product behaviour. New behaviour is added as a new numbered decision: "(added YYYY-MM-DD, extends/clarifies N)".

Items marked **(assumed)** were settled without asking the owner and can be struck by number. The owner approved the build plan that lists them (`~/.claude-personal/plans/2026-11-12-purchase-log-new-iphone-pwa.md`) without striking any.

## Decisions

### What gets recorded

1. **One entry is a single item.** Buying three things in one shop means three entries. Why: the owner looks things up one at a time. Decided by the owner on 2026-11-12.
2. **Only physical shops, and only ₪.** Online orders and purchases abroad are out of the first version. Food and groceries are out for good. Decided by the owner on 2026-11-12.
3. **An item has a name (required) and an optional photo, price, shop, place, date, kind and note.** Why: the name is enough to find it again; nothing else may block logging at the till. (assumed, same rule as מסעדות)
4. **One photo per item, plus one receipt photo.** Why: one photo is enough to recognise a thing; the receipt is what a shop asks for. The receipt photo was decided by the owner on 2026-11-12; one item photo is assumed.
5. **The price is in ₪ and may have agorot.** (assumed)
6. **The date defaults to today and can be set to an earlier day; future dates are not allowed.** (assumed)
7. **Shop and place are typed text that suggests earlier values.** The place is a mall, street or city. There is no GPS point and no outside places lookup. Why: works offline and nothing leaves the phone. Decided by the owner on 2026-11-12.
8. **Items group by shop name,** ignoring case and surrounding spaces; the place is kept on each item, so one shop can have several places. Picking a shop suggests the places used with it before. (assumed)
9. **Adding another item on the same day starts with the last item's shop, place and date filled in.** Why: three things from one shop shouldn't mean typing the shop three times.
10. **Kinds start as בגדים, נעליים, אלקטרוניקה, בית, ספורט and אחר, and the owner can add, rename and delete them in הגדרות.** Deleting a kind moves its items to אחר. Each kind has one colour, used everywhere that kind appears, always next to its name: sky `#7fb7e6`, lilac `#b79cf0`, pink `#ef8fb0`, mint `#7fd6b5`, lime `#c5d86d`, and grey `#9db3ad` for אחר; a new kind takes the next unused colour from a fixed set of ten. (assumed; the owner checks the colours on the real screen)
11. **Every item gets a running number, year/sequence (2026/041),** in the order items are entered within their purchase year. A number is never reused or changed. (assumed)

### Returns and warranty

12. **An item can keep a return-by date, a warranty end date, a receipt photo and a "returned" mark.** All optional. Decided by the owner on 2026-11-12.
13. **The return-by date is set with quick picks counted from the purchase date (יומיים, 14 יום, 30 יום) or as a date.** The pick is remembered as that shop's default for the next item. Why: return policies differ by shop, and the owner knows them better than the app. (assumed)
14. **The warranty end date is set with quick picks (שנה, שנתיים, 3 שנים) or as a date.** (assumed)
15. **A returned item stays in the history, shown dimmed with the word הוחזר, and is left out of every total.** Decided by the owner on 2026-11-12.
16. **A button on the item adds an iPhone Calendar event for the day before the return window closes.** Why: the app has no server and can't notify on its own. If this can't be made to work from a Home Screen app, the first version shows closing windows in the app only. Decided by the owner on 2026-11-12. No reliable source says which way of handing a calendar file to iOS works from a Home Screen app, so the build tries them on the owner's iPhone in this order: the share sheet with a calendar file, then a download link, then a same-origin `.ics` link answered by the service worker as `text/calendar`. The first two are a few lines each; the third changes how the service worker is built.
17. **The same button exists for the warranty end date.** (assumed)
18. **An item needs attention when its return-by date is today or within the next 3 days,** it isn't marked returned, and the owner hasn't tapped "נשאר אצלי" on it. (assumed)

37. **A shop's return default is the window of the item entered there last that has a return-by date,** kept as its number of days from the purchase date; a typed date counts like a quick pick, and an item saved without a return-by date doesn't clear the default. Why: leaving the date off one item (a sale item, a gift) says nothing about the shop's policy, and a back-dated item entered today carries today's pick. (added 2026-11-13, clarifies 13; assumed; supersedes plan assumption 10, "read from that shop's latest item")

38. **When the shop's default fills a return-by date, the closed "החזרה ואחריות" row shows it ("להחזרה עד 26.11.26").** Why: a date the owner never saw shouldn't later move the item into the top slot (18, 20). (added 2026-11-13, extends 13 and 33; assumed)

39. **A return-by or warranty date that matches a quick pick moves with the purchase date when that date changes; any other date stays put. Neither may be earlier than the purchase date.** Why: a pick means "N days or years after buying", while a typed date is the date printed on the receipt. (added 2026-11-13, clarifies 13 and 14; assumed)

### Screens

19. **The tabs are רכישות, חנויות, סיכום and הגדרות.** (the fourth tab is assumed; the chosen sketch drew three)
20. **The top slot of רכישות shows the item that needs attention, the one closing soonest; when none does, the newest purchase.** With more than one, it says "ועוד N" and opens the list of them. Decided by the owner on 2026-11-12.
21. **Below it, items are a grid, newest first,** each with its photo, name, price, shop and date. (the date is assumed; the sketch left it out)
22. **Search covers names, shops, places, notes and running numbers; kinds filter the grid.** (assumed)
23. **The camera button floats above the tab bar and is not a tab.** The list has room at the bottom so no item stays hidden behind it. Why: on iPhone, tab bars hold sections, not actions. (assumed)
24. **Adding starts with the camera:** the main button opens the camera in one tap and the item sheet opens with the photo in place; a smaller "בלי תמונה" opens the sheet empty. Why: PRODUCT principle "The photo is the memory". (assumed, same flow as מסעדות)
25. **חנויות lists shops, each with its place, item count and total; a shop's page shows its items and places.** (assumed; the order is decision 34)
26. **סיכום shows the total for the chosen period, a month or a year, and totals by kind and by shop for that period.** Every total opens the items behind it. The layout is decision 35; it has no chart of months. There are no budgets, targets or warnings. Why: PRODUCT principle "Money stays quiet". (assumed)
27. **Everything can be edited and deleted; deleting asks for confirmation** and removes the item's photos. (assumed)

32. **The item page shows the photo, then a label with the name, shop, place, date, kind, number, price and the return bar, then "הוספה ליומן" and "הוחזר", then a row of other items from the same shop.** The receipt and warranty follow below. Layout: `.impeccable/mocks/decision/item-neighbours.html`, picked by the owner on impeccable's decision page on 2026-11-12.

33. **The add-item sheet shows the item photo beside a slot for the receipt photo, then name and price, then recent shops and kinds as chips, then the date and a "החזרה ואחריות" row.** Layout: `.impeccable/mocks/decision/add-two-photos.html`, picked by the owner on impeccable's decision page on 2026-11-12.

40. **Closing the add or edit sheet after changing anything (ביטול or a swipe down) asks first, with "מחיקת הטיוטה" and "המשך עריכה"; an untouched sheet closes at once.** Why: an item started at the till must not vanish with one accidental swipe (PRODUCT principle 2, "Never blocked"). (added 2026-11-13, extends 33; assumed)

34. **חנויות ranks shops by how much was spent there, biggest first, each with a bar as long as its total relative to the top shop.** A switch re-sorts by סכום, אחרונה (most recently bought from) or א-ב. Layout: `.impeccable/mocks/decision/shops-ranked.html`, picked by the owner on impeccable's decision page on 2026-11-12 (clarifies 25).

35. **סיכום has a חודש / שנה switch, the period's total and item count, then "הכי יקרים": the period's five most expensive items as photo rows with shop, date and price, then the rows "לפי סוג" and "לפי חנות".** Returned items are left out. Layout: `.impeccable/mocks/decision/summary-big.html`, picked by the owner on impeccable's decision page on 2026-11-12 (clarifies 26; "לפי חנות" and the count of five are assumed).

36. **The app icon is a lit green panel with a light label card over its lower edge, the label carrying two text bars and a brass price mark,** drawn as solid shapes with depth on the green wall. Drawing: `.impeccable/mocks/decision/icon-piece.html`, picked by the owner on impeccable's decision page on 2026-11-12.

### Data

28. **Photos and data live on the phone only, with a zip backup exported and imported by hand** from הגדרות. (assumed, same as מסעדות)
29. **Photos are stored twice, at most 1600 px and as a 240 px thumbnail.** (assumed, same as מסעדות)
30. **הגדרות has a way to open a GitHub issue for a bug or a feature.** (assumed, same as the owner's other apps)

### Not in the first version

31. Online orders, other currencies, a map of shops, push notifications, several photos per item, size and brand fields.
