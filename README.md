# Threatora

Threatora is an AI-powered web threat detection and digital trust intelligence app. The web app and API use React, Vite, and Express. An Expo Go client is available in [`mobile/`](./mobile).

[![Live Demo](https://img.shields.io/badge/Demo-Live%20App-brightgreen?style=for-the-badge)](https://threatora-6lyr.onrender.com)

[Threatora](https://threatora-6lyr.onrender.com) is an AI-powered web threat detection and digital trust intelligence app. The web app and API use React, Vite, and Express. An Expo Go client is available in [`mobile/`](./mobile).

🌐 **Live Application:** [https://threatora-6lyr.onrender.com](https://threatora-6lyr.onrender.com)

## Run locally

Prerequisites: Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Set `GEMINI_API_KEY` in a root `.env` file to enable Gemini-backed features; the scanners can also run without it.

## Deploy the web app

### Vercel

Import the repository into Vercel. The included [`vercel.json`](./vercel.json) builds the Vite site to `dist` and routes `/api/*` requests through the Express API. Add `GEMINI_API_KEY` in the Vercel project environment variables if you want to enable Gemini-backed features.

### Render

Create a Render Blueprint from the repository and select [`render.yaml`](./render.yaml). It builds the frontend and runs the Express server, which serves both the API and the built site. Set `GEMINI_API_KEY` in the service environment if needed; Render supplies the listening port.

## Run the Expo Go app

The mobile app in [`mobile/`](./mobile) includes URL scanning and suspicious-message analysis and connects to the same API.

1. Deploy the API to Vercel or Render, or start the development server with `npm run dev`.
2. In `mobile/.env`, set `EXPO_PUBLIC_API_URL` to the API's base URL (for local testing on a phone, use your computer's LAN IP, such as `http://192.168.1.20:3000`; `localhost` on the phone points to the phone itself).
3. Run `npm run mobile` from the repository root, then scan the QR code with Expo Go.

You can also configure or change the API URL in the mobile app. Use HTTPS for deployed services.
