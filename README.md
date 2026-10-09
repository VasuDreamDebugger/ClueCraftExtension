# ClueCraft

ClueCraft is a Chrome extension that provides AI-powered hints for LeetCode problems.

## Load the extension in Chrome

1. Install dependencies with `npm install`.
2. Build the extension with `npm run build`.
3. Open `chrome://extensions` and enable **Developer mode**.
4. Click **Load unpacked** and select this project's `dist` folder.
5. Pin ClueCraft to the toolbar and click its icon to open the popup.

Load the generated `dist` folder, not the repository root. The source popup uses TypeScript and must be compiled before Chrome can run it. After changing the source, run `npm run build` and click **Reload** on the extension card in `chrome://extensions`.

## Development

Run `npm run dev` to start Vite. Opening `http://localhost:5173` displays the UI as a regular web page; it is not the Chrome toolbar popup. Use the built extension steps above to test the popup from the extension icon.
