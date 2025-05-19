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
      className={`card relative group backdrop-blur-sm ${className || ""}`}
      style={{
        ...cardStyle,
        background: gradients.content,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {isCustomizing && (
        <div className="absolute top-3 right-3 flex space-x-1.5 z-10">
          <button
            onClick={() => onConfigure?.(id)}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
            title="Configure widget"
          >
            <Cog6ToothIcon className="h-3.5 w-3.5 text-white/80" />
          </button>
          <button
            onClick={() => onRemove?.(id)}
            className="p-1.5 rounded-full bg-black/10 hover:bg-red-500/20 hover:text-red-500 transition-colors"
            title="Remove widget"
          >
            <XMarkIcon className="h-3.5 w-3.5 text-white/80" />
          </button>
        </div>
      )}
      <div
        className={`widget-drag-handle flex justify-between items-center px-5 py-3 border-b border-white/[0.06] ${
          isCustomizing ? "cursor-move" : ""
        }`}
      >
        <h3 className="text-base font-medium tracking-wide">{title}</h3>
        <div className="flex items-center">
          {isCustomizing && (
            <div className="mr-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full flex items-center">
              <svg
                className="w-3 h-3 mr-1 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M6 8H18M6 16H18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Drag</span>
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
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default ChartContainer;
