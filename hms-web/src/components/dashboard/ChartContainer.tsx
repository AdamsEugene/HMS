import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

// Chart container component
export interface ChartContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  isCustomizing?: boolean;
  className?: string;
}

const ChartContainer = ({
  id,
  title,
  children,
  onRemove,
  onConfigure,
  isCustomizing = false,
  className,
}: ChartContainerProps) => {
  // Use theme hook to get card styles
  const { getCardStyle, currentTheme, getGradientBackground } = useTheme();
  const cardStyle = getCardStyle();
  const gradients = getGradientBackground(currentTheme);

  return (
    <div
      className={`card relative group ${className || ""}`}
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
      <div
        className={`widget-drag-handle flex justify-between items-center px-4 py-2 ${
          isCustomizing ? "flex justify-between" : ""
        }`}
      >
        <h3 className="text-base font-medium">{title}</h3>
        <div className="flex items-center">
          {isCustomizing && (
            <div className="mr-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
              Drag to move
            </div>
          )}
          {isCustomizing && onConfigure && (
            <button
              onClick={() => onConfigure(id)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Configure widget"
            >
              <Cog6ToothIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartContainer;
