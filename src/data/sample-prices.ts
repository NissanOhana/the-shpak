import type { ClearingPrice } from "@/types/course"

// Sample data - will be replaced with real data from xlsx files
export const samplePrices: ClearingPrice[] = [
  // MGMT (Management)
  { section: "MGMT6910001", term: "Spring2026", price: 450 },
  { section: "MGMT6910001", term: "Fall2025", price: 420 },
  { section: "MGMT6910001", term: "Spring2025", price: 380 },
  { section: "MGMT6910002", term: "Spring2026", price: 320 },
  { section: "MGMT6910002", term: "Fall2025", price: 350 },

  // FNCE (Finance)
  { section: "FNCE7500001", term: "Spring2026", price: 890 },
  { section: "FNCE7500001", term: "Fall2025", price: 820 },
  { section: "FNCE7500001", term: "Spring2025", price: 750 },
  { section: "FNCE7210001", term: "Spring2026", price: 650 },
  { section: "FNCE7210001", term: "Fall2025", price: 600 },
  { section: "FNCE7210002", term: "Spring2026", price: 480 },

  // MKTG (Marketing)
  { section: "MKTG7120001", term: "Spring2026", price: 520 },
  { section: "MKTG7120001", term: "Fall2025", price: 490 },
  { section: "MKTG7120001", term: "Spring2025", price: 460 },
  { section: "MKTG7760001", term: "Spring2026", price: 380 },
  { section: "MKTG7760001", term: "Fall2025", price: 340 },

  // OIDD (Operations)
  { section: "OIDD6150001", term: "Spring2026", price: 280 },
  { section: "OIDD6150001", term: "Fall2025", price: 310 },
  { section: "OIDD6150001", term: "Spring2025", price: 290 },
  { section: "OIDD2610001", term: "Spring2026", price: 150 },
  { section: "OIDD2610001", term: "Fall2025", price: 180 },

  // STAT (Statistics)
  { section: "STAT7010001", term: "Spring2026", price: 420 },
  { section: "STAT7010001", term: "Fall2025", price: 380 },
  { section: "STAT7010002", term: "Spring2026", price: 350 },

  // ACCT (Accounting)
  { section: "ACCT7420001", term: "Spring2026", price: 560 },
  { section: "ACCT7420001", term: "Fall2025", price: 510 },
  { section: "ACCT7420001", term: "Spring2025", price: 480 },

  // LGST (Legal Studies)
  { section: "LGST8060001", term: "Spring2026", price: 220 },
  { section: "LGST8060001", term: "Fall2025", price: 250 },

  // Free courses (0 price)
  { section: "WHCP8940001", term: "Spring2026", price: 0 },
  { section: "WHCP8940001", term: "Fall2025", price: 0 },
  { section: "MGMT8910001", term: "Spring2026", price: 0 },
]

// Course names mapping
export const courseNames: Record<string, string> = {
  "MGMT691": "Negotiations",
  "FNCE750": "Venture Capital & Private Equity",
  "FNCE721": "Corporate Valuation",
  "MKTG712": "Marketing Strategy",
  "MKTG776": "Applied Probability Models in Marketing",
  "OIDD615": "Operations Strategy",
  "OIDD261": "Decision Models",
  "STAT701": "Modern Data Mining",
  "ACCT742": "Financial Statement Analysis",
  "LGST806": "Ethics and the Law",
  "WHCP894": "Wharton Cohort",
  "MGMT891": "Independent Study",
}
