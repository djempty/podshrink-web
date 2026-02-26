# Episode Noindex Implementation

## Summary
Added conditional `noindex` meta tags to episode pages that don't have completed shrinks, preventing ~28,687 duplicate content pages from being indexed while keeping the ~46 episodes with shrinks indexed.

## What Was Changed

### New File: `app/episodes/[id]/layout.tsx`
Created a server-side layout component that:
1. Fetches episode data from the API
2. Checks if a completed shrink exists for that episode
3. Generates dynamic metadata with appropriate robots directives

## How It Works

### Metadata Logic
```typescript
robots = hasShrink
  ? { index: true, follow: true }    // Episodes WITH shrinks → indexed
  : { index: false, follow: true }    // Episodes WITHOUT shrinks → noindex
```

### API Calls (Server-Side)
1. **Get Episode**: `GET /api/episodes/{id}`
2. **Get All Shrinks**: `GET /api/shrinks`
3. **Check**: Does a shrink exist where `episodeId === episode.id` AND `status === 'complete'` AND `audioUrl` exists?

### Impact
- **Show pages**: Unaffected, remain indexed
- **Episode pages WITH shrink**: `<meta name="robots" content="index, follow">`
- **Episode pages WITHOUT shrink**: `<meta name="robots" content="noindex, follow">`

## Verification

### Local Testing
```bash
# Build the project
npm run build

# Check a specific episode page
curl -I http://localhost:3000/episodes/123 | grep -i robot
```

### In Production
After deployment, check the HTML source of:
1. An episode WITH a shrink (should have no noindex or `index, follow`)
2. An episode WITHOUT a shrink (should have `noindex, follow`)

Example:
```bash
curl -s https://podshrink.com/episodes/[id] | grep -i robot
```

### Database Query
To confirm shrink counts:
```sql
-- Episodes with completed shrinks
SELECT COUNT(DISTINCT episode_id) 
FROM shrinks 
WHERE status = 'complete' AND audio_url IS NOT NULL;

-- Total episodes
SELECT COUNT(*) FROM episodes;
```

## Technical Details

- **File**: `app/episodes/[id]/layout.tsx`
- **Framework**: Next.js 14 App Router
- **Rendering**: Server-side (dynamic)
- **Caching**: `cache: 'no-store'` to ensure fresh data
- **Metadata API**: `generateMetadata` function (Next.js 13+)

## Commit
```
commit ebe2357
Author: [automated commit]
Date: [timestamp]

Add noindex meta tags to episode pages without shrinks

- Created layout.tsx for episodes/[id] route
- Dynamically generates metadata based on episode data
- Adds robots noindex for episodes without completed shrinks
- Episodes WITH shrinks remain indexed
- Show pages unaffected and stay indexed
```

## Next Steps
1. Review this implementation
2. Test locally if desired
3. Push to production: `git push origin main`
4. Monitor Google Search Console for deindexing of duplicate pages
5. Optionally add to sitemap.xml logic to exclude noindex pages
