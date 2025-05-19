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
  type: "admission" | "discharge" | "surgery" | "lab_result" | string;
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

  return (
    <ChartContainer
      id={id}
      title="Recent Activity"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center p-3 rounded-lg transition-colors hover:bg-black/5 border border-gray-700/10"
          >
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {activity.icon}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h3
                  className="text-sm font-medium"
                  style={{ color: currentTheme.textColor }}
                >
                  {activity.patient}
                </h3>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: currentTheme.textColorSecondary }}
              >
                {getActivityDescription(activity as Activity)}
              </p>
              <div className="mt-1 text-xs text-primary">
                {activity.department} Department
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
};

// Helper function to get proper activity description
const getActivityDescription = (activity: Activity) => {
  switch (activity.type) {
    case "admission":
      return `New patient admitted`;
    case "discharge":
      return `Patient discharged`;
    case "surgery":
      return `Surgery completed`;
    case "lab_result":
      return `Lab results available`;
    default:
      return `Activity recorded`;
  }
};

export default RecentActivity;
