# Levion — Health & Habit Tracker

A mobile-first PWA for tracking medicines, water, exercise, coffee, and mood. Built with Next.js, Supabase, and Outfit font.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + React 18
- **Database:** Supabase (PostgreSQL)
- **Auth:** NextAuth.js (Google OAuth)
- **Styling:** Tailwind CSS + Custom CSS
- **Font:** Outfit (Google Fonts)
- **Animations:** Framer Motion + CSS
- **Deploy:** Netlify (free tier)
- **AI (v2):** Anthropic Claude API

## Quick Setup

### 1. Clone & Install
```bash
cd levion
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project (free)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from Settings > API

### 3. Set up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add `http://localhost:3000/api/auth/callback/google` as redirect URI
5. Copy Client ID and Client Secret

### 4. Environment Variables
```bash
cp .env.example .env.local
```
Fill in your Supabase URL, keys, and Google OAuth credentials.

### 5. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deploy to Netlify (Free)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → Import from Git
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Netlify dashboard
6. Install the `@netlify/plugin-nextjs` plugin

Or use the Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Project Structure
```
levion/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Main app (tab routing)
│   │   └── api/                # API routes
│   │       └── auth/           # NextAuth routes
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   └── AccordionCard   # Collapsible card wrapper
│   │   ├── cards/              # Feature cards
│   │   │   ├── MedicineCard    # Medicine tracking
│   │   │   ├── WaterCard       # Water logging
│   │   │   └── MoodCard        # Mood tracker + journal
│   │   ├── character/          # Animated mascot SVGs
│   │   └── BottomNav.jsx       # Tab navigation
│   ├── lib/
│   │   └── supabase.js         # Database functions
│   └── styles/
│       └── globals.css         # Design tokens + animations
├── supabase/
│   └── schema.sql              # Database schema (run in Supabase)
├── public/                     # PWA icons, manifest
├── .env.example                # Environment template
├── tailwind.config.js          # Design system config
├── next.config.js              # Next.js config
└── package.json
```

## Design System

### Colors (Teal monochrome)
- Primary: `#085041` (dark teal)
- Accent: `#1D9E75` (mid teal)
- Light: `#E1F5EE` (teal wash)
- Surface: `#f5f5f3`

### Typography
- Font: Outfit
- Weights: 300 (light), 400 (regular), 500 (medium)
- Headings: 500 weight, negative letter-spacing

### Components
- Cards: 14px radius, 0.5px borders, accordion collapse
- Icons: Monochrome SVG, teal on teal-50 background
- Badges: 6px radius pills
- Checkboxes: 22px, 7px radius

## Features (MVP)
- [x] Medicine tracking with alarm times
- [x] Water logging in ml with daily total
- [x] Exercise session logging
- [x] Coffee counter with daily limit
- [x] Mood slider (1-5) with journal
- [x] Calendar view with colored day boxes
- [x] Filter by task type
- [x] Day detail view
- [x] Stats page with progress bars
- [x] Journal/notes view
- [x] Streak tracking
- [x] Animated mascot characters
- [x] Collapsible accordion layout
- [x] Google auth

## Roadmap (v2)
- [ ] AI chat assistant (Anthropic API)
- [ ] Push notification reminders
- [ ] Family sharing / invite links
- [ ] Custom trackers
- [ ] Data export (CSV/PDF)
- [ ] Dark mode
- [ ] PWA offline support
```

## License
MIT
