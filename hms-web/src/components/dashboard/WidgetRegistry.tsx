import React from "react";
import StatCard from "./StatCard";
import PatientVolumeChart from "./PatientVolumeChart";
import RevenueExpensesChart from "./RevenueExpensesChart";
import DepartmentDistribution from "./DepartmentDistribution";
import RecentActivity from "./RecentActivity";

// SVG Icons for stat cards
const Icons = {
  patients: (
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
  ),
  appointments: (
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
  ),
  beds: (
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
  ),
  revenue: (
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
  ),
};

// Define widget metadata
export const widgetTypes = [
  {
    id: "patient-stats",
    type: "stat",
    title: "Patient Statistics",
    description: "Overview of patient volume and distribution",
    icon: Icons.patients,
    defaultWidth: 1, // Number of columns in grid
    defaultHeight: 1, // Number of rows in grid
  },
  {
    id: "appointments",
    type: "stat",
    title: "Appointment Tracking",
    description: "Summary of scheduled appointments",
    icon: Icons.appointments,
    defaultWidth: 1,
    defaultHeight: 1,
  },
  {
    id: "bed-occupancy",
    type: "stat",
    title: "Bed Occupancy",
    description: "Current bed utilization rates",
    icon: Icons.beds,
    defaultWidth: 1,
    defaultHeight: 1,
  },
  {
    id: "revenue",
    type: "stat",
    title: "Revenue Metrics",
    description: "Financial performance indicators",
    icon: Icons.revenue,
    defaultWidth: 1,
    defaultHeight: 1,
  },
  {
    id: "patient-volume",
    type: "chart",
    title: "Patient Volume Chart",
    description: "Visualization of patient volume trends",
    icon: "📊",
    component: PatientVolumeChart,
    defaultWidth: 2,
    defaultHeight: 2,
  },
  {
    id: "revenue-expenses",
    type: "chart",
    title: "Revenue vs Expenses",
    description: "Financial performance over time",
    icon: "📈",
    component: RevenueExpensesChart,
    defaultWidth: 2,
    defaultHeight: 2,
  },
  {
    id: "department-distribution",
    type: "chart",
    title: "Department Distribution",
    description: "Patient distribution by department",
    icon: "🍩",
    component: DepartmentDistribution,
    defaultWidth: 2,
    defaultHeight: 2,
  },
  {
    id: "recent-activity",
    type: "list",
    title: "Recent Activity",
    description: "Latest events and notifications",
    icon: "🔔",
    component: RecentActivity,
    defaultWidth: 2,
    defaultHeight: 2,
  },
];

// Layout presets for different dashboard configurations
export const layoutPresets = [
  {
    id: "clinical",
    name: "Clinical Focus",
    description: "Emphasizes patient care metrics",
    layout: [
      { i: "patient-stats", x: 0, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 1, y: 0, w: 1, h: 1 },
      { i: "appointments", x: 2, y: 0, w: 1, h: 1 },
      { i: "patient-volume", x: 0, y: 1, w: 2, h: 2 },
      { i: "department-distribution", x: 2, y: 1, w: 2, h: 2 },
      { i: "recent-activity", x: 0, y: 3, w: 2, h: 2 },
    ],
  },
  {
    id: "administrative",
    name: "Administrative View",
    description: "Focuses on operational performance",
    layout: [
      { i: "revenue", x: 0, y: 0, w: 1, h: 1 },
      { i: "appointments", x: 1, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 2, y: 0, w: 1, h: 1 },
      { i: "revenue-expenses", x: 0, y: 1, w: 2, h: 2 },
      { i: "department-distribution", x: 2, y: 1, w: 2, h: 2 },
      { i: "recent-activity", x: 0, y: 3, w: 2, h: 2 },
    ],
  },
  {
    id: "comprehensive",
    name: "Comprehensive Dashboard",
    description: "Complete overview of all metrics",
    layout: [
      { i: "patient-stats", x: 0, y: 0, w: 1, h: 1 },
      { i: "appointments", x: 1, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 2, y: 0, w: 1, h: 1 },
      { i: "revenue", x: 3, y: 0, w: 1, h: 1 },
      { i: "patient-volume", x: 0, y: 1, w: 2, h: 2 },
      { i: "revenue-expenses", x: 2, y: 1, w: 2, h: 2 },
      { i: "department-distribution", x: 0, y: 3, w: 2, h: 2 },
      { i: "recent-activity", x: 2, y: 3, w: 2, h: 2 },
    ],
  },
];

// Get widget metadata by ID
export const getWidgetById = (id: string) => {
  return widgetTypes.find((widget) => widget.id === id);
};

// Function to render widget based on type
export const renderWidget = (
  widget: { id: string; type: string },
  isCustomizing: boolean,
  onRemove: (id: string) => void,
  onConfigure: (id: string) => void
) => {
  const widgetDef = getWidgetById(widget.id);

  if (!widgetDef) return null;

  // Render stat card
  if (widgetDef.type === "stat") {
    const statCardProps = getStatCardProps(widget.id);
    if (!statCardProps) return null;

    return (
      <StatCard
        id={widget.id}
        title={statCardProps.title}
        value={statCardProps.value}
        change={statCardProps.change}
        isIncrease={statCardProps.isIncrease}
        icon={statCardProps.icon}
        isCustomizing={isCustomizing}
        onRemove={onRemove}
        onConfigure={onConfigure}
      />
    );
  }

  // Render chart/component widgets
  if (widgetDef.component) {
    const Component = widgetDef.component;
    return (
      <Component
        id={widget.id}
        isCustomizing={isCustomizing}
        onRemove={onRemove}
        onConfigure={onConfigure}
      />
    );
  }

  return null;
};

// Get stat card props based on widget ID
const getStatCardProps = (widgetId: string) => {
  switch (widgetId) {
    case "patient-stats":
      return {
        title: "Total Patients",
        value: "1,248",
        change: "12%",
        isIncrease: true,
        icon: Icons.patients,
      };
    case "appointments":
      return {
        title: "Appointments",
        value: "268",
        change: "8%",
        isIncrease: true,
        icon: Icons.appointments,
      };
    case "bed-occupancy":
      return {
        title: "Bed Occupancy",
        value: "76%",
        change: "3%",
        isIncrease: false,
        icon: Icons.beds,
      };
    case "revenue":
      return {
        title: "Revenue",
        value: "$68,492",
        change: "6%",
        isIncrease: true,
        icon: Icons.revenue,
      };
    default:
      return null;
  }
};
