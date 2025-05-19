import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import ChartContainer from "./ChartContainer";

// Sample data for recent activity
const recentActivities = [
  {
    id: 1,
    type: "admission",
    patient: "John Doe",
    department: "Emergency",
    time: "10 min ago",
    icon: "👤",
  },
  {
    id: 2,
    type: "discharge",
    patient: "Alice Smith",
    department: "Cardiology",
    time: "25 min ago",
    icon: "🏥",
  },
  {
    id: 3,
    type: "surgery",
    patient: "Robert Johnson",
    department: "Orthopedics",
    time: "45 min ago",
    icon: "🩺",
  },
  {
    id: 4,
    type: "admission",
    patient: "Emily Wilson",
    department: "Neurology",
    time: "1 hour ago",
    icon: "👤",
  },
  {
    id: 5,
    type: "lab_result",
    patient: "Michael Brown",
    department: "Oncology",
    time: "1.5 hours ago",
    icon: "🧪",
  },
  {
    id: 6,
    type: "medication",
    patient: "Jennifer Taylor",
    department: "Cardiology",
    time: "2 hours ago",
    icon: "💊",
  },
  {
    id: 7,
    type: "consultation",
    patient: "David Wilson",
    department: "Pulmonology",
    time: "3 hours ago",
    icon: "📋",
  },
];

interface RecentActivityProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
}

interface Activity {
  id: number;
  type:
    | "admission"
    | "discharge"
    | "surgery"
    | "lab_result"
    | "medication"
    | "consultation"
    | string;
  patient: string;
  department: string;
  time: string;
  icon: string;
}

const RecentActivity = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
}: RecentActivityProps) => {
  const { currentTheme } = useTheme();

  // Get activity icon with appropriate styling
  const getActivityIcon = (activity: Activity) => {
    // Background colors based on activity type
    const getBgColor = () => {
      switch (activity.type) {
        case "admission":
          return "bg-blue-500/10 text-blue-500";
        case "discharge":
          return "bg-green-500/10 text-green-500";
        case "surgery":
          return "bg-purple-500/10 text-purple-500";
        case "lab_result":
          return "bg-amber-500/10 text-amber-500";
        case "medication":
          return "bg-red-500/10 text-red-500";
        case "consultation":
          return "bg-indigo-500/10 text-indigo-500";
        default:
          return "bg-gray-500/10 text-gray-500";
      }
    };

    return (
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center text-lg`}
      >
        {activity.icon}
      </div>
    );
  };

  return (
    <ChartContainer
      id={id}
      title="Recent Activity"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead className="bg-black/20 text-left border-b border-white/10">
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-white/70 w-10"></th>
              <th className="px-2 py-3 font-medium text-xs uppercase tracking-wider text-white/70">
                Patient
              </th>
              <th className="px-2 py-3 font-medium text-xs uppercase tracking-wider text-white/70 hidden md:table-cell">
                Activity
              </th>
              <th className="px-2 py-3 font-medium text-xs uppercase tracking-wider text-white/70 hidden sm:table-cell">
                Department
              </th>
              <th className="px-2 py-3 font-medium text-xs uppercase tracking-wider text-white/70 text-right">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recentActivities.map((activity, index) => (
              <tr
                key={activity.id}
                className={`${
                  index % 2 === 0
                    ? "bg-black/5 hover:bg-black/10"
                    : "bg-black/10 hover:bg-black/15"
                } transition-colors`}
              >
                <td className="px-4 py-3">
                  {getActivityIcon(activity as Activity)}
                </td>
                <td className="px-2 py-3">
                  <span className="text-sm font-medium text-white">
                    {activity.patient}
                  </span>
                </td>
                <td className="px-2 py-3 hidden md:table-cell">
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                    style={{
                      backgroundColor: `${currentTheme.color}15`,
                      color: currentTheme.color,
                    }}
                  >
                    {getActivityDescription(activity as Activity)}
                  </span>
                </td>
                <td className="px-2 py-3 text-sm text-white/70 hidden sm:table-cell">
                  {activity.department}
                </td>
                <td className="px-2 py-3 text-xs text-white/60 text-right">
                  {activity.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartContainer>
  );
};

// Helper function to get proper activity description
const getActivityDescription = (activity: Activity) => {
  switch (activity.type) {
    case "admission":
      return `Admitted`;
    case "discharge":
      return `Discharged`;
    case "surgery":
      return `Surgery`;
    case "lab_result":
      return `Lab Results`;
    case "medication":
      return `Medication`;
    case "consultation":
      return `Consultation`;
    default:
      return `Activity`;
  }
};

export default RecentActivity;
