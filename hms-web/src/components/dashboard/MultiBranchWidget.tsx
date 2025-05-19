import React from "react";
import ChartContainer from "./ChartContainer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Sample multi-branch data
const branchData = [
  {
    name: "Main Hospital",
    bedOccupancy: 84,
    avgWaitTime: 28,
    patientSatisfaction: 88,
    staffUtilization: 92,
    location: "Downtown",
    code: "MH-001",
  },
  {
    name: "East Wing",
    bedOccupancy: 76,
    avgWaitTime: 22,
    patientSatisfaction: 91,
    staffUtilization: 89,
    location: "East Side",
    code: "EW-002",
  },
  {
    name: "West Medical",
    bedOccupancy: 68,
    avgWaitTime: 19,
    patientSatisfaction: 85,
    staffUtilization: 86,
    location: "West District",
    code: "WM-003",
  },
  {
    name: "North Clinic",
    bedOccupancy: 72,
    avgWaitTime: 25,
    patientSatisfaction: 87,
    staffUtilization: 90,
    location: "North County",
    code: "NC-004",
  },
];

interface MultiBranchWidgetProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  config?: Record<string, unknown>;
}

const MultiBranchWidget = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
  config,
}: MultiBranchWidgetProps) => {
  // Get configuration or use defaults
  const title = (config?.title as string) || "Multi-Branch Performance";
  const showChart = config?.showChart !== false;
  const showTable = config?.showTable !== false;
  const metricToShow = (config?.metricToShow as string) || "bedOccupancy";

  // Get metric data for chart
  const getMetricData = () => {
    // Prepare data for the selected metric
    return branchData.map((branch) => ({
      name: branch.name,
      value: branch[metricToShow as keyof typeof branch],
    }));
  };

  // Get metric label
  const getMetricLabel = () => {
    switch (metricToShow) {
      case "bedOccupancy":
        return "Bed Occupancy (%)";
      case "avgWaitTime":
        return "Avg. Wait Time (min)";
      case "patientSatisfaction":
        return "Patient Satisfaction (%)";
      case "staffUtilization":
        return "Staff Utilization (%)";
      default:
        return "Value";
    }
  };

  // Get metric color
  const getMetricColor = () => {
    switch (metricToShow) {
      case "bedOccupancy":
        return "#3b82f6";
      case "avgWaitTime":
        return "#f59e0b";
      case "patientSatisfaction":
        return "#10b981";
      case "staffUtilization":
        return "#8b5cf6";
      default:
        return "#94a3b8";
    }
  };

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
        {showChart && (
          <div className="h-64 mb-4">
            <h3 className="text-sm font-medium opacity-70 mb-2">
              {getMetricLabel()} by Branch
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={getMetricData()}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                barSize={30}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tick={{ fill: "currentColor", opacity: 0.7 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={100}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, getMetricLabel()]}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    color: "currentColor",
                  }}
                />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Bar
                  dataKey="value"
                  fill={`${getMetricColor()}80`}
                  stroke={getMetricColor()}
                  strokeWidth={1}
                  name={getMetricLabel()}
                  radius={[0, 4, 4, 0]}
                >
                  <LabelList
                    dataKey="value"
                    position="right"
                    fill="currentColor"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {showTable && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/20">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Branch
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Location
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Bed Occ.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Wait Time
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Satisfaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/10">
                {branchData.map((branch, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                      {branch.name}
                      <span className="ml-1 text-xs opacity-60">
                        ({branch.code})
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs opacity-80">
                      {branch.location}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-700 rounded-full h-1.5 mr-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${branch.bedOccupancy}%`,
                              backgroundColor: "#3b82f6",
                            }}
                          ></div>
                        </div>
                        <span>{branch.bedOccupancy}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-700 rounded-full h-1.5 mr-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${branch.avgWaitTime * 2}%`,
                              backgroundColor: "#f59e0b",
                            }}
                          ></div>
                        </div>
                        <span>{branch.avgWaitTime} min</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-700 rounded-full h-1.5 mr-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${branch.patientSatisfaction}%`,
                              backgroundColor: "#10b981",
                            }}
                          ></div>
                        </div>
                        <span>{branch.patientSatisfaction}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default MultiBranchWidget;
