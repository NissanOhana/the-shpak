export interface ClearingPrice {
  section: string
  price: number
  term: string
}

export interface Course {
  section: string
  department: string
  courseNum: string
  sectionNum: string
  name?: string
  professor?: string
  creditUnits?: number
  timeSlot?: string
}

export interface CourseWithPrices extends Course {
  prices: ClearingPrice[]
  avgPrice: number
  latestPrice: number
  priceChange: number // % change from previous term
}

export interface UserBid {
  section: string
  utility: number
}

export interface SimulationResult {
  section: string
  allocated: boolean
  clearingPrice: number
  userUtility: number
  surplus: number // utility - price (if positive, you "won")
}
