# Agent Setup Guide for The Shpak

Quick guide for AI agents to set up and work on this repo.

## Prerequisites

- Node.js 18+ installed
- Git configured

## Setup (Copy-Paste Ready)

```bash
# Clone the repo
git clone https://github.com/NissanOhana/the-shpak.git
cd the-shpak

# Install dependencies
npm install

# Start dev server
npm run dev
```

Dev server runs at: `http://localhost:5173/the-shpak/`

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npx tsx scripts/fetch-clearing-prices.ts` | Refresh course data from Wharton |

## Project Structure

```
the-shpak/
├── docs/              # Documentation (read TASKS.md for current work)
├── public/data/       # JSON data files (courses, stats, names)
├── scripts/           # Data fetching scripts
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components (PriceExplorer, BidAdvisor, etc.)
│   └── lib/           # Utilities
```

## Before Making Changes

1. Read `docs/TASKS.md` for pending work
2. Read `docs/TECH_SPEC.md` for architecture
3. Run `npm run dev` and verify the app works

## Making Changes

1. Make your changes
2. Run `npm run build` to verify no errors
3. Commit with descriptive message
4. Push to master: `git push origin master`

GitHub Actions auto-deploys to: https://nissanohana.github.io/the-shpak/

## Common Tasks

### Add a new feature to Price Explorer
Edit: `src/pages/PriceExplorer.tsx`

### Update course data
Run: `npx tsx scripts/fetch-clearing-prices.ts`

### Add new UI components
Create in: `src/components/` (follow existing patterns)

## Tech Stack (No Prior Knowledge Needed)

- **React**: UI framework (components return JSX like `<div>...</div>`)
- **TypeScript**: JavaScript with types (just follow existing patterns)
- **Tailwind CSS**: Styling via class names (e.g., `className="text-sm font-bold"`)
- **TanStack Query**: Data fetching (just copy existing `useQuery` patterns)

## Troubleshooting

**Build fails?** Check for TypeScript errors in the terminal output.

**Dev server not starting?** Run `npm install` first.

**Changes not showing?** Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R).
