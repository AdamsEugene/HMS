import React from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import { XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import DecorativePattern from "./DecorativePattern";

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
  patternType?: "dots" | "grid" | "waves" | "circles" | "hex";
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
  patternType,
}: StatCardProps) => {
  // Use theme hook to get card styles
  const { getCardStyle, currentTheme, getGradientBackground } = useTheme();
  const cardStyle = getCardStyle();
  const gradients = getGradientBackground(currentTheme);

  // Select a random pattern if none is provided
  const patterns = ["dots", "grid", "waves", "circles", "hex"];
  const pattern =
    patternType ||
    (patterns[Math.floor(Math.random() * patterns.length)] as "dots");

  return (
    <div
      className="card relative group backdrop-blur-sm overflow-hidden"
      style={{
        ...cardStyle,
        background: gradients.content,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Decorative gradient blob */}
      <div
        className="absolute top-0 right-0 w-48 h-48 -mt-24 -mr-24 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${currentTheme.color}40 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Background pattern */}
      <DecorativePattern
        type={pattern}
        color={currentTheme.color}
        opacity={0.05}
        density="medium"
        animate={false}
      />

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
        className={`widget-drag-handle relative h-full flex items-center p-5 ${isCustomizing ? "cursor-move" : ""}`}
      >
        {isCustomizing && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full flex items-center">
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
        <div className="flex flex-1 items-center">
          <div
            className="flex-shrink-0 p-3 rounded-xl mr-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.color}30, ${currentTheme.color}10)`,
              border: `1px solid ${currentTheme.color}30`,
              color: currentTheme.color,
            }}
          >
            {/* Icon glow effect */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(circle, ${currentTheme.color}30 0%, transparent 70%)`,
                filter: "blur(5px)",
              }}
            />

            <div className="relative z-10">{icon}</div>
          </div>
          <div className="flex-1">
            <p
              className="text-sm opacity-70 font-medium"
              style={{ color: currentTheme.textColorSecondary }}
            >
              {title}
            </p>
            <h3
              className="text-2xl font-bold mt-1"
              style={{ color: currentTheme.textColor }}
            >
              {value}
            </h3>
            <div
              className={cn(
                "flex items-center text-xs font-medium mt-2 rounded-full px-2 py-0.5 w-fit",
                isIncrease
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              )}
            >
              <span className="mr-1">{isIncrease ? "↑" : "↓"}</span>
              <span>{change}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
