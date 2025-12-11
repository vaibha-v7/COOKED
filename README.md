# COOKED 

Get roasted by your own Spotify history. COOKED fetches your top artists/tracks/genres via Spotify, then Groq AI writes brutal, Wrapped-style roasts.

## Stack
- Frontend: React 18 (Vite), HashRouter, Tailwind v4, Press Start 2P + Space Grotesk
- Backend: Node/Express, Spotify Web API, Groq API
- Auth: Spotify OAuth2 (access token passed via URL → stored in localStorage)

## Project Structure
```
backend/   Express server, Spotify + Groq integration
frontend/  Vite React UI
```

## Prerequisites
- Node.js 18+
- Spotify Developer app (Client ID/Secret, Redirect URI)
- Groq API key
- Optional: ngrok for HTTPS redirect during local dev

## Environment Variables
Create `.env` files (not committed). Examples:

**backend/.env**
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=https://your-ngrok-or-domain/callback
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
PORT=3000
```

**frontend/.env**
```
VITE_BACKEND_URL=http://localhost:3000
```

## Setup & Run (local)
### Backend
```bash
cd backend
npm install
node app.js
```
- Serves on `http://localhost:3000`
- Exposes `/login`, `/callback`, `/profile`, `/top-artists`, `/top-tracks`, `/top-genres`, `/personality`

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host --port 5173
```
Open the shown URL (e.g., http://localhost:5173). App uses HashRouter, so paths look like `/#/profile`.

## OAuth Flow (dev)
1. From landing page, click **Login with Spotify** → hits backend `/login`.
2. Spotify redirects to backend `/callback` → exchanges code → redirects to `/#/profile?token=...`.
3. Frontend stores token in `localStorage` (`spotify_token`) and uses it in `Authorization: Bearer <token>` for all calls.

## Frontend Routes
- `/#/` (Main): CTA to start login
- `/#/profile`: Shows user + CTA to roast
- `/#/roast`: Top artists + roast, Next → Top Tracks
- `/#/top-tracks`: Top tracks + roast, Next → Top Genres
- `/#/top-genres`: Top genres + roast, Next → Personality
- `/#/personality`: Music personality and roast

## Backend Endpoints (expects `Authorization: Bearer <token>`)
- `GET /login` → Spotify authorize redirect
- `GET /callback` → exchanges code, redirects to frontend with `token` query param
- `GET /profile` → Spotify `/me`
- `GET /top-artists` → returns `{ artists, roast }`
- `GET /top-tracks` → returns `{ tracks, roast }`
- `GET /top-genres` → returns `{ genres, roast }`
- `GET /personality` → returns `{ personality, roast, audio_profile }`

## Production Notes
- Use a real domain + HTTPS for Spotify Redirect URI.
- Update `FRONTEND_URL` and `REDIRECT_URI` in backend `.env` accordingly.
- Set `VITE_BACKEND_URL` to your deployed backend URL.

## Troubleshooting
- Token missing: ensure the `token` query param is present on `/#/profile` after login; check `localStorage.spotify_token`.
- 401 errors: verify `Authorization: Bearer <token>` header is sent; confirm token not expired.
- CORS: backend `FRONTEND_URL` must match your frontend origin (including port).
- Ngrok: use the ngrok HTTPS URL for `REDIRECT_URI` and add it to Spotify app settings.

## Deploy (outline)
- Backend: deploy to a Node-friendly host (Azure App Service, Render, Railway, etc.). Set env vars there.
- Frontend: `npm run build` in `frontend/`, then host `dist/` (Netlify/Vercel/Static host). Point env `VITE_BACKEND_URL` to deployed backend.

## Credits
- Created by [@vaibha_v7](https://twitter.com/vaibha_v7)

Enjoy the roast. 🎧🔥
