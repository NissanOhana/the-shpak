import { createRouter, createRootRoute, createRoute, Outlet, Link } from "@tanstack/react-router"
import { TrendingUp, Calculator, Target, BookOpen } from "lucide-react"
import { PriceExplorer } from "./pages/PriceExplorer"
import { BidAdvisor } from "./pages/BidAdvisor"
import { Simulator } from "./pages/Simulator"
import { Learn } from "./pages/Learn"

// Root layout component
function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                CM
              </div>
              <span className="font-bold text-lg">The Shpak</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 transition-colors hover:text-primary [&.active]:text-primary"
            >
              <TrendingUp className="h-4 w-4" />
              Price Explorer
            </Link>
            <Link
              to="/advisor"
              className="flex items-center gap-2 transition-colors hover:text-primary [&.active]:text-primary"
            >
              <Calculator className="h-4 w-4" />
              Bid Advisor
            </Link>
            <Link
              to="/simulator"
              className="flex items-center gap-2 transition-colors hover:text-primary [&.active]:text-primary"
            >
              <Target className="h-4 w-4" />
              Simulator
            </Link>
            <Link
              to="/learn"
              className="flex items-center gap-2 transition-colors hover:text-primary [&.active]:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              How It Works
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Course Match Simulator for Wharton MBA students. Not affiliated with Wharton.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Create routes
const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PriceExplorer,
})

const advisorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/advisor",
  component: BidAdvisor,
})

const simulatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/simulator",
  component: Simulator,
})

const learnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn",
  component: Learn,
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  advisorRoute,
  simulatorRoute,
  learnRoute,
])

// Create and export router
export const router = createRouter({ routeTree })

// Register router types
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
