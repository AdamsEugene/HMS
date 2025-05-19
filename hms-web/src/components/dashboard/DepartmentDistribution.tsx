import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";
import ChartContainer from "./ChartContainer";

// Sample data for department distribution
const departmentData = [
  { name: "Cardiology", value: 400 },
  { name: "Orthopedics", value: 300 },
  { name: "Neurology", value: 250 },
  { name: "Pediatrics", value: 200 },
  { name: "Oncology", value: 150 },
];

// Modern color palette with gradients
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f97316", "#8b5cf6"];

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
  name: string;
  value: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-tooltip bg-black/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl">
        <p className="font-medium text-white mb-1">{data.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: data.fill }}
            ></div>
            <span className="text-sm text-white/80">Patients</span>
          </div>
          <span className="text-sm font-medium text-white ml-4">
            {data.value}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/60">
          {(data.payload.percent * 100).toFixed(1)}% of total
        </div>
      </div>
    );
  }
  return null;
};

const DepartmentDistribution = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
}: DepartmentDistributionProps) => {
  const { getGradientBackground } = useTheme();

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
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
        fontWeight="500"
        fontSize={12}
        stroke="none"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calculate total
  const total = departmentData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ChartContainer
      id={id}
      title="Department Distribution"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="h-80 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`colorGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={`${color}FF`} />
                  <stop offset="100%" stopColor={`${color}99`} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              innerRadius={40}
              paddingAngle={3}
              strokeWidth={1}
              stroke="rgba(255,255,255,0.1)"
              dataKey="value"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1000}
            >
              {departmentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#colorGradient-${index % COLORS.length})`}
                  style={{
                    filter: "drop-shadow(0px 0px 4px rgba(0,0,0,0.3))",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry: any) => (
                <span
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    marginLeft: "4px",
                    fontSize: "12px",
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center text-sm text-white/60 -mt-2">
          Total Patients: {total}
        </div>
      </div>
    </ChartContainer>
  );
};

export default DepartmentDistribution;
