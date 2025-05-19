import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import DecorativePattern from "./DecorativePattern";

interface StatItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  change?: {
    value: string;
    isIncrease: boolean;
  };
}

interface StatsOverviewCardProps {
  title: string;
  stats: StatItem[];
  patternType?: "dots" | "grid" | "waves" | "circles" | "hex";
  className?: string;
}

const StatsOverviewCard: React.FC<StatsOverviewCardProps> = ({
  title,
  stats,
  patternType = "dots",
  className = "",
}) => {
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);

  return (
    <div
      className={`relative rounded-xl overflow-hidden shine-effect ${className}`}
      style={{
        background: `linear-gradient(135deg, ${currentTheme.color}40, ${currentTheme.color}10)`,
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.15)",
        border: `1px solid ${currentTheme.color}20`,
      }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full"
        style={{
          background: `radial-gradient(circle, ${currentTheme.color}30 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />

      <DecorativePattern
        type={patternType}
        color={currentTheme.color}
        opacity={0.05}
        density="medium"
      />

      <div className="relative z-10 p-6">
        <h2 className="text-xl font-bold mb-6 text-white">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center mb-2">
                {stat.icon && (
                  <div
                    className="mr-3 p-2 rounded-lg"
                    style={{
                      background: `${currentTheme.color}20`,
                      color: currentTheme.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                )}
                <span className="text-sm font-medium text-white/70">
                  {stat.label}
                </span>
              </div>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
                {stat.change && (
                  <div
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center ${
                      stat.change.isIncrease
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    <span className="mr-0.5">
                      {stat.change.isIncrease ? "↑" : "↓"}
                    </span>
                    {stat.change.value}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsOverviewCard;
