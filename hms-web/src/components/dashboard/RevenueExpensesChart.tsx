import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartContainer from "./ChartContainer";

// Sample data for revenue vs expenses chart
const revenueData = [
  { name: "Jan", revenue: 50000, expenses: 38000 },
  { name: "Feb", revenue: 55000, expenses: 39000 },
  { name: "Mar", revenue: 58000, expenses: 42000 },
  { name: "Apr", revenue: 62000, expenses: 43000 },
  { name: "May", revenue: 65000, expenses: 44000 },
  { name: "Jun", revenue: 68000, expenses: 45000 },
];

interface RevenueExpensesChartProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
}

const RevenueExpensesChart = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
}: RevenueExpensesChartProps) => {
  return (
    <ChartContainer
      id={id}
      title="Revenue vs Expenses"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, ""]}
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "4px",
                color: "white",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#0088FE"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#FF8042"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default RevenueExpensesChart;
