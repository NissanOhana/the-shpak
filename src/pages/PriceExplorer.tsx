import { useState, useMemo } from "react"
import { Search, TrendingUp, TrendingDown, Minus, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { samplePrices, courseNames } from "@/data/sample-prices"
import { getCourseCode, formatPrice } from "@/lib/utils"

type SortField = "section" | "price" | "change"
type SortOrder = "asc" | "desc"

export function PriceExplorer() {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("price")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Process prices into courses with trends
  const coursesWithTrends = useMemo(() => {
    const courseMap = new Map<string, {
      section: string
      courseCode: string
      name: string
      latestPrice: number
      previousPrice: number | null
      priceChange: number | null
      term: string
    }>()

    // Group by section and get latest price
    const latestTerm = "Spring2026"
    const previousTerm = "Fall2025"

    samplePrices.forEach((p) => {
      const existing = courseMap.get(p.section)
      if (p.term === latestTerm) {
        const prev = samplePrices.find(
          (pp) => pp.section === p.section && pp.term === previousTerm
        )
        const change = prev ? ((p.price - prev.price) / (prev.price || 1)) * 100 : null
        courseMap.set(p.section, {
          section: p.section,
          courseCode: getCourseCode(p.section),
          name: courseNames[getCourseCode(p.section)] || "Unknown Course",
          latestPrice: p.price,
          previousPrice: prev?.price ?? null,
          priceChange: change,
          term: p.term,
        })
      } else if (!existing) {
        courseMap.set(p.section, {
          section: p.section,
          courseCode: getCourseCode(p.section),
          name: courseNames[getCourseCode(p.section)] || "Unknown Course",
          latestPrice: p.price,
          previousPrice: null,
          priceChange: null,
          term: p.term,
        })
      }
    })

    return Array.from(courseMap.values())
  }, [])

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = coursesWithTrends.filter(
      (c) =>
        c.section.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.courseCode.toLowerCase().includes(search.toLowerCase())
    )

    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "section":
          comparison = a.section.localeCompare(b.section)
          break
        case "price":
          comparison = a.latestPrice - b.latestPrice
          break
        case "change":
          comparison = (a.priceChange ?? 0) - (b.priceChange ?? 0)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [coursesWithTrends, search, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const getPriceColor = (price: number) => {
    if (price === 0) return "muted"
    if (price < 200) return "success"
    if (price < 400) return "default"
    if (price < 600) return "warning"
    return "destructive"
  }

  const getChangeIcon = (change: number | null) => {
    if (change === null) return <Minus className="h-4 w-4 text-muted-foreground" />
    if (change > 5) return <TrendingUp className="h-4 w-4 text-destructive" />
    if (change < -5) return <TrendingDown className="h-4 w-4 text-success" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Price Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Browse historical clearing prices and find undervalued courses
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesWithTrends.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                coursesWithTrends.reduce((sum, c) => sum + c.latestPrice, 0) /
                  coursesWithTrends.length
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coursesWithTrends.filter((c) => c.latestPrice === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Demand (500+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coursesWithTrends.filter((c) => c.latestPrice >= 500).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Course Clearing Prices</CardTitle>
          <CardDescription>
            Spring 2026 clearing prices with comparison to Fall 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by course code or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("section")}
                      className="-ml-3"
                    >
                      Course
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("price")}
                      className="-mr-3"
                    >
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("change")}
                      className="-mr-3"
                    >
                      Change
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.section} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-mono text-sm">
                      {course.courseCode}
                      <span className="text-muted-foreground">-{course.section.slice(7)}</span>
                    </td>
                    <td className="p-4 align-middle">{course.name}</td>
                    <td className="p-4 align-middle text-right">
                      <Badge variant={getPriceColor(course.latestPrice)}>
                        {formatPrice(course.latestPrice)}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        {getChangeIcon(course.priceChange)}
                        <span
                          className={
                            course.priceChange === null
                              ? "text-muted-foreground"
                              : course.priceChange > 0
                                ? "text-destructive"
                                : "text-success"
                          }
                        >
                          {course.priceChange !== null
                            ? `${course.priceChange > 0 ? "+" : ""}${course.priceChange.toFixed(0)}%`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
