/**
 * Script to download and parse Wharton Course Match clearing prices
 * Downloads xlsx files from mba-inside.wharton.upenn.edu and converts to JSON
 */

import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { linearRegression, linearRegressionLine } from 'simple-statistics'

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ClearingPrice {
  section: string
  price: number
  term: string
  termIndex: number
}

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

// Correct URLs from Wharton MBA Inside page
const CLEARING_PRICE_FILES = [
  { term: 'Fall2013', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/04/13cclearingprices.xlsx' },
  { term: 'Spring2014', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/04/14aclearingprices.xlsx' },
  { term: 'Fall2014', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/04/14cclearingprices.xlsx' },
  { term: 'Spring2015', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/04/15aclearingprices.xlsx' },
  { term: 'Fall2015', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/04/15cclearingprices.xlsx' },
  { term: 'Spring2016', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/04/16aclearingprices.xlsx' },
  { term: 'Fall2016', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/08/ClearingPrices16C.xlsx' },
  { term: 'Spring2017', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2016/12/Clearing-Prices-17A.xlsx' },
  { term: 'Fall2017', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2017/08/Clearing-Prices-17C.xlsx' },
  { term: 'Spring2018', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2017/12/Clearing-Prices-18A.xlsx' },
  { term: 'Fall2018', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2018/08/18CClearingPrices.xlsx' },
  { term: 'Spring2019', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2019/12/19A-Clearing-Prices.xlsx' },
  { term: 'Fall2019', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2019/08/19C-Website-Prices.xlsx' },
  { term: 'Spring2020', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2019/12/20A-clearing-prices.xlsx' },
  { term: 'Fall2020', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2020/08/Fall-2020-Clearing-Prices-Student-View-08312020.xlsx' },
  { term: 'Spring2021', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2021/01/Spring-2021-Course-Match-Clearing-Prices.xlsx' },
  { term: 'Fall2021', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2021/08/Fall-2021-Clearing-Prices.xlsx' },
  { term: 'Spring2022', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2022/01/Spring-2022-Course-Match-Clearing-Prices.xlsx' },
  { term: 'Fall2022', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2022/08/Fall-2022-Course-Match-clearing-prices.xlsx' },
  { term: 'Spring2023', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2022/12/Spring-2023-Course-Match-Clearing-Prices.xlsx' },
  { term: 'Fall2023', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2023/08/Fall-2023-Course-Match-Clearing-Prices-08242023.xlsx' },
  { term: 'Spring2024', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2023/12/Spring-2024-Course-Match-Clearing-Prices.xlsx' },
  { term: 'Fall2024', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2024/08/Fall-2024-Course-Match-clearing-prices.xlsx' },
  { term: 'Spring2025', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2024/12/Spring-2025-Course-Match-Clearing-Prices.xlsx' },
  { term: 'Fall2025', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2025/08/Fall-2025-Course-Match-clearing-prices.xlsx' },
  { term: 'Spring2026', url: 'https://mba-inside.wharton.upenn.edu/wp-content/uploads/2025/12/Spring-2026-Clearing-Prices.xlsx' },
]

async function downloadFile(url: string): Promise<ArrayBuffer | null> {
  try {
    console.log(`  Fetching: ${url.split('/').pop()}`)
    const response = await fetch(url)
    if (!response.ok) {
      console.log(`    Failed: ${response.status}`)
      return null
    }
    return await response.arrayBuffer()
  } catch (error) {
    console.log(`    Error: ${error}`)
    return null
  }
}

function parseXlsx(buffer: ArrayBuffer, term: string): ClearingPrice[] {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]

  const prices: ClearingPrice[] = []

  // Find the Section and Price columns
  const headers = data[0] as string[] | undefined
  if (!headers) return prices

  let sectionCol = -1
  let priceCol = -1

  headers.forEach((h, i) => {
    const header = String(h || '').toLowerCase()
    if (header.includes('section') || header.includes('course')) sectionCol = i
    if (header.includes('price') || header.includes('clearing')) priceCol = i
  })

  // If we couldn't find columns, try common patterns
  if (sectionCol === -1) sectionCol = 0
  if (priceCol === -1) priceCol = headers.length - 1

  // Parse rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length === 0) continue

    const section = String(row[sectionCol] || '').trim().toUpperCase()
    const priceVal = row[priceCol]

    // Validate section format (4 letters + 6-7 digits)
    if (!/^[A-Z]{4}\d{6,7}$/.test(section)) continue

    const price = typeof priceVal === 'number' ? priceVal : parseFloat(String(priceVal)) || 0

    prices.push({
      section,
      price: Math.round(price),
      term,
      termIndex: 0,
    })
  }

  return prices
}

function predictNextPrice(prices: { termIndex: number; price: number }[]): number {
  if (prices.length < 2) {
    return prices[0]?.price || 0
  }

  const data: [number, number][] = prices.map((p) => [p.termIndex, p.price])
  const regression = linearRegression(data)
  const predict = linearRegressionLine(regression)

  const nextTermIndex = Math.max(...prices.map((p) => p.termIndex)) + 1
  const predicted = predict(nextTermIndex)

  return Math.max(0, Math.round(predicted))
}

async function main() {
  console.log('='.repeat(60))
  console.log('Wharton Course Match Clearing Prices Fetcher')
  console.log('='.repeat(60))
  console.log()

  const allPrices: ClearingPrice[] = []
  const termIndexMap = new Map<string, number>()

  CLEARING_PRICE_FILES.forEach((f, i) => {
    termIndexMap.set(f.term, i)
  })

  // Download and parse each file
  for (const file of CLEARING_PRICE_FILES) {
    console.log(`\n[${file.term}]`)
    const buffer = await downloadFile(file.url)
    if (buffer) {
      const prices = parseXlsx(buffer, file.term)
      prices.forEach((p) => {
        p.termIndex = termIndexMap.get(file.term) || 0
      })
      allPrices.push(...prices)
      console.log(`    ✓ Found ${prices.length} courses`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`Total prices collected: ${allPrices.length}`)

  // Group by section
  const courseMap = new Map<string, ClearingPrice[]>()
  allPrices.forEach((p) => {
    const existing = courseMap.get(p.section) || []
    existing.push(p)
    courseMap.set(p.section, existing)
  })

  // Build course data with predictions
  const courses: CourseData[] = []

  courseMap.forEach((prices, section) => {
    prices.sort((a, b) => a.termIndex - b.termIndex)

    const courseCode = section.slice(0, 7)
    const department = section.slice(0, 4)

    const priceHistory = prices.map((p) => ({
      term: p.term,
      price: p.price,
    }))

    const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length
    const latestPrice = prices[prices.length - 1].price

    const regressionData = prices.map((p) => ({
      termIndex: p.termIndex,
      price: p.price,
    }))
    const predictedPrice = predictNextPrice(regressionData)

    const previousPrice = prices.length > 1 ? prices[prices.length - 2].price : latestPrice
    const priceChange = previousPrice > 0 ? ((latestPrice - previousPrice) / previousPrice) * 100 : 0

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (priceChange > 10) trend = 'up'
    else if (priceChange < -10) trend = 'down'

    courses.push({
      section,
      courseCode,
      department,
      prices: priceHistory,
      avgPrice: Math.round(avgPrice),
      latestPrice,
      predictedPrice,
      priceChange: Math.round(priceChange * 10) / 10,
      trend,
    })
  })

  courses.sort((a, b) => b.latestPrice - a.latestPrice)

  console.log(`Processed ${courses.length} unique course sections`)

  const departments = [...new Set(courses.map((c) => c.department))].sort()
  console.log(`Departments: ${departments.join(', ')}`)

  const stats = {
    totalCourses: courses.length,
    departments: departments.length,
    avgPrice: Math.round(courses.reduce((sum, c) => sum + c.latestPrice, 0) / courses.length),
    freeCourses: courses.filter((c) => c.latestPrice === 0).length,
    highDemand: courses.filter((c) => c.latestPrice >= 500).length,
    termsAvailable: CLEARING_PRICE_FILES.map((f) => f.term),
    lastUpdated: new Date().toISOString(),
  }

  // Save to JSON files
  const outputDir = path.join(__dirname, '..', 'public', 'data')
  fs.mkdirSync(outputDir, { recursive: true })

  fs.writeFileSync(
    path.join(outputDir, 'courses.json'),
    JSON.stringify(courses, null, 2)
  )

  fs.writeFileSync(
    path.join(outputDir, 'stats.json'),
    JSON.stringify(stats, null, 2)
  )

  fs.writeFileSync(
    path.join(outputDir, 'departments.json'),
    JSON.stringify(departments, null, 2)
  )

  console.log('\n' + '='.repeat(60))
  console.log('Data saved to public/data/')
  console.log('  - courses.json')
  console.log('  - stats.json')
  console.log('  - departments.json')

  console.log('\n--- Top 10 Highest Priced (Spring 2026) ---')
  courses.slice(0, 10).forEach((c, i) => {
    console.log(`${i + 1}. ${c.section}: ${c.latestPrice} (predicted: ${c.predictedPrice})`)
  })

  console.log('\n--- Top 10 Price Increases Predicted ---')
  const increasing = courses
    .filter((c) => c.predictedPrice > c.latestPrice && c.latestPrice > 0)
    .sort((a, b) => (b.predictedPrice - b.latestPrice) - (a.predictedPrice - a.latestPrice))
    .slice(0, 10)

  increasing.forEach((c, i) => {
    console.log(
      `${i + 1}. ${c.section}: ${c.latestPrice} → ${c.predictedPrice} (+${c.predictedPrice - c.latestPrice})`
    )
  })

  console.log('\n--- Hidden Gems (Low price, good history) ---')
  const gems = courses
    .filter((c) => c.latestPrice > 0 && c.latestPrice < 100 && c.prices.length >= 3)
    .sort((a, b) => a.avgPrice - b.avgPrice)
    .slice(0, 10)

  gems.forEach((c, i) => {
    console.log(`${i + 1}. ${c.section}: avg ${c.avgPrice}, latest ${c.latestPrice}, ${c.prices.length} terms`)
  })
}

main().catch(console.error)
