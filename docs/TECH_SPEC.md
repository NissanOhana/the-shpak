# The Shpak - Technical Specification

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 7 |
| Routing | TanStack Router |
| Data Fetching | TanStack Query |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui style (Radix primitives) |
| Charts | Recharts |
| ML/Stats | simple-statistics (linear regression) |
| Deploy | GitHub Actions → GitHub Pages |

## Project Structure

```
the-shpak/
├── docs/                    # Documentation
├── public/
│   └── data/                # Generated JSON data files
│       ├── courses.json     # 888 courses with prices + predictions
│       ├── stats.json       # Aggregate statistics
│       └── departments.json # List of departments
├── scripts/
│   └── fetch-clearing-prices.ts  # Data pipeline script
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI components (shadcn style)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── select.tsx
│   │   ├── DepartmentFilter.tsx
│   │   ├── PriceChart.tsx
│   │   └── PriceRangeFilter.tsx
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn, formatPrice)
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── PriceExplorer.tsx
│   │   ├── BidAdvisor.tsx   # Placeholder
│   │   └── Learn.tsx        # Placeholder
│   ├── App.tsx              # Root component with layout
│   ├── router.tsx           # TanStack Router configuration
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind + theme variables
└── vite.config.ts           # Vite config with base path
```

## Data Architecture

### Course Data Model

```typescript
interface CourseData {
  section: string          // e.g., "FNCE1000001"
  courseCode: string       // e.g., "FNCE100"
  department: string       // e.g., "FNCE"
  prices: {
    term: string           // e.g., "Fall2024"
    price: number          // Clearing price
  }[]
  avgPrice: number         // Historical average
  latestPrice: number      // Most recent price
  predictedPrice: number   // Linear regression prediction
  priceChange: number      // % change from previous term
  trend: 'up' | 'down' | 'stable'
}
```

### Data Pipeline

1. `scripts/fetch-clearing-prices.ts` downloads xlsx files from Wharton
2. Parses each file to extract section → price mappings
3. Groups by section across all terms
4. Runs linear regression to predict next semester
5. Outputs to `public/data/*.json`

Run with: `npx tsx scripts/fetch-clearing-prices.ts`

## Design System

### Colors (Wharton-inspired)

```css
--wharton-blue: #004785;
--wharton-red: #A90533;
```

### Badge Variants

| Variant | Use Case |
|---------|----------|
| `muted` | Free courses (price = 0) |
| `success` | Low price (< 200) |
| `default` | Medium price (200-500) |
| `warning` | High price (500-1000) |
| `destructive` | Very high price (> 1000) |

## Deployment

### GitHub Pages

- Base URL: `https://nissanohana.github.io/the-shpak/`
- Workflow: `.github/workflows/deploy.yml`
- Triggers on push to master

### Local Development

```bash
yarn install
yarn dev          # Start dev server at localhost:5174
yarn build        # Build for production
yarn preview      # Preview production build
```

## API / Data Fetching

All data is static JSON served from `/the-shpak/data/`:

```typescript
// Courses with price history
fetch('/the-shpak/data/courses.json')

// Aggregate stats
fetch('/the-shpak/data/stats.json')

// Department list
fetch('/the-shpak/data/departments.json')
```

TanStack Query handles caching and loading states.

## Performance Considerations

- Initial load: ~800KB courses.json (consider pagination for P2)
- Table virtualization needed for > 100 rows (current: slice to 100)
- Chart rendering: lazy load expanded rows only
