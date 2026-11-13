---
name: רכישות
description: A private record of non-food purchases where every item hangs lit on a deep green wall, with a light label card saying where it came from, when and for how much.
colors:
  wall: "#14342e"
  sheet: "#18403a"
  panel: "#1d463e"
  tab-bar: "#102b26"
  label: "#f1efe7"
  ink: "#10201c"
  ink-quiet: "#55655f"
  quiet: "#a3bcb2"
  hairline: "rgba(241, 239, 231, 0.1)"
  brass: "#d9a441"
  brass-wash: "rgba(217, 164, 65, 0.16)"
  signal: "#e2603a"
  track: "#dcd7c7"
  danger: "#f08a6c"
  kind-sky: "#7fb7e6"
  kind-lilac: "#b79cf0"
  kind-pink: "#ef8fb0"
  kind-mint: "#7fd6b5"
  kind-lime: "#c5d86d"
  kind-grey: "#9db3ad"
  kind-peach: "#f2a679"
  kind-sand: "#dcc48e"
  kind-teal: "#63c3cc"
  kind-violet: "#9fa6f2"
typography:
  total:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "2.125rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  item-name:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  control:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
  label:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  secondary:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
  caption:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  tab-label:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, 'Arial Hebrew', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
rounded:
  lead: "26px"
  tile: "22px"
  panel: "20px"
  label-page: "18px"
  label: "16px"
  control: "14px"
  segment: "11px"
  pill: "999px"
  circle: "50%"
spacing:
  label-gap: "6px"
  choice-gap: "8px"
  stack: "10px"
  grid-gap: "12px"
  gutter: "16px"
  section: "28px"
  tab-clearance: "calc(83px + env(safe-area-inset-bottom))"
  camera-clearance: "calc(190px + env(safe-area-inset-bottom))"
components:
  lit-tile-lead:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lead}"
    height: "250px"
  lit-tile-piece:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lead}"
    height: "300px"
  grid-tile:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.label}"
    typography: "{typography.item-name}"
    rounded: "{rounded.tile}"
    padding: "2px 12px 12px"
  lit-tile-mini:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    size: "108px"
  lit-tile-row:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.label}"
    size: "60px"
  item-label:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    typography: "{typography.item-name}"
    rounded: "{rounded.label}"
    padding: "12px 14px"
  item-label-page:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.label-page}"
    padding: "14px 16px"
  return-bar-track:
    backgroundColor: "{colors.track}"
    rounded: "3px"
    height: "6px"
  return-bar-fill:
    backgroundColor: "{colors.signal}"
    rounded: "3px"
    height: "6px"
  kind-dot:
    rounded: "{rounded.circle}"
    size: "8px"
  choice:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.label}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 15px"
    height: "44px"
  choice-selected:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
  segmented:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.control}"
    padding: "3px"
  segmented-selected:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.segment}"
    height: "44px"
  field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.label}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  search:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.label}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  sheet-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.label}"
    rounded: "{rounded.panel}"
    padding: "0 16px"
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "48px"
  button-camera:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "64px"
  button-sheet-camera:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "52px"
  button-quiet:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.label}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-brass-wash:
    backgroundColor: "{colors.brass-wash}"
    textColor: "{colors.brass}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-danger:
    textColor: "{colors.danger}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "48px"
  tab-bar:
    backgroundColor: "{colors.tab-bar}"
    textColor: "{colors.quiet}"
    typography: "{typography.tab-label}"
  tab-bar-selected:
    textColor: "{colors.brass}"
---

# Design System: רכישות

## Overview

**Creative North Star: "Gallery Wall"**

A museum's new-acquisitions wall. Every purchase hangs as a photo lit by a soft warm spotlight on a deep matte green wall, and a light label card overlaps its lower edge with the facts: name, shop, place, date, running number and price. The owner recognises the thing itself before reading a word. The world refuses the category default of small square thumbnails in a grey list with the amount as the loudest thing.

This is an iPhone Home Screen app first: Ionic in iOS mode, Hebrew right to left, one phone column, dark wall only. Navigation and controls stay standard iOS (large titles, back buttons, action sheets, a four-tab bar); the gallery lives in the tiles and labels, not in costume. No frames, serifs, patterns or museum ornament. Density is calm: one lead piece large, then a two-column grid, rows of one line where a list is needed.

Colour is spent sparingly. Brass is the one interactive tint, signal orange appears only on a closing return window, and each kind owns one colour that only ever appears as a small dot beside its name.

**Key Characteristics:**
- Deep matte green wall, raised green tiles, light label cards with dark green ink.
- Every item photo sits in a lit tile under a warm spotlight; the label card overlaps the photo's edge.
- Brass is the only interactive tint; signal orange is only the return window.
- Ten kind colours, each a dot beside its kind's name, never alone.
- Heebo throughout, heavy numerals for prices and totals, tabular figures everywhere.
- Generously rounded tiles and controls; nothing square.
- Solid filled icons, no outline icons.

