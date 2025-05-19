import React from "react";
import ChartContainer from "./ChartContainer";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Sample equipment status data
const equipmentData = [
  { name: "Operational", value: 68, color: "#4ade80" },
  { name: "Maintenance", value: 12, color: "#facc15" },
  { name: "Repair", value: 8, color: "#f87171" },
  { name: "Calibration", value: 5, color: "#60a5fa" },
  { name: "Inactive", value: 7, color: "#94a3b8" },
];

// Sample critical equipment list
const criticalEquipment = [
  {
    id: "MRI-01",
    name: "MRI Scanner",
    department: "Radiology",
    status: "Operational",
    nextMaintenance: "2023-09-15",
  },
  {
    id: "VENT-05",
    name: "Ventilator",
    department: "ICU",
    status: "Maintenance",
    nextMaintenance: "2023-08-02",
  },
  {
    id: "ECG-12",
    name: "ECG Machine",
    department: "Cardiology",
    status: "Repair",
    nextMaintenance: "2023-08-20",
  },
  {
    id: "USG-03",
    name: "Ultrasound",
    department: "Radiology",
    status: "Operational",
    nextMaintenance: "2023-10-05",
  },
];

interface EquipmentStatusWidgetProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  config?: Record<string, unknown>;
}

const EquipmentStatusWidget = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
  config,
}: EquipmentStatusWidgetProps) => {
  // Get configuration or use defaults
  const title = (config?.title as string) || "Equipment Status";
  const showPieChart = config?.showPieChart !== false;
  const showList = config?.showList !== false;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "#4ade80";
      case "Maintenance":
        return "#facc15";
      case "Repair":
        return "#f87171";
      case "Calibration":
        return "#60a5fa";
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
        {showPieChart && (
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {equipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} units`, ""]}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    color: "currentColor",
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ color: "currentColor" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {showList && (
          <div className="overflow-x-auto">
            <h3 className="text-sm font-medium opacity-70 mb-2">
              Critical Equipment Status
            </h3>
            <table className="min-w-full divide-y divide-gray-700/20">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Equipment
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Department
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Next Service
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/10">
                {criticalEquipment.map((equipment, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-xs opacity-90">
                      {equipment.id}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                      {equipment.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs opacity-80">
                      {equipment.department}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${getStatusColor(equipment.status)}20`,
                          color: getStatusColor(equipment.status),
                        }}
                      >
                        {equipment.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs opacity-80">
                      {equipment.nextMaintenance}
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

export default EquipmentStatusWidget;
