import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";

export interface PriceDataPoint {
  term: string;
  price: number;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  courseCode: string;
}

const PRIMARY_BLUE = "#004785";

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          Price:{" "}
          <span className="font-semibold" style={{ color: PRIMARY_BLUE }}>
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
}

export function PriceChart({ data, courseCode }: PriceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No price history available for {courseCode}
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="term"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={PRIMARY_BLUE}
            strokeWidth={2}
            dot={{ fill: PRIMARY_BLUE, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: PRIMARY_BLUE }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
