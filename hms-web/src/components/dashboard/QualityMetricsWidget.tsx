import React from "react";
import ChartContainer from "./ChartContainer";
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

// Sample quality metrics trends
const qualityTrends = [
  {
    month: "Jan",
    readmissionRate: 5.2,
    infectionRate: 1.8,
    patientSatisfaction: 88,
    medicationErrors: 2.3,
  },
  {
    month: "Feb",
    readmissionRate: 4.9,
    infectionRate: 1.6,
    patientSatisfaction: 89,
    medicationErrors: 2.1,
  },
  {
    month: "Mar",
    readmissionRate: 4.8,
    infectionRate: 1.5,
    patientSatisfaction: 87,
    medicationErrors: 1.9,
  },
  {
    month: "Apr",
    readmissionRate: 4.5,
    infectionRate: 1.4,
    patientSatisfaction: 90,
    medicationErrors: 1.7,
  },
  {
    month: "May",
    readmissionRate: 4.3,
    infectionRate: 1.3,
    patientSatisfaction: 91,
    medicationErrors: 1.6,
  },
  {
    month: "Jun",
    readmissionRate: 4.1,
    infectionRate: 1.2,
    patientSatisfaction: 92,
    medicationErrors: 1.5,
  },
];

// Key quality indicators
const qualityIndicators = [
  {
    name: "Readmission Rate",
    value: "4.1%",
    change: "-0.2%",
    status: "improving",
    benchmark: "4.5%",
    description: "30-day readmission rate",
  },
  {
    name: "Infection Rate",
    value: "1.2%",
    change: "-0.1%",
    status: "improving",
    benchmark: "1.5%",
    description: "Healthcare-associated infections",
  },
  {
    name: "Patient Satisfaction",
    value: "92%",
    change: "+1%",
    status: "improving",
    benchmark: "90%",
    description: "Satisfaction survey results",
  },
  {
    name: "Medication Errors",
    value: "1.5",
    change: "-0.1",
    status: "improving",
    benchmark: "1.8",
    description: "Per 1,000 patient days",
  },
];

interface QualityMetricsWidgetProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  config?: Record<string, unknown>;
}

const QualityMetricsWidget = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
  config,
}: QualityMetricsWidgetProps) => {
  // Get configuration or use defaults
  const title = (config?.title as string) || "Quality Metrics";
  const showTrends = config?.showTrends !== false;
  const showIndicators = config?.showIndicators !== false;
  const metricToShow = (config?.metricToShow as string) || "all";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "improving":
        return "#10b981";
      case "stable":
        return "#3b82f6";
      case "worsening":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  // Filter metrics based on config
  const filteredMetrics =
    metricToShow === "all"
      ? qualityIndicators
      : qualityIndicators.filter((metric) =>
          metric.name.toLowerCase().includes(metricToShow.toLowerCase())
        );

  return (
    <ChartContainer
      id={id}
      title={title}
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="p-2">
        {showIndicators && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {filteredMetrics.map((metric, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{metric.name}</h3>
                    <p className="text-xs opacity-70">{metric.description}</p>
                  </div>
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${getStatusColor(metric.status)}20`,
                      color: getStatusColor(metric.status),
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
                <div className="mt-2 flex items-end">
                  <span className="text-xl font-semibold">{metric.value}</span>
                  <span className="ml-2 text-xs opacity-70">
                    vs {metric.benchmark} benchmark
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showTrends && (
          <div className="h-48">
            <h3 className="text-sm font-medium opacity-70 mb-2">
              6-Month Trends
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={qualityTrends}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                  domain={["dataMin - 1", "dataMax + 1"]}
                  width={25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    color: "currentColor",
                  }}
                  formatter={(value, name) => {
                    if (
                      name === "readmissionRate" ||
                      name === "infectionRate" ||
                      name === "medicationErrors"
                    ) {
                      return [
                        `${value}%`,
                        name === "readmissionRate"
                          ? "Readmission Rate"
                          : name === "infectionRate"
                            ? "Infection Rate"
                            : "Medication Errors",
                      ];
                    }
                    return [`${value}%`, "Patient Satisfaction"];
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "currentColor" }}
                  formatter={(value) => {
                    switch (value) {
                      case "readmissionRate":
                        return "Readmission Rate";
                      case "infectionRate":
                        return "Infection Rate";
                      case "patientSatisfaction":
                        return "Patient Satisfaction";
                      case "medicationErrors":
                        return "Medication Errors";
                      default:
                        return value;
                    }
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="readmissionRate"
                  stroke="#ef4444"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="infectionRate"
                  stroke="#f59e0b"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="medicationErrors"
                  stroke="#8b5cf6"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="patientSatisfaction"
                  stroke="#10b981"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  strokeWidth={2}
                  hide
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default QualityMetricsWidget;
