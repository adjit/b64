# Base64 Encoder/Decoder

A small React + TypeScript app (Vite, Tailwind, shadcn/ui) for encoding text to base64 and decoding it back. Everything runs in the browser; nothing is sent anywhere.

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev       # start the dev server (Vite prints the local URL)
npm run build     # type-check and build to dist/
npm run preview   # serve the production build locally
```

## Usage

**Encode:** type or paste text into the **Plain Text** box and click **Encode to Base64**. The result appears in the Base64 box.

**Decode:** paste a base64 string into the **Base64** box and click **Decode from Base64**. The result appears in the Plain Text box. Invalid base64 shows an error.

**Copy:** the copy button next to each box copies that box's contents.

**Clear All:** empties both boxes.

> Note: encoding uses the browser's `btoa`, so input must be Latin-1 characters. Text with characters outside that range (e.g. emoji) will fail to encode.

## Conversion history

Every successful encode or decode is added to the **History** card, newest first, showing the type, time, and a truncated input → output preview.

- **Restore:** click an entry to load that conversion back into both boxes.
- **Clear history:** removes all entries.
- **Session only (default):** history lives in memory while the app is running and is gone the next time it starts.
- **Preserve history when the app starts:** tick this checkbox to save history in the browser's local storage and reload it on the next start. The setting is remembered. Unticking it deletes the saved history.

History keeps the most recent 200 entries. Local storage is tied to the browser and the address you open the app from, so preserved history only reappears from the same browser and URL.

> Since history can contain whatever you converted, avoid enabling "preserve" on a shared machine if you handle sensitive data.

## Project layout

- `src/components/Base64Converter.tsx` – main UI and conversion logic
- `src/lib/useHistory.ts` – history state and persistence hook
- `src/components/ui/` – shadcn/ui components
