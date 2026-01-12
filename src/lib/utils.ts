import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function formatTerm(term: string): string {
  // Convert "Spring2026" to "Spring 2026"
  return term.replace(/(\d{4})/, ' $1')
}

export function parseSectionCode(section: string): {
  department: string
  courseNum: string
  sectionNum: string
} {
  // Section format: MGMT5010001 (4 char dept + 3 digit course + 3 digit section)
  return {
    department: section.slice(0, 4),
    courseNum: section.slice(4, 7),
    sectionNum: section.slice(7, 10),
  }
}

export function getCourseCode(section: string): string {
  // Returns "MGMT501" from "MGMT5010001"
  return section.slice(0, 7)
}
