# PodShrink Web - Quick Start

## Prerequisites

✅ Node.js 18+ installed  
✅ Backend API running at `http://localhost:3000` (or configure different URL)

## 🚀 Get Started in 3 Steps

### 1. Navigate to Project
```bash
cd /data/.openclaw/workspace/projects/podshrink-web
```

### 2. Install Dependencies (if not already done)
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at:
**http://localhost:3000** (or :3001 if 3000 is taken by backend)

## 🎯 What You Can Do

1. **Browse Shows** - View all added podcasts
2. **Search** - Find shows by title, author, or description
3. **Add New Show** - Enter an RSS feed URL
4. **View Episodes** - See all episodes for a show
5. **Shrink Episodes** - Create AI-powered summaries
6. **Listen** - Play original or shrunk audio

## 🔧 Configuration

### API URL
Edit `.env.local` to change the backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Port
To run on a different port:
```bash
npm run dev -- -p 3001
```

## 📁 Project Structure

```
podshrink-web/
├── app/           # Pages (Next.js App Router)
├── components/    # React components
├── lib/           # API client, store, types
└── public/        # Static assets
```

## 🎨 Key Features

- Dark theme (Apple Podcasts aesthetic)
- Responsive design (mobile & desktop)
- Persistent audio player
- Real-time shrink progress
- Voice selection (ElevenLabs)
- Duration controls (1-15 min)

## 🐛 Troubleshooting

### Port already in use
```bash
npm run dev -- -p 3001
```

### Can't connect to backend
1. Check backend is running: `curl http://localhost:3000/api/shows`
2. Update `NEXT_PUBLIC_API_URL` in `.env.local`

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t podshrink-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:3000 podshrink-web
```

## 📚 Documentation

- Full build notes: `/data/.openclaw/workspace/memory/projects/podshrink/frontend_build_notes.md`
- README: `README.md`
- Backend: `/data/.openclaw/workspace/projects/podshrink/`

---

**Need Help?** Check the build notes or README for detailed information.
