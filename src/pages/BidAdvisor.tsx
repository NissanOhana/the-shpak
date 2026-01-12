import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function BidAdvisor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bid Advisor</h1>
        <p className="text-muted-foreground mt-2">
          Get recommendations on what utility values to assign based on historical prices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Coming Soon
            <Badge variant="secondary">In Development</Badge>
          </CardTitle>
          <CardDescription>
            This module will help you optimize your utility assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">How it will work:</h3>
            <ul className="text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li>1. Add courses to your wishlist</li>
              <li>2. Set your priority (must-have vs nice-to-have)</li>
              <li>3. Get recommended utility values based on historical clearing prices</li>
              <li>4. See probability of getting each course</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
