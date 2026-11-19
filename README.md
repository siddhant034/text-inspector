# Text Inspector

A simple, privacy-first text analysis tool for inspecting, counting, and comparing text — right in your browser.

## Features

- Live word, character, sentence, and paragraph counts
- Reading-time estimate
- Repeated-word detection
- Whitespace checks for leading/trailing spaces, repeated spaces, and tabs
- Copy and clear actions
- Responsive layout

## Counting behavior

- Character counts use Unicode grapheme clusters, so emoji and combined characters are counted as users generally perceive them.
- Word counts recognize Unicode letters and numbers, including combining marks and internal apostrophes.
- Repeated-word matching is case-insensitive and normalizes canonically equivalent Unicode forms.
- "Characters excluding whitespace" removes all whitespace characters, including spaces, tabs, and line breaks.
- Sentence counts are estimates based on terminal punctuation. They are not full linguistic parsing, so abbreviations can affect the result.
- Reading time is estimated at 200 words per minute.

## Privacy

Text is processed locally in your browser. There is no backend, account, or text upload.

## Development

Requires Node.js 22.13+ or 24+.

```bash
npm install
npm run dev
```

Run the quality checks:

```bash
npm run lint
npm test
npm run build
```

## Tech

React, TypeScript, Vite, Vitest, React Testing Library, and Oxlint.
