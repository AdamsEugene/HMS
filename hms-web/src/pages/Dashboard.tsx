import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "../utils/cn";
import { XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

// Sample data for charts
const patientData = [
  { name: "Jan", inpatient: 400, outpatient: 240, emergency: 180 },
  { name: "Feb", inpatient: 380, outpatient: 258, emergency: 190 },
  { name: "Mar", inpatient: 410, outpatient: 290, emergency: 200 },
  { name: "Apr", inpatient: 390, outpatient: 300, emergency: 210 },
  { name: "May", inpatient: 430, outpatient: 320, emergency: 195 },
  { name: "Jun", inpatient: 450, outpatient: 310, emergency: 200 },
];

const revenueData = [
  { name: "Jan", revenue: 50000, expenses: 38000 },
  { name: "Feb", revenue: 55000, expenses: 39000 },
  { name: "Mar", revenue: 58000, expenses: 42000 },
  { name: "Apr", revenue: 62000, expenses: 43000 },
  { name: "May", revenue: 65000, expenses: 44000 },
  { name: "Jun", revenue: 68000, expenses: 45000 },
];

const departmentData = [
  { name: "Cardiology", value: 400 },
  { name: "Orthopedics", value: 300 },
  { name: "Neurology", value: 250 },
  { name: "Pediatrics", value: 200 },
  { name: "Oncology", value: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Available widget types for dashboard customization
const availableWidgets = [
  {
    id: "patient-stats",
    title: "Patient Statistics",
    description: "Overview of patient volume and distribution",
    icon: "👥",
    type: "stat-card",
  },
  {
    id: "appointments",
    title: "Appointment Tracking",
    description: "Summary of scheduled appointments",
    icon: "📅",
    type: "stat-card",
  },
  {
    id: "bed-occupancy",
    title: "Bed Occupancy",
    description: "Current bed utilization rates",
    icon: "🏥",
    type: "stat-card",
  },
  {
    id: "revenue",
    title: "Revenue Metrics",
    description: "Financial performance indicators",
    icon: "💰",
    type: "stat-card",
  },
  {
    id: "patient-volume",
    title: "Patient Volume Chart",
    description: "Visualization of patient volume trends",
    icon: "📊",
    type: "chart",
    chartType: "bar",
  },
  {
    id: "revenue-expenses",
    title: "Revenue vs Expenses",
    description: "Financial performance over time",
    icon: "📈",
    type: "chart",
    chartType: "line",
  },
  {
    id: "department-distribution",
    title: "Department Distribution",
    description: "Patient distribution by department",
    icon: "🔄",
    type: "chart",
    chartType: "pie",
  },
  {
    id: "recent-activity",
    title: "Recent Activity",
    description: "Latest events and notifications",
    icon: "🔔",
    type: "list",
  },
];

// Dashboard layout presets
const layoutPresets = [
  {
    id: "clinical",
    name: "Clinical Focus",
    description: "Emphasizes patient care metrics",
    widgets: [
      "patient-stats",
      "bed-occupancy",
      "patient-volume",
      "department-distribution",
      "recent-activity",
    ],
  },
  {
    id: "administrative",
    name: "Administrative View",
    description: "Focuses on operational performance",
    widgets: [
      "appointments",
      "revenue",
      "revenue-expenses",
      "recent-activity",
      "department-distribution",
    ],
  },
  {
    id: "comprehensive",
    name: "Comprehensive Dashboard",
    description: "Complete overview of all metrics",
    widgets: [
      "patient-stats",
      "appointments",
      "bed-occupancy",
      "revenue",
      "patient-volume",
      "revenue-expenses",
      "department-distribution",
      "recent-activity",
    ],
  },
];

// Stat card component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isIncrease: boolean;
  icon: React.ReactNode;
  onRemove?: () => void;
  onConfigure?: () => void;
  isCustomizing?: boolean;
}

const StatCard = ({
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
  const { getCardStyle, currentTheme } = useTheme();
  const cardStyle = getCardStyle();

  return (
    <div className="card relative group" style={cardStyle}>
      {isCustomizing && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={onConfigure}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Configure widget"
          >
            <Cog6ToothIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            title="Remove widget"
          >
            <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
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
  );
};

// Chart container component
interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
  onConfigure?: () => void;
  isCustomizing?: boolean;
}

const ChartContainer = ({
  title,
  children,
  onRemove,
  onConfigure,
  isCustomizing = false,
}: ChartContainerProps) => {
  // Use theme hook to get card styles
  const { getCardStyle, currentTheme } = useTheme();
  const cardStyle = getCardStyle();

  return (
    <div className="card relative group" style={cardStyle}>
      {isCustomizing && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={onConfigure}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Configure widget"
          >
            <Cog6ToothIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            title="Remove widget"
          >
            <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
      <h2
        className="text-lg font-medium mb-4"
        style={{ color: currentTheme.textColor }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
};

const Dashboard = () => {
  // Use theme hook
  const { currentTheme, getCardStyle } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([
    "patient-stats",
    "appointments",
    "bed-occupancy",
    "revenue",
    "patient-volume",
    "revenue-expenses",
    "department-distribution",
    "recent-activity",
  ]);
  const [selectedLayout, setSelectedLayout] = useState("comprehensive");

  // Apply layout preset
  const applyLayoutPreset = (layoutId: string) => {
    const preset = layoutPresets.find((p) => p.id === layoutId);
    if (preset) {
      setActiveWidgets([...preset.widgets]);
      setSelectedLayout(layoutId);
    }
  };

  // Add widget to dashboard
  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets([...activeWidgets, widgetId]);
    }
  };

  // Remove widget from dashboard
  const removeWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter((id) => id !== widgetId));
  };

  // Check if widget is active
  const isWidgetActive = (widgetId: string) => {
    return activeWidgets.includes(widgetId);
  };

  // Handle widget configuration (placeholder - would open widget settings in real app)
  const configureWidget = (widgetId: string) => {
    console.log(`Configure widget: ${widgetId}`);
    // In a real application, this would open a configuration modal
  };

  // Save dashboard configuration
  const saveDashboardConfig = () => {
    setIsCustomizing(false);
    // In a real application, this would save the configuration to user preferences
    console.log("Dashboard configuration saved:", {
      activeWidgets,
      selectedLayout,
    });
  };

  // Render appropriate stat card based on widget ID
  const renderStatCard = (widgetId: string) => {
    switch (widgetId) {
      case "patient-stats":
        return (
          <StatCard
            title="Total Patients"
            value="1,248"
            change="12%"
            isIncrease={true}
            isCustomizing={isCustomizing}
            onRemove={() => removeWidget(widgetId)}
            onConfigure={() => configureWidget(widgetId)}
            icon={
              <svg
                className="h-6 w-6 text-info"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
        );
      case "appointments":
        return (
          <StatCard
            title="Appointments"
            value="268"
            change="8%"
            isIncrease={true}
            isCustomizing={isCustomizing}
            onRemove={() => removeWidget(widgetId)}
            onConfigure={() => configureWidget(widgetId)}
            icon={
              <svg
                className="h-6 w-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        );
      case "bed-occupancy":
        return (
          <StatCard
            title="Bed Occupancy"
            value="76%"
            change="3%"
            isIncrease={false}
            isCustomizing={isCustomizing}
            onRemove={() => removeWidget(widgetId)}
            onConfigure={() => configureWidget(widgetId)}
            icon={
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />
        );
      case "revenue":
        return (
          <StatCard
            title="Revenue"
            value="$68,492"
            change="6%"
            isIncrease={true}
            isCustomizing={isCustomizing}
            onRemove={() => removeWidget(widgetId)}
            onConfigure={() => configureWidget(widgetId)}
            icon={
              <svg
                className="h-6 w-6 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1
            className="text-2xl font-semibold"
            style={{ color: currentTheme.textColor }}
          >
            Dashboard
          </h1>

          {/* Dashboard customization controls */}
          <div className="flex space-x-2">
            {isCustomizing ? (
              <>
                <div className="relative inline-block text-left mr-2">
                  <select
                    className="form-select py-1 text-sm"
                    value={selectedLayout}
                    onChange={(e) => applyLayoutPreset(e.target.value)}
                    title="Select layout preset"
                  >
                    <option value="">-- Select Layout --</option>
                    {layoutPresets.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-secondary text-sm py-1"
                  onClick={() => setIsCustomizing(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary text-sm py-1"
                  onClick={saveDashboardConfig}
                >
                  Save Layout
                </button>
              </>
            ) : (
              <button
                className="btn bg-primary text-white text-sm"
                onClick={() => setIsCustomizing(true)}
              >
                Customize Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Widget selection panel - only shown when customizing */}
        {isCustomizing && (
          <div className="my-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-3">Available Widgets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableWidgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => addWidget(widget.id)}
                  disabled={isWidgetActive(widget.id)}
                  className={cn(
                    "flex items-center p-3 rounded-lg text-left transition-colors",
                    isWidgetActive(widget.id)
                      ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-60"
                      : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  )}
                >
                  <span className="text-xl mr-3">{widget.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{widget.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {widget.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timeframe selection */}
        <div className="my-6 flex space-x-2">
          <button
            className={cn(
              "btn",
              selectedTimeframe === "day"
                ? "btn-primary"
                : "bg-white text-text-light border border-border-light dark:bg-background-dark dark:text-text-dark dark:border-border-dark"
            )}
            onClick={() => setSelectedTimeframe("day")}
          >
            Day
          </button>
          <button
            className={cn(
              "btn",
              selectedTimeframe === "week"
                ? "btn-primary"
                : "bg-white text-text-light border border-border-light dark:bg-background-dark dark:text-text-dark dark:border-border-dark"
            )}
            onClick={() => setSelectedTimeframe("week")}
          >
            Week
          </button>
          <button
            className={cn(
              "btn",
              selectedTimeframe === "month"
                ? "btn-primary"
                : "bg-white text-text-light border border-border-light dark:bg-background-dark dark:text-text-dark dark:border-border-dark"
            )}
            onClick={() => setSelectedTimeframe("month")}
          >
            Month
          </button>
          <button
            className={cn(
              "btn",
              selectedTimeframe === "year"
                ? "btn-primary"
                : "bg-white text-text-light border border-border-light dark:bg-background-dark dark:text-text-dark dark:border-border-dark"
            )}
            onClick={() => setSelectedTimeframe("year")}
          >
            Year
          </button>
        </div>

        {/* Stat cards */}
        {activeWidgets.some((id) =>
          [
            "patient-stats",
            "appointments",
            "bed-occupancy",
            "revenue",
          ].includes(id)
        ) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {activeWidgets.includes("patient-stats") &&
              renderStatCard("patient-stats")}
            {activeWidgets.includes("appointments") &&
              renderStatCard("appointments")}
            {activeWidgets.includes("bed-occupancy") &&
              renderStatCard("bed-occupancy")}
            {activeWidgets.includes("revenue") && renderStatCard("revenue")}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patient volume chart */}
          {activeWidgets.includes("patient-volume") && (
            <ChartContainer
              title="Patient Volume"
              isCustomizing={isCustomizing}
              onRemove={() => removeWidget("patient-volume")}
              onConfigure={() => configureWidget("patient-volume")}
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inpatient" fill="#0088FE" />
                    <Bar dataKey="outpatient" fill="#00C49F" />
                    <Bar dataKey="emergency" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          )}

          {/* Revenue chart */}
          {activeWidgets.includes("revenue-expenses") && (
            <ChartContainer
              title="Revenue vs Expenses"
              isCustomizing={isCustomizing}
              onRemove={() => removeWidget("revenue-expenses")}
              onConfigure={() => configureWidget("revenue-expenses")}
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="expenses" stroke="#FF8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          )}
        </div>

        {/* Department Distribution */}
        {activeWidgets.includes("department-distribution") && (
          <ChartContainer
            title="Department Distribution"
            isCustomizing={isCustomizing}
            onRemove={() => removeWidget("department-distribution")}
            onConfigure={() => configureWidget("department-distribution")}
          >
            <div className="h-80 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        )}

        {/* Recent Activity */}
        {activeWidgets.includes("recent-activity") && (
          <div className="card relative" style={getCardStyle()}>
            {isCustomizing && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => configureWidget("recent-activity")}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Configure widget"
                >
                  <Cog6ToothIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => removeWidget("recent-activity")}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  title="Remove widget"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            )}
            <div
              className="px-6 py-5 border-b border-border-light dark:border-border-dark -mx-6 -mt-6"
              style={{ borderColor: currentTheme.borderColor }}
            >
              <h3
                className="text-lg font-medium"
                style={{ color: currentTheme.textColor }}
              >
                Recent Activity
              </h3>
            </div>
            <ul
              className="divide-y divide-border-light dark:divide-border-dark"
              style={{ borderColor: currentTheme.borderColor }}
            >
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex-center">
                      <svg
                        className="h-6 w-6 text-info"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      New patient admitted - John Doe
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Emergency Department
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    10 min ago
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex-center">
                      <svg
                        className="h-6 w-6 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Lab results ready - Sarah Johnson
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hematology
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    25 min ago
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex-center">
                      <svg
                        className="h-6 w-6 text-purple-600 dark:text-purple-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Surgery scheduled - Michael Brown
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Orthopedics - Dr. Rodriguez
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    1 hour ago
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex-center">
                      <svg
                        className="h-6 w-6 text-warning"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Medication alert - Critical stock
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pharmacy Department
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
