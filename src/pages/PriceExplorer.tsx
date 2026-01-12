import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, TrendingUp, TrendingDown, Minus, ArrowUpDown, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DepartmentFilter } from "@/components/DepartmentFilter"
import { PriceRangeFilter } from "@/components/PriceRangeFilter"
import { PriceChart } from "@/components/PriceChart"
import { formatPrice } from "@/lib/utils"

interface CourseData {
  section: string
  courseCode: string
  department: string
  prices: { term: string; price: number }[]
  avgPrice: number
  latestPrice: number
  predictedPrice: number
  priceChange: number
  trend: 'up' | 'down' | 'stable'
}

interface Stats {
  totalCourses: number
  departments: number
  avgPrice: number
  freeCourses: number
  highDemand: number
  termsAvailable: string[]
  lastUpdated: string
}

type SortField = "section" | "price" | "predicted" | "change"
type SortOrder = "asc" | "desc"

async function fetchCourses(): Promise<CourseData[]> {
  const res = await fetch('/the-shpak/data/courses.json')
  if (!res.ok) throw new Error('Failed to fetch courses')
  return res.json()
}

async function fetchStats(): Promise<Stats> {
  const res = await fetch('/the-shpak/data/stats.json')
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

async function fetchDepartments(): Promise<string[]> {
  const res = await fetch('/the-shpak/data/departments.json')
  if (!res.ok) throw new Error('Failed to fetch departments')
  return res.json()
}

async function fetchCourseNames(): Promise<Record<string, string>> {
  const res = await fetch('/the-shpak/data/course-names.json')
  if (!res.ok) throw new Error('Failed to fetch course names')
  return res.json()
}

export function PriceExplorer() {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("price")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [department, setDepartment] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [showPredictions, setShowPredictions] = useState(false)

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  })

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  })

  const { data: courseNames = {} } = useQuery({
    queryKey: ['courseNames'],
    queryFn: fetchCourseNames,
  })

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = courses.filter((c) => {
      // Search filter - also search in course names
      const courseName = courseNames[c.courseCode] || ''
      const matchesSearch =
        c.section.toLowerCase().includes(search.toLowerCase()) ||
        c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
        c.department.toLowerCase().includes(search.toLowerCase()) ||
        courseName.toLowerCase().includes(search.toLowerCase())

      // Department filter
      const matchesDept = department === "all" || c.department === department

      // Price range filter
      let matchesPrice = true
      if (priceRange === "free") matchesPrice = c.latestPrice === 0
      else if (priceRange === "low") matchesPrice = c.latestPrice > 0 && c.latestPrice < 200
      else if (priceRange === "medium") matchesPrice = c.latestPrice >= 200 && c.latestPrice <= 500
      else if (priceRange === "high") matchesPrice = c.latestPrice > 500

      return matchesSearch && matchesDept && matchesPrice
    })

    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "section":
          comparison = a.section.localeCompare(b.section)
          break
        case "price":
          comparison = a.latestPrice - b.latestPrice
          break
        case "predicted":
          comparison = a.predictedPrice - b.predictedPrice
          break
        case "change":
          comparison = a.priceChange - b.priceChange
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [courses, search, department, priceRange, sortField, sortOrder, courseNames])

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
    if (price < 500) return "default"
    if (price < 1000) return "warning"
    return "destructive"
  }

  const getChangeIcon = (change: number) => {
    if (change > 10) return <TrendingUp className="h-4 w-4 text-destructive" />
    if (change < -10) return <TrendingDown className="h-4 w-4 text-success" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getPredictionBadge = (course: CourseData) => {
    const diff = course.predictedPrice - course.latestPrice
    if (Math.abs(diff) < 50) return null
    if (diff > 0) {
      return <Badge variant="destructive" className="text-xs">+{formatPrice(diff)} predicted</Badge>
    }
    return <Badge variant="success" className="text-xs">{formatPrice(diff)} predicted</Badge>
  }

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading course data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Price Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Browse historical clearing prices, predictions, and find undervalued courses
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.departments || departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats?.avgPrice || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.freeCourses || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Demand (500+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.highDemand || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Clearing Prices</CardTitle>
              <CardDescription>
                Historical clearing prices with regression-based predictions
              </CardDescription>
            </div>
            <Button
              variant={showPredictions ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPredictions(!showPredictions)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Show Predictions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by course code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <DepartmentFilter
              value={department}
              onChange={setDepartment}
              departments={departments}
            />
            <PriceRangeFilter
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>

          <div className="text-sm text-muted-foreground mb-2">
            Showing {filteredCourses.length} of {courses.length} courses
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
                    Dept
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("price")}
                      className="-mr-3"
                    >
                      Latest Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  {showPredictions && (
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort("predicted")}
                        className="-mr-3"
                      >
                        Predicted
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                  )}
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
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-12">
                    History
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.slice(0, 100).map((course) => (
                  <>
                    <tr
                      key={course.section}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                      onClick={() => setExpandedCourse(expandedCourse === course.section ? null : course.section)}
                    >
                      <td className="p-4 align-middle">
                        <div className="font-mono text-sm">
                          {course.courseCode}
                          <span className="text-muted-foreground">-{course.section.slice(7)}</span>
                        </div>
                        {courseNames[course.courseCode] && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {courseNames[course.courseCode]}
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant="outline">{course.department}</Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Badge variant={getPriceColor(course.latestPrice)}>
                          {formatPrice(course.latestPrice)}
                        </Badge>
                      </td>
                      {showPredictions && (
                        <td className="p-4 align-middle text-right">
                          <span className="font-mono">{formatPrice(course.predictedPrice)}</span>
                          {getPredictionBadge(course)}
                        </td>
                      )}
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          {getChangeIcon(course.priceChange)}
                          <span
                            className={
                              Math.abs(course.priceChange) < 5
                                ? "text-muted-foreground"
                                : course.priceChange > 0
                                  ? "text-destructive"
                                  : "text-success"
                            }
                          >
                            {course.priceChange > 0 ? "+" : ""}{course.priceChange.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {expandedCourse === course.section ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                    {expandedCourse === course.section && (
                      <tr key={`${course.section}-chart`}>
                        <td colSpan={showPredictions ? 6 : 5} className="p-4 bg-muted/25">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">
                                {course.courseCode}{courseNames[course.courseCode] ? `: ${courseNames[course.courseCode]}` : ''} ({course.prices.length} terms)
                              </h4>
                              <div className="text-sm text-muted-foreground">
                                Avg: {formatPrice(course.avgPrice)} | Latest: {formatPrice(course.latestPrice)} | Predicted: {formatPrice(course.predictedPrice)}
                              </div>
                            </div>
                            <PriceChart data={course.prices} courseCode={course.courseCode} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCourses.length > 100 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing first 100 results. Use filters to narrow down.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
