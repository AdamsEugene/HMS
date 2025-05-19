import React from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import { XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

// Stat card component
export interface StatCardProps {
  id: string;
  title: string;
  value: string;
  change: string;
  isIncrease: boolean;
  icon: React.ReactNode;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  isCustomizing?: boolean;
}

const StatCard = ({
  id,
  title,
  value,
  change,
  isIncrease,
  icon,
  onRemove,
  onConfigure,
  isCustomizing = false,
}: StatCardProps) => {
  // Use theme hook to get card styles
  const { getCardStyle, currentTheme, getGradientBackground } = useTheme();
  const cardStyle = getCardStyle();
  const gradients = getGradientBackground(currentTheme);

  return (
    <div
      className="card relative group"
      style={{
        ...cardStyle,
        background: gradients.content,
      }}
    >
      {isCustomizing && (
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <button
            onClick={() => onConfigure?.(id)}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Configure widget"
          >
            <Cog6ToothIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => onRemove?.(id)}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            title="Remove widget"
          >
            <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
      <div className="widget-drag-handle relative pt-4 pb-2 px-4">
        {isCustomizing && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
            Drag to move
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <p
              className="text-sm"
              style={{ color: currentTheme.textColorSecondary }}
            >
              {title}
            </p>
            <h3
              className="text-2xl font-semibold mt-1"
              style={{ color: currentTheme.textColor }}
            >
              {value}
            </h3>
            <div
              className={cn(
                "flex items-center text-sm mt-2",
                isIncrease ? "text-success" : "text-danger"
              )}
            >
              <span>{change}</span>
              <span className="ml-1">{isIncrease ? "↑" : "↓"}</span>
            </div>
          </div>
          <div className="flex">
            <div
              className="p-3 rounded-full"
              style={{
                backgroundColor: `${currentTheme.color}20`,
                color: currentTheme.color,
              }}
            >
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
