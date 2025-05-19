import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";
import ChartContainer from "./ChartContainer";

// Enhanced sample data for patient volume chart
const patientData = [
  { name: "Jan", inpatient: 400, outpatient: 240, emergency: 180, target: 350 },
  { name: "Feb", inpatient: 380, outpatient: 258, emergency: 190, target: 350 },
  { name: "Mar", inpatient: 410, outpatient: 290, emergency: 200, target: 350 },
  { name: "Apr", inpatient: 390, outpatient: 300, emergency: 210, target: 350 },
  { name: "May", inpatient: 430, outpatient: 320, emergency: 195, target: 350 },
  { name: "Jun", inpatient: 450, outpatient: 310, emergency: 200, target: 350 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-black/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl">
        <p className="font-medium text-white mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map(
            (entry: any, index: number) =>
              entry.dataKey !== "target" && (
                <div
                  key={`item-${index}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-white/80 capitalize">
                      {entry.dataKey}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white ml-4">
                    {entry.value}
                  </span>
                </div>
              )
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/60">
          Total:{" "}
          {payload.reduce(
            (sum: number, entry: any) =>
              entry.dataKey !== "target" ? sum + entry.value : sum,
            0
          )}
        </div>
      </div>
    );
  }
  return null;
};

interface PatientVolumeChartProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  config?: Record<string, unknown>;
}

const PatientVolumeChart = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
  config,
}: PatientVolumeChartProps) => {
  const { currentTheme } = useTheme();
  const chartType = (config?.chartType as string) || "bar";

  // Get gradient colors for bars
  const getBarColor = (key: string) => {
    switch (key) {
      case "inpatient":
        return "#3b82f6";
      case "outpatient":
        return "#10b981";
      case "emergency":
        return "#f97316";
      default:
        return "#8b5cf6";
    }
  };

  return (
    <ChartContainer
      id={id}
      title="Patient Volume"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="px-2 py-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={patientData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            barSize={20}
            barGap={8}
            barCategoryGap={16}
          >
            <defs>
              {/* Gradient definitions for each bar type */}
              <linearGradient
                id="inpatientGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#3b82f680" />
                <stop offset="95%" stopColor="#3b82f620" />
              </linearGradient>
              <linearGradient
                id="outpatientGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#10b98180" />
                <stop offset="95%" stopColor="#10b98120" />
              </linearGradient>
              <linearGradient
                id="emergencyGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#f9731680" />
                <stop offset="95%" stopColor="#f9731620" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.1}
            />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 15 }}
              iconType="circle"
              iconSize={8}
            />
            <ReferenceLine
              y={350}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="3 3"
            />
            <Bar
              dataKey="inpatient"
              name="Inpatient"
              fill="url(#inpatientGradient)"
              stroke={getBarColor("inpatient")}
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="outpatient"
              name="Outpatient"
              fill="url(#outpatientGradient)"
              stroke={getBarColor("outpatient")}
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="emergency"
              name="Emergency"
              fill="url(#emergencyGradient)"
              stroke={getBarColor("emergency")}
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default PatientVolumeChart;
