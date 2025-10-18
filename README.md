# SecondChance Global Frontend

> 유기견 정보의 글로벌 공유를 통한 국제 입양 촉진 프로젝트

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query
- **i18n**: react-i18next
- **Analytics**: Google Analytics 4

## 📋 Prerequisites

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

**Required Environment Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics Measurement ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_API_URL` | API Base URL | `http://localhost:3000/api` |
| `GCP_TRANSLATION_API_KEY` | GCP Translation API Key (optional) | - |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utility functions
├── stores/              # Zustand stores
├── types/               # TypeScript types
├── public/              # Static assets
└── i18n/                # Internationalization
```

## 🌍 Supported Languages

- 한국어 (Korean)
- English
- 日本語 (Japanese)
- 中文简体 (Chinese Simplified)

## 🤝 Contributing

This project follows conventional commits. Please ensure your commits follow this format.

## 📄 License

This project is private and proprietary.

---

**Team Gi-hoe (기회)** - Giving second chances to rescue dogs worldwide 🐾
