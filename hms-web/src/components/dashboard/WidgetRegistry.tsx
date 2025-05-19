import React from "react";
import StatCard from "./StatCard";
import PatientVolumeChart from "./PatientVolumeChart";
import RevenueExpensesChart from "./RevenueExpensesChart";
import DepartmentDistribution from "./DepartmentDistribution";
import RecentActivity from "./RecentActivity";
import CustomWidget from "./CustomWidget";
import type { CustomWidgetData } from "./CustomWidget";

// Common widget component props interface to solve type compatibility issues
export interface WidgetComponentProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
}

// Widget type interfaces
export interface WidgetBase {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode | string;
  defaultWidth: number;
  defaultHeight: number;
  isCreator?: boolean;
  isCustom?: boolean;
  component?: React.ComponentType<WidgetComponentProps>;
}

export interface StatWidget extends WidgetBase {
  type: "stat";
}

export interface ChartWidget extends WidgetBase {
  type: "chart";
  component: React.ComponentType<WidgetComponentProps>;
}

export interface ListWidget extends WidgetBase {
  type: "list";
  component: React.ComponentType<WidgetComponentProps>;
}

export interface CustomWidgetType extends WidgetBase {
  type: "custom";
  content?: string;
  value?: string;
  change?: string;
  isIncrease?: boolean;
  backgroundColor?: string;
}

export type Widget = StatWidget | ChartWidget | ListWidget | CustomWidgetType;

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
  staff: (
    <svg
      className="h-6 w-6 text-blue-500"
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
  ),
  laboratory: (
    <svg
      className="h-6 w-6 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  ),
  pharmacy: (
    <svg
      className="h-6 w-6 text-red-500"
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
};

// Custom widget key in localStorage
export const CUSTOM_WIDGETS_KEY = "hms-custom-widgets";

// Define widget metadata
export const widgetTypes: Widget[] = [
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
    id: "staff-metrics",
    type: "stat",
    title: "Staff Metrics",
    description: "Staff performance and availability",
    icon: Icons.staff,
    defaultWidth: 1,
    defaultHeight: 1,
  },
  {
    id: "lab-stats",
    type: "stat",
    title: "Laboratory Stats",
    description: "Lab test volumes and turnaround times",
    icon: Icons.laboratory,
    defaultWidth: 1,
    defaultHeight: 1,
  },
  {
    id: "pharmacy-metrics",
    type: "stat",
    title: "Pharmacy Metrics",
    description: "Medication dispensing and inventory status",
    icon: Icons.pharmacy,
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
  {
    id: "create-custom",
    type: "custom",
    title: "Create Custom Widget",
    description: "Build your own custom widget",
    icon: "✨",
    defaultWidth: 2,
    defaultHeight: 2,
    isCreator: true,
  },
];

// Get custom widgets from localStorage
export const getCustomWidgets = (): CustomWidgetType[] => {
  try {
    const savedWidgets = localStorage.getItem(CUSTOM_WIDGETS_KEY);
    if (savedWidgets) {
      const widgets = JSON.parse(savedWidgets) as CustomWidgetData[];
      return widgets.map((widget) => ({
        ...widget,
        isCustom: true,
        type: widget.type as "custom",
      }));
    }
  } catch (e) {
    console.error("Failed to parse custom widgets", e);
  }
  return [];
};

// Save custom widget to localStorage
export const saveCustomWidget = (widget: CustomWidgetData): boolean => {
  try {
    const currentWidgets = getCustomWidgets().map((w) => ({
      ...w,
      isCustom: undefined, // Remove the isCustom flag for storage
    }));
    const updatedWidgets = [...currentWidgets, widget];
    localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(updatedWidgets));
    return true;
  } catch (e) {
    console.error("Failed to save custom widget", e);
    return false;
  }
};

// Get all widget types including custom widgets
export const getAllWidgetTypes = (): Widget[] => {
  const customWidgets = getCustomWidgets();
  return [...widgetTypes, ...customWidgets];
};

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
export const getWidgetById = (id: string): Widget | undefined => {
  const allWidgets = getAllWidgetTypes();
  return allWidgets.find((widget) => widget.id === id);
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

  // Render custom widget
  if (widgetDef.type === "custom") {
    return (
      <CustomWidget
        id={widget.id}
        widget={widgetDef}
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

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isIncrease: boolean;
  icon: React.ReactNode;
}

// Get stat card props based on widget ID
const getStatCardProps = (widgetId: string): StatCardProps | null => {
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
    case "staff-metrics":
      return {
        title: "Staff On Duty",
        value: "42",
        change: "5%",
        isIncrease: true,
        icon: Icons.staff,
      };
    case "lab-stats":
      return {
        title: "Lab Tests Today",
        value: "187",
        change: "12%",
        isIncrease: true,
        icon: Icons.laboratory,
      };
    case "pharmacy-metrics":
      return {
        title: "Medications Dispensed",
        value: "324",
        change: "7%",
        isIncrease: true,
        icon: Icons.pharmacy,
      };
    default: {
      // Check if it's a custom widget with stat-like data
      const customWidgets = getCustomWidgets();
      const customWidget = customWidgets.find((w) => w.id === widgetId);

      if (customWidget && customWidget.value) {
        return {
          title: customWidget.title,
          value: customWidget.value || "N/A",
          change: customWidget.change || "0%",
          isIncrease:
            customWidget.isIncrease !== undefined
              ? customWidget.isIncrease
              : true,
          icon: customWidget.icon || "📊",
        };
      }
      return null;
    }
  }
};