## Colors

A dark gallery palette: a green wall in three depths, warm off-white labels, one brass accent and one warning orange.

### Primary
- **Gallery Brass** (brass): The one interactive tint. The camera button, the sheet's camera button, the primary button and the sheet's שמירה, the selected tab, back buttons and the item page's עריכה, empty photo slot prompts, the "more" link under the lead piece, the caret, focus rings and text selection, and the warm cast of the spotlight.
- **Brass Wash** (brass-wash): The fill behind brass text on a secondary item action (הוספה ליומן), so the action reads as brass without a second solid brass block on screen.

### Signal
- **Closing-Window Orange** (signal): The fill of the return bar and the status line of an item that needs attention. Nothing else.

### Neutral
- **Matte Wall** (wall): Every page ground, the toolbar, the dark mark behind a photo's retake button, the theme colour.
- **Sheet Green** (sheet): Modal sheets, a step above the wall.
- **Raised Panel** (panel): Lit tiles, grid tiles, fields, the search field, choices, quiet buttons, grouped panels, segmented tracks, the empty shop-bar track.
- **Tab-Bar Green** (tab-bar): The tab bar, a step below the wall.
- **Label Card** (label): Item label cards, selected choices and segments, all primary text on the wall, the shop rank bar fill (at 85%).
- **Label Ink** (ink): Text on a label card and on brass.
- **Quiet Ink** (ink-quiet): Secondary facts on a label card (provenance, running number, הוחזר).
- **Quiet Sage** (quiet): Secondary text on the wall, placeholders, field labels, inactive tabs, chevrons and receipt glyphs.
- **Hairline** (hairline): 1px dividers between rows inside panels and lists.
- **Return Track** (track): The unfilled return bar on a label card.

### Functional
- **Soft Coral** (danger): Delete actions and form errors as text, and the 2px underline of an invalid row. Never a fill.

### Kinds
Ten fixed kind colours: sky, lilac, pink, mint, lime and grey (for אחר) are the seeded kinds; peach, sand, teal and violet go to new kinds in that order, then grey is reused. Each appears only as an 8px dot beside the kind's name, in the label meta line, in kind chips and in the kind filter.

### Named Rules
**The One Brass Rule.** Brass is the only colour that says "you can act here". No other accent fills a button, a tab or a link.

**The Signal Is Time Rule.** Signal orange means a return window is closing and is used for nothing else: not for prices, totals, errors or emphasis.

**The Dot Beside the Name Rule.** A kind colour appears only as a small dot next to its kind's name. Filtering by kind keeps the chosen chip bright and dims the others to 45%; it never tints tiles or text.

## Typography

**Font:** Heebo (with -apple-system, BlinkMacSystemFont, Arial Hebrew, sans-serif), self-hosted at 400, 500, 700 and 800 in Hebrew and Latin subsets.

**Character:** One sans family carries everything. Hierarchy comes from a heavy 800 for titles, prices and totals against 400 to 700 for the rest. Numerals are tabular everywhere, and every number is isolated left-to-right inside the Hebrew line.

### Hierarchy
- **Total** (800, 2.5rem, 1.1, -0.01em): The period total on סיכום. The shop page total uses the same weight at 2rem.
- **Display** (800, 2.125rem, 1.1, -0.01em): The large title of a top-level screen.
- **Price** (800, 1.75rem, 1, -0.01em): The price on a label card; 1.875rem on the item page's label.
- **Headline** (700, 1.25rem, 1.25): The item name on the item page's label.
- **Title** (700, 1.125rem, 1.3): Shop names and their totals on חנויות. Settings tile headings use 700 at 1.0625rem.
- **Item name** (700, 0.9375rem, 1.3): Item names on label cards and attention rows, section headings. Row names go to 1rem; grid tile name and price drop to 0.875rem.
- **Body** (400, 1rem): Field text and button labels; primary buttons are 700.
- **Control** (500, 0.9375rem): Choices, quiet buttons, item actions, breakdown toggles. A chosen choice goes to 700.
- **Label** (400, 0.875rem): Field labels above inputs and the month line, in quiet sage.
- **Secondary** (400, 0.8125rem): Provenance (shop · place · date), return-bar text, captions.
- **Caption** (400, 0.75rem): Running numbers, grid tile provenance, the returned mark.
- **Tab label** (500, 0.6875rem): Tab bar labels.

