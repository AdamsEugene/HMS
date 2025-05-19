import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartContainer from "./ChartContainer";

// Sample data for department distribution
const departmentData = [
  { name: "Cardiology", value: 400 },
  { name: "Orthopedics", value: 300 },
  { name: "Neurology", value: 250 },
  { name: "Pediatrics", value: 200 },
  { name: "Oncology", value: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface DepartmentDistributionProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const DepartmentDistribution = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
}: DepartmentDistributionProps) => {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: CustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer
      id={id}
      title="Department Distribution"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="h-80 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {departmentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `${value} patients`,
                "Patient Count",
              ]}
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "4px",
                color: "white",
              }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default DepartmentDistribution;
