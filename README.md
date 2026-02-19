# PodShrink Web

Modern, beautiful frontend for PodShrink — the AI-powered podcast summarization app.

## Features

- 🎨 Dark theme with Apple Podcasts aesthetic
- 📱 Fully responsive (mobile & desktop)
- 🎵 Persistent audio player
- ⚡ Fast Next.js 14 App Router
- 🎯 TypeScript throughout
- 🎭 Smooth animations & transitions
- 🔍 Real-time search
- ✨ Live shrink progress tracking

## Tech Stack

- **Next.js 14+** - App Router, Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management (audio player)
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
podshrink-web/
├── app/                    # Next.js pages (App Router)
│   ├── layout.tsx         # Root layout with sidebar & player
│   ├── page.tsx           # Home page
│   ├── browse/            # Browse/search page
│   ├── shows/[id]/        # Show detail page
│   ├── episodes/[id]/     # Episode detail & shrink page
│   ├── favorites/         # Favorites page
│   └── add/               # Add show page
├── components/            # React components
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── AudioPlayer.tsx    # Persistent audio player
│   ├── ShowCard.tsx       # Show thumbnail card
│   ├── EpisodeCard.tsx    # Episode list item
│   ├── ShrinkProgress.tsx # Shrink status indicator
│   ├── VoiceSelector.tsx  # Voice picker dropdown
│   ├── DurationSelector.tsx
│   └── SearchBar.tsx      # Debounced search input
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   ├── store.ts          # Zustand store (audio)
│   └── types.ts          # TypeScript types
└── public/               # Static assets
    ├── logo.svg
    └── placeholder.png
```

## API Integration

The app connects to the PodShrink backend API. Configure the URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Key Features

### Audio Player
- Global state management with Zustand
- Plays both original episodes and shrunk versions
- Persistent across page navigation
- Volume control, seek bar, time display

### Shrink Progress
- Real-time polling every 3 seconds
- Visual step indicator
- Status: transcribing → generating script → creating audio → complete
- Auto-stops polling when complete

### Responsive Design
- Collapsible sidebar on mobile
- Grid layouts adapt to screen size
- Touch-friendly controls
- Optimized images with next/image

## Color Palette

- Background: `#1a1a2e`
- Card: `#16213e`
- Hover: `#0f1729`
- Accent: `#5b21b6` (purple)
- Accent Light: `#7c3aed`

## Development Notes

- All pages are server components by default
- Interactive components use `'use client'`
- API calls from server components for initial data
- Client-side fetching for dynamic updates
- Loading states with skeleton screens
- Error boundaries for failed API calls

## Future Enhancements

- [ ] Favorites functionality (backend support needed)
- [ ] Playlist creation
- [ ] Download shrunk episodes
- [ ] Share functionality
- [ ] User authentication
- [ ] Playback speed control
- [ ] Queue management

---

Built with ❤️ for podcast lovers who want more time.
