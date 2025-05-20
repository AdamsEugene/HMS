import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface DashboardBannerProps {
  userName?: string;
  hospitalName?: string;
  title?: string;
  subtitle?: string;
  theme?: string;
}

const DashboardBanner: React.FC<DashboardBannerProps> = ({
  userName = "Dr. Admin",
  hospitalName = "MediHub Central",
  title,
  subtitle,
  // theme,
}) => {
  const { currentTheme } = useTheme();
  // const gradients = getGradientBackground(currentTheme);

  // State for current date and time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div
      className="relative w-full mb-6 rounded-xl overflow-hidden backdrop-blur-md"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.color}15, ${currentTheme.color}05)`,
        border: `1px solid ${currentTheme.color}20`,
        color: currentTheme.textColor || currentTheme.light.text.primary,
      }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full"
        style={{
          background: `radial-gradient(circle, ${currentTheme.color}20 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-48 h-48 -mb-24 -ml-24 rounded-full"
        style={{
          background: `radial-gradient(circle, ${currentTheme.color}15 0%, transparent 70%)`,
          filter: "blur(25px)",
        }}
      />

      {/* Small dot pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: currentTheme.primaryColor,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.25,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            {title || `${getGreeting()}, ${userName}`}
          </h1>
          <p className="opacity-70">
            {subtitle || `Welcome to ${hospitalName} dashboard`}
          </p>
          <div className="mt-2 opacity-60 text-sm">
            {formatDate(currentTime)}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-4xl font-bold">{formatTime(currentTime)}</div>
          <div className="mt-2 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="opacity-70">System Status: Operational</span>
          </div>
        </div>
      </div>

      {/* Wave SVG Pattern at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden opacity-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill={currentTheme.color}
            opacity="0.8"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill={currentTheme.color}
            opacity="0.5"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default DashboardBanner;
