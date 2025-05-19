import React from "react";
import ChartContainer from "./ChartContainer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample compliance data
const complianceScores = [
  { category: "HIPAA", score: 92, benchmark: 85 },
  { category: "Fire Safety", score: 87, benchmark: 90 },
  { category: "Med Storage", score: 94, benchmark: 85 },
  { category: "Credentialing", score: 89, benchmark: 85 },
  { category: "Infection Ctrl", score: 96, benchmark: 90 },
  { category: "Documentation", score: 82, benchmark: 85 },
];

// Sample upcoming audits
const upcomingAudits = [
  {
    name: "Joint Commission Survey",
    type: "External",
    dueDate: "2023-11-15",
    status: "Preparing",
    priority: "Critical",
  },
  {
    name: "Infection Control Audit",
    type: "Internal",
    dueDate: "2023-09-05",
    status: "Scheduled",
    priority: "High",
  },
  {
    name: "Fire Safety Inspection",
    type: "External",
    dueDate: "2023-08-25",
    status: "Scheduled",
    priority: "Medium",
  },
  {
    name: "HIPAA Compliance Review",
    type: "Internal",
    dueDate: "2023-10-10",
    status: "Planning",
    priority: "High",
  },
];

interface ComplianceWidgetProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  config?: Record<string, unknown>;
}

const ComplianceWidget = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
  config,
}: ComplianceWidgetProps) => {
  // Get configuration or use defaults
  const title = (config?.title as string) || "Compliance Status";
  const showChart = config?.showChart !== false;
  const showTable = config?.showTable !== false;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "#ef4444";
      case "High":
        return "#f59e0b";
      case "Medium":
        return "#3b82f6";
      default:
        return "#10b981";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing":
        return "#facc15";
      case "Scheduled":
        return "#3b82f6";
      case "Planning":
        return "#10b981";
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
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={complianceScores}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                barSize={12}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                  vertical={false}
                />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    color: "currentColor",
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Compliance Score"
                />
                <Bar
                  dataKey="benchmark"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Benchmark"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {showTable && (
          <div className="overflow-x-auto">
            <h3 className="text-sm font-medium opacity-70 mb-2">
              Upcoming Audits & Reviews
            </h3>
            <table className="min-w-full divide-y divide-gray-700/20">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Audit Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Due Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/10">
                {upcomingAudits.map((audit, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                      {audit.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs opacity-80">
                      {audit.type}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs opacity-80">
                      {audit.dueDate}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${getStatusColor(audit.status)}20`,
                          color: getStatusColor(audit.status),
                        }}
                      >
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${getPriorityColor(audit.priority)}20`,
                          color: getPriorityColor(audit.priority),
                        }}
                      >
                        {audit.priority}
                      </span>
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

export default ComplianceWidget;
