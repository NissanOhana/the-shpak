import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Simulator() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Simulator</h1>
        <p className="text-muted-foreground mt-2">
          Enter your utilities and see what schedule you'd likely receive
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Coming Soon
            <Badge variant="secondary">In Development</Badge>
          </CardTitle>
          <CardDescription>
            Simulate your Course Match results before the real thing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">How it will work:</h3>
            <ul className="text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li>1. Enter utility values for your desired courses</li>
              <li>2. Set your budget (4,000 for 1st year, 5,000 for 2nd year)</li>
              <li>3. Run the simulation using historical clearing prices</li>
              <li>4. See which courses you would likely receive</li>
              <li>5. Adjust and iterate until satisfied</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
