import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PriceRangeFilterProps {
  value: string
  onChange: (range: string) => void
}

const PRICE_RANGES = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free (0)" },
  { value: "low", label: "Low (<200)" },
  { value: "medium", label: "Medium (200-500)" },
  { value: "high", label: "High (>500)" },
] as const

export function PriceRangeFilter({ value, onChange }: PriceRangeFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select price range" />
      </SelectTrigger>
      <SelectContent>
        {PRICE_RANGES.map((range) => (
          <SelectItem key={range.value} value={range.value}>
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
