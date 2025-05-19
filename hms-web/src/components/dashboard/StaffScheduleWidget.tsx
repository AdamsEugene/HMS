import React from "react";
import ChartContainer from "./ChartContainer";

// Sample staff schedule data
const staffScheduleData = [
  {
    name: "Dr. Sarah Johnson",
    dept: "Cardiology",
    status: "On Duty",
    hours: "08:00-16:00",
    color: "#4ade80",
  },
  {
    name: "Dr. Michael Lee",
    dept: "Emergency",
    status: "On Call",
    hours: "16:00-00:00",
    color: "#facc15",
  },
  {
    name: "Nurse Williams",
    dept: "Pediatrics",
    status: "Off Duty",
    hours: "--",
    color: "#f87171",
  },
  {
    name: "Dr. Emily Chen",
    dept: "Radiology",
    status: "On Duty",
    hours: "09:00-17:00",
    color: "#4ade80",
  },
  {
    name: "Nurse Thompson",
    dept: "Surgery",
    status: "On Duty",
    hours: "07:00-15:00",
    color: "#4ade80",
  },
  {
    name: "Dr. Robert Davis",
    dept: "Neurology",
    status: "On Call",
    hours: "18:00-02:00",
    color: "#facc15",
  },
];

interface StaffScheduleWidgetProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  config?: Record<string, unknown>;
}

const StaffScheduleWidget = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
  config,
}: StaffScheduleWidgetProps) => {
  // Get configuration or use defaults
  const title = (config?.title as string) || "Staff Schedule";
  const showDepartment = config?.showDepartment !== false;
  const filterByStatus = config?.filterByStatus as string;

  // Filter data if needed
  const filteredData = filterByStatus
    ? staffScheduleData.filter((staff) => staff.status === filterByStatus)
    : staffScheduleData;

  return (
    <ChartContainer
      id={id}
      title={title}
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/20">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                  Staff
                </th>
                {showDepartment && (
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                    Department
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/10">
              {filteredData.map((staff, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {staff.name}
                  </td>
                  {showDepartment && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm opacity-80">
                      {staff.dept}
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `${staff.color}20`,
                        color: staff.color,
                      }}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm opacity-80">
                    {staff.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ChartContainer>
  );
};

export default StaffScheduleWidget;
