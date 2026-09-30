# ChemLab — multilingual chemistry education portal

ChemLab is a multilingual chemistry learning platform with a server-side Gemini AI tutor, an interactive periodic table, equation balancer, virtual lab, molecule viewer, articles, and exam trainer.

## Features

- Russian, English, and Kazakh UI
- AI chemistry tutor through `POST /api/chat`
- Interactive chemistry tools and learning content
- Responsive UI with dark/light themes
- Offline-ready service worker in production builds

## Requirements

- Node.js 22+
- A Google Gemini API key for the AI tutor

## Local development

```bash
npm install
cp .env.example .env
# Edit .env and set GEMINI_API_KEY to your own key
npm run dev
```

Open `http://localhost:3000`.

The API key is read only on the server. Never commit `.env`, `.env.local`, or any API key to GitHub.

## Production build

```bash
npm run build
NODE_ENV=production GEMINI_API_KEY=your_key npm start
```

The server listens on `PORT` (default `3000`). If no key is configured, the site still loads and the chat returns a clear configuration message instead of exposing a secret or crashing.

## Scripts

- `npm run dev` — start the Vite development server through Express
- `npm run build` — type-check and build the frontend
- `npm run lint` — run TypeScript checks
- `npm run check:i18n` — validate translation coverage

## Security note

If a Gemini key was previously exposed anywhere, revoke it in Google AI Studio and create a replacement before running this project.

## License

Apache-2.0
