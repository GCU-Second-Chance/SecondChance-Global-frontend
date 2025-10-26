# SecondChance Global — Frontend

> Every Share is a Second Chance. Create a 4-cut story with QR and share it globally to boost rescue dog adoptions.

## 🚀 Overview & Tech

SecondChance Global is a mobile-first web app that turns empathy into action:

- Create a 4-cut “challenge” image (frame + photos + info band + QR)
- QR links to the dog’s profile (share pages or ID-based route)
- Social-first UX: quick matching, instant preview, Web Share API
- English-first display: Korean age/location are auto-Englishized

Tech stack:

- Framework: Next.js 15 (App Router)
- React 19, TypeScript 5
- Styling: Tailwind CSS 4, Framer Motion
- State/Data: Zustand, @tanstack/react-query 5
- i18n: react-i18next
- Analytics: GA4 (gtag) and/or Google Tag Manager

## 📋 Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GCU-Second-Chance/SecondChance-Global-frontend.git
cd SecondChance-Global-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Common variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | API base (e.g., `http://localhost:3001/api`) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID (optional) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 Measurement ID (optional) |
| `NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS` | `true` to enable React Query Devtools (optional) |
| `GEMINI_API_KEY` | AI transform route (experimental) (optional) |
| `SCG_RATE_SECRET` | Cookie signing for “Fortune of the day” and simple rate-limits (optional) |
| `GCP_TRANSLATION_API_KEY` | For optional translation workflows (optional) |

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🚀 Deployment

This project is deployed on [Vercel](https://vercel.com).
URL : https://www.gihoe.site

### Deploy to Vercel

1. **Install Vercel CLI (optional)**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables in Vercel Dashboard**
   - `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GTM_ID` and/or `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Automatic Deployments

- **Production**: Commits to `main` branch
- **Preview**: Pull requests

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
npm run format:check # Check Prettier formatting
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure

```
.
├── app/
│  ├── (main)/layout.tsx            # Main layout
│  ├── page.tsx                     # Landing (Hero, Quick Stats, Random Dogs)
│  ├── challenge/
│  │  ├── select-frame/page.tsx     # Step 1
│  │  ├── match-dog/page.tsx        # Step 2 (10-card window + Rematch/Reload)
│  │  ├── upload-photos/page.tsx    # Step 3 (upload/camera)
│  │  └── result/page.tsx           # Step 4 (result + share)
│  └── share/
│     ├── id/[id]/page.tsx          # Share-by-ID
│     └── info/[info]/page.tsx      # Share-by-encoded payload
├── components/
│  ├── challenge/                   # Carousel, cards, frame layouts
│  ├── landing/                     # Hero, Quick Stats, Random Dogs
│  └── layout/                      # Header, Footer, Container
├── lib/
│  ├── api/                         # fetcher, errors, dogs.ts
│  ├── analytics/                   # gtag wrapper + typed logger
│  ├── i18n/                        # react-i18next config/provider
│  ├── motion/                      # framer-motion presets
│  ├── react-query/                 # client + provider
│  └── utils/                       # capture, qr, share, englishize, frame-overlay
├── stores/                         # Zustand store (challenge flow)
├── data/                           # Mock data (dogs, frames)
└── public/                         # Static assets
```

## 🌍 Supported Languages

- 한국어 (Korean)
- English
- 日本語 (Japanese)
- 中文简体 (Chinese Simplified)

## 📊 Analytics

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` for GA4, or `NEXT_PUBLIC_GTM_ID` for GTM. Typed wrappers live in `lib/analytics/logger.ts`; event types in `lib/analytics/events.ts`. Key events:

**Challenge Flow:**
- `dog_matched` - When a dog is matched with a user
- `challenge_step` - Step progression (1-4)
- `challenge_completed` - Challenge completion with timing

**Sharing:**
- `dog_shared` - When share button is clicked
- `share_completed` - When share is successful
- `share_platform` - Platform selection tracking

**QR Code:**
- `qr_scanned` - QR code scanned from result
- `challenge_conversion` - Actions taken after QR scan
- `challenge_to_share` - Additional shares from QR

**User Interactions:**
- `frame_selected` - Frame template selection
- `photo_uploaded` - Photo upload method tracking
- `result_downloaded` - Result image download

Remote image domains are whitelisted in `next.config.ts` for `next/image`.

## 🧭 Flow & UX Notes

- Matching: 10 cards per window via carousel; Rematch shows next 10; after 30, Reload fetches a new batch.
- Englishization: Korean age/location are converted to English (`lib/utils/englishize.ts`). Gyeonggi-do cities are mapped and generic cleanup applies.
- Photos: Only user photos are mirrored; dog photos stay unflipped. Mirroring is preserved by html2canvas via `onclone` patch (`lib/utils/capture.ts`).
- Sharing: Web Share API with fallback to link copy. Share URLs use `/share/id/[id]` or `/share/info/[info]` (Unicode-safe base64url).

## 🧩 API Summary

- `GET /api/v1/dogs/random` → batch; client slices for carousel windows
- `GET /api/v1/dogs/:id` (path-first; legacy body fallback supported)
- `POST /api/v1/challenge/:id/upload` (mocked upload; 48h expiry simulation)

Normalization & fallbacks: see `lib/api/dogs.ts`.

## 🧪 Tips & Troubleshooting

- Web Share not supported → link copy fallback appears.
- Unicode payloads → handled with Unicode-safe base64url (no `btoa` issues).
- React Query Devtools → enable with `NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS=true`.
- Capture mirroring missing → ensure user slots have `scale-x-[-1]` class.

## 🤝 Contributing

This project follows conventional commits. Please ensure your commits follow this format.

## 📄 License

This project is private and proprietary.

---

**Team Gi-hoe (기회)** — Giving second chances to rescue dogs worldwide 🐾
