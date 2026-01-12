# The Shpak - Tasks & Progress

## Completed

### Phase 1: Project Setup
- [x] Initialize Vite + React + TypeScript project
- [x] Configure TanStack Router with 4 routes (/, /explore, /advisor, /learn)
- [x] Configure TanStack Query
- [x] Set up Tailwind CSS v4 with Wharton theme
- [x] Create base UI components (shadcn style): Button, Card, Badge, Input, Select
- [x] Create responsive layout with navigation
- [x] Set up GitHub Actions for auto-deploy to GitHub Pages

### Phase 2: Data Pipeline
- [x] Research Wharton Course Match data sources
- [x] Identify all 26 xlsx file URLs (Fall 2013 - Spring 2026)
- [x] Create `fetch-clearing-prices.ts` script
- [x] Download and parse xlsx files with node xlsx library
- [x] Handle different column formats across years
- [x] Group prices by section across terms
- [x] Implement linear regression for price predictions (simple-statistics)
- [x] Output courses.json, stats.json, departments.json
- [x] Fix ESM compatibility (__dirname issue)

### Phase 3: Price Explorer UI
- [x] Create PriceExplorer page with real data
- [x] Add search by course code/section/department
- [x] Add department filter dropdown
- [x] Add price range filter (Free, Low, Medium, High)
- [x] Add sortable columns (course, price, predicted, change)
- [x] Create PriceChart component with Recharts
- [x] Add expandable rows showing price history charts
- [x] Add predictions toggle with badges
- [x] Show aggregate stats (total courses, departments, avg price, etc.)

---

## In Progress

### Phase 4: Hidden Gems Feature
- [ ] Add Hidden Gems section to Price Explorer
  - Courses with latestPrice > 0 and < 100
  - At least 3 semesters of history
  - Sorted by average price
- [ ] Add "Rising Stars" - low price but predicted to increase
- [ ] Add "Stable Value" - consistent low prices

---

## Pending

### Phase 5: Bid Advisor (P2)
- [ ] Create BidAdvisor page UI
- [ ] Add course selection with utility sliders (1-100)
- [ ] Show recommended bid amounts based on predictions
- [ ] Add risk/probability indicators
- [ ] Implement budget constraint visualization (4000/5000 points)

### Phase 6: Simulator (P2)
- [ ] Create simulation engine
- [ ] Allow scenario comparisons
- [ ] Show expected outcomes for different strategies

### Phase 7: Learn Section (P3)
- [ ] Create interactive CEEI algorithm explanation
- [ ] Add worked examples
- [ ] Document bidding strategies

### Tech Debt / Improvements
- [ ] Investigate 2021+ xlsx format (currently returns 0 courses)
- [ ] Add table virtualization for better performance
- [ ] Add course name lookup (not just codes)
- [ ] Consider data refresh automation (scheduled fetch)
- [ ] Add mobile responsive improvements
- [ ] Add error boundaries and loading skeletons

---

## Commits History

| Hash | Description |
|------|-------------|
| `27261c3` | Initial commit: Course Match Simulator (The Shpak) |
| `0cde9ca` | Add GitHub Actions deployment workflow |
| `9a1900d` | Fix TypeScript type resolution for GitHub Actions build |
| `55c4274` | Add real clearing price data and Price Explorer with predictions |

---

## Links

- **Repo**: https://github.com/NissanOhana/the-shpak
- **Live**: https://nissanohana.github.io/the-shpak/
- **Data Source**: https://mba-inside.wharton.upenn.edu/course-match/
