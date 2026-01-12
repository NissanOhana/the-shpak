import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Learn() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">How Course Match Works</h1>
        <p className="text-muted-foreground mt-2">
          Understanding the CEEI algorithm and how to use it effectively
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>The Basics</CardTitle>
            <CardDescription>Core concepts you need to know</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Budget</h4>
              <p className="text-muted-foreground">
                First-years get 4,000 points. Second-years get 5,000 points.
                Points don't carry over between semesters.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Utilities (1-100)</h4>
              <p className="text-muted-foreground">
                You assign relative values to courses. A course at 100 is 10x more
                valuable to you than a course at 10. These are RELATIVE, not absolute.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Clearing Prices</h4>
              <p className="text-muted-foreground">
                After the algorithm runs, each course gets a price reflecting demand.
                High prices = competitive courses.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategy Tips</CardTitle>
            <CardDescription>How to optimize your bids</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Check Historical Prices</h4>
              <p className="text-muted-foreground">
                Use this tool to see what courses typically clear at. If a course
                historically clears at 300, bidding 50 utility won't get you in.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Use Course Links</h4>
              <p className="text-muted-foreground">
                Link complementary courses (positive) or mark substitutes (treat as same).
                Mark schedule conflicts as negative.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Don't Bid Exactly on Price</h4>
              <p className="text-muted-foreground">
                If a course clears at 300 and you value it highly, bid HIGHER than 300.
                The algorithm only takes what it needs - surplus goes back to you.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>The Algorithm (CEEI)</CardTitle>
            <CardDescription>
              Approximate Competitive Equilibrium from Equal Incomes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Course Match uses a mechanism designed by economist Eric Budish. The key insight:
              it finds prices that "clear the market" - where every student can afford their
              optimal bundle given those prices, and all seats are filled.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">Step 1: Collect Utilities</h4>
                <p className="text-muted-foreground text-xs">
                  Every student reports their relative preferences for all courses they want.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">Step 2: Find Equilibrium</h4>
                <p className="text-muted-foreground text-xs">
                  Algorithm searches for prices where supply = demand for all courses.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">Step 3: Allocate</h4>
                <p className="text-muted-foreground text-xs">
                  Each student gets their optimal affordable schedule given clearing prices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