### Named Rules
**The Heavy Number Rule.** The amount that matters on a screen (the label's price, the period total, the shop total) is set at 800 and is the only thing that heavy besides the page title. It always stands beside the photos or rows that add up to it.

**The Whole Name Rule.** A shop or model name is never broken mid-word: model names keep their words whole, and shop names in chips take their own direction so Latin names read correctly inside Hebrew.

## Layout

A single phone column with 16px gutters and no width breakpoints. Top-level screens open with a large title and a quiet subtitle line, then content. Sections are 28px apart, stacked tiles 10px, grid tiles 12px, choices 8px, a field label 6px above its field.

The רכישות screen: title and month line (month, item count, total), a 44px search field, the lead piece (a 250px lit tile whose label card overlaps its bottom edge by 56px, inset 14px), a one-row scrolling kind filter, then a two-column grid of tiles. The camera button floats on the trailing (left) side above the tab bar, with a "no photo" pill beside it; pages under it keep 190px plus the safe area clear.

The item page stacks a 300px lit piece, a label card overlapping it by 20px and inset 28px, two half-width actions, a horizontal rail of 108px tiles from the same shop, then grouped rows for receipt and warranty, a note and a centred delete.

The add and edit sheet opens with two 170px photo slots side by side (item, receipt), then a grouped panel of name and price rows, chips for shop and kind, and a quiet panel of date and return rows.

Reading order is right to left; numbers are isolated left-to-right.

## Elevation & Depth

Tonal layering on a dark wall, with shadows only where something is held in front of it. The tab bar sits below the wall's tone, sheets one step above, panels one more. Light comes from above: the spotlight is a warm ellipse at the top of each lit tile, and a sheen plus a bottom darkening sit over the photo. Shadows are deep green-black, never grey, and belong to the label card and to floating actions.

### Shadow Vocabulary
- **Label** (`box-shadow: 0 10px 24px rgba(4, 14, 12, 0.45), 0 2px 4px rgba(4, 14, 12, 0.25)`): Every label card, which hangs in front of its photo.
- **Float** (`box-shadow: 0 10px 22px rgba(4, 14, 12, 0.5), 0 2px 4px rgba(4, 14, 12, 0.3)`): The camera button and the "no photo" pill above the tab bar.
- **Segment** (`box-shadow: 0 2px 6px rgba(4, 14, 12, 0.35)`): The selected segment in a segmented control.
- **Retake mark** (`box-shadow: 0 3px 8px rgba(4, 14, 12, 0.4)`): The small wall-coloured circle over a filled photo slot.
- **Tab bar edge** (`box-shadow: 0 -1px 0 rgba(241, 239, 231, 0.08)`): The tab bar's top edge only.

### Named Rules
**The Lit From Above Rule.** Depth comes from the spotlight and the tone steps of the wall. Tiles, fields and choices are flat; only label cards and floating actions cast shadows.

## Shapes

Everything is rounded, and larger things are rounder. Lead and item-page pieces take 26px, grid tiles 22px, sheet panels and the 108px rail tiles 20px, the item page's label 18px, label cards, grouped rows and 60px row tiles 16px, fields and buttons 14px, segments 11px. Choices and the "no photo" pill are full pills; the camera button and kind dots are circles. The return bar and shop bars are 6px tracks with 3px ends.

A grid tile clips its lit photo to the tile's top corners and runs the caption below inside the same rounded shape. The receipt slot's empty state is the one dashed outline (1.5px brass at 42%, 15px radius, inset 8px), marking where a paper goes.

### Named Rules
**The No Square Rule.** No square thumbnails and no edge-to-edge photos. Every photo sits inside a rounded lit tile.

## Components

### Lit Tile (signature)
The photo on the wall. A raised-panel tile with the spotlight behind and a sheen plus soft bottom darkening over the photo.
- **Sizes:** Lead 250px tall (רכישות), piece 300px (item page), grid 118px over a caption, mini 108px square (same-shop rail), row 60px square (photo rows on סיכום and lists).
- **No photo:** A faint bag glyph in label colour at 16%, on the spotlight.
- **Returned:** The photo dims to 45%, the one returned-item dim; the label or caption adds הוחזר in bold quiet text.
- **Photo:** Cropped to cover the tile; the item photo fills its slot.

### Item Label
The museum label: a light card in front of the photo.
- **Style:** Label-card fill, ink text, 16px radius, 12px by 14px padding, the label shadow. Name at 700 with provenance below in quiet ink; the price at 800 on the leading-left with the running number under it.
- **Page variant:** 18px radius, 14px by 16px padding, 1.25rem name, 1.875rem price, plus a meta line with the kind dot.
- **Return bar:** Inside the label: secondary text, then a 6px track whose signal fill is exactly the share of days left.

### Buttons
- **Shape:** 14px radius, 48px tall for primary and danger, 44px for quiet.
- **Primary:** Brass with ink 700 text, 0 22px.
- **Camera:** A 64px brass circle with the solid camera icon and the float shadow, floating trailing above the tab bar. In the sheet, a 52px brass button beside a raised-panel gallery button.
- **Quiet:** Raised panel with label text at 500.
- **Brass wash:** Brass text on brass wash, for secondary item actions.
- **Danger:** Soft coral text, no fill, centred at the end of a page.
- **Press / Focus:** Pressed controls dim to 65% over 120ms ease-out. Focus is a 2px brass outline with a 2px offset. No hover states; this is a touch app.

### Choices
- **Style:** 44px raised-panel pills with label text at 0.9375rem, 8px gaps, wrapping (the kind filter scrolls in one row).
- **Selected:** Label-card fill with ink 700 text.
- **Kind chips:** The kind's dot leads the name.
- **Other shop:** A transparent pill with a 1px quiet ring; chosen, the ring goes to 1.5px label colour.
- **Segmented:** A raised-panel track with 3px padding and 14px radius; the selected segment fills with label colour, 11px radius and the segment shadow. Used for חודש / שנה and the shop sort.

### Inputs / Fields
- **Style:** 44px raised-panel fields, 14px radius, label text, quiet placeholder, brass caret. Labels sit above in quiet sage, inset 6px.
- **Search:** A raised-panel field with a leading search glyph; focused, a 2px brass inset ring.
- **Sheet rows:** Name and price are bare inputs in a 52px row inside a grouped panel; focus draws a 2px brass underline, an invalid row a 2px soft-coral underline, with the message below in soft coral.

### Photo Slots
Two 170px slots side by side in the sheet, 22px radius. The empty item slot is lit with the spotlight and a brass prompt; the empty receipt slot has the dashed brass outline. A filled slot shows the photo with one options button that opens an action sheet. While a photo is processed the slot dims to 50%.

### Lists and Rows
- **Item row:** A 60px lit row tile, the name at 1rem 700 on one line with ellipsis, details below, the price at 1.0625rem 700; hairline dividers between rows.
- **Shop rank row:** Name and total at 1.125rem 700, details below, then a 6px bar whose label-coloured fill is the shop's share of the top shop.
- **Breakdown:** A 52px raised-panel toggle (16px radius) whose chevron turns over 160ms, opening 48px lines with a kind dot, label and bold total.
- **Attention row:** A 72px raised-panel row (22px radius) with a row tile, the name and a signal-orange status line.

### Navigation
- **Tab bar:** Four tabs (רכישות, חנויות, סיכום, הגדרות) on the tab-bar green with a faint top edge; solid 26px icons over 11px labels, quiet sage at rest, brass when selected.
- **Inner pages:** Ionic's standard iOS toolbar on the wall, back button and text actions in brass.
- **Edits and deletes:** Kind edits go through an iOS action sheet, with no red words.

### Icons
Solid filled SVG shapes in currentColor on a 24-unit grid, 18 to 30px, always beside a label or an accessible name. No outline icons.

### App Icon
A lit green panel on the green wall with a light label card over its lower edge, carrying two text bars and a brass price mark, drawn as solid shapes with depth. `public/favicon.svg` is the `<symbol>` from `.impeccable/mocks/decision/icon-piece.html`, byte for byte. `public/icon-192.png`, `public/icon-512.png` and `public/apple-touch-icon.png` were rendered from it on 2026-11-13 with `rsvg-convert -w N -h N` (N = 192, 512 and 180), then flattened with `magick -alpha remove -alpha off`. Re-render the rasters the same way whenever the SVG changes.

## Do's and Don'ts

### Do:
- **Do** show every item photo inside a lit tile, with its label card or caption beside or over its edge.
- **Do** keep brass as the only interactive tint: camera, primary action, selected tab, back and text actions, focus.
- **Do** use signal orange only for a closing return window, as the return bar's length or the attention status.
- **Do** put a kind's colour only in an 8px dot beside its name.
- **Do** set the screen's key amount at 800 beside the photos or rows that make it up.
- **Do** isolate every number left-to-right with tabular figures.
- **Do** give every control at least a 44pt target: 44px choices and fields, 48px buttons, 64px camera.
- **Do** tint shadows deep green-black and keep them to label cards and floating actions.
- **Do** dim a returned item's photo once, to 45%, and write הוחזר.

### Don't:
- **Don't** use small square thumbnails in a grey list, or make the amount louder than the photo.
- **Don't** add frames, serifs, patterns or museum costume; controls stay standard iOS.
- **Don't** use a second accent colour for actions.
- **Don't** show a kind by colour alone, or tint a tile or text with a kind colour.
- **Don't** use soft coral as a fill, or for anything but deletion and errors.
- **Don't** use outline icons.
- **Don't** put a shadow on a tile, field or choice.
