import React from "react";
import StatCard from "./StatCard";
import PatientVolumeChart from "./PatientVolumeChart";
import RevenueExpensesChart from "./RevenueExpensesChart";
import DepartmentDistribution from "./DepartmentDistribution";
import RecentActivity from "./RecentActivity";
import CustomWidget from "./CustomWidget";
import PatientTable from "./PatientTable";
import StaffScheduleWidget from "./StaffScheduleWidget";
import EquipmentStatusWidget from "./EquipmentStatusWidget";
import ComplianceWidget from "./ComplianceWidget";
import QualityMetricsWidget from "./QualityMetricsWidget";
import MultiBranchWidget from "./MultiBranchWidget";
import type { CustomWidgetData } from "./CustomWidget";

// Common widget component props interface to solve type compatibility issues
export interface WidgetComponentProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
  config?: Record<string, unknown>;
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
  defaultConfig?: Record<string, unknown>;
  configOptions?: Array<{
    key: string;
    label: string;
    type: string;
    options?: Array<{ value: string; label: string }>;
    default?: unknown;
    description?: string;
  }>;
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

export interface TableWidget extends WidgetBase {
  type: "table";
  component: React.ComponentType<WidgetComponentProps>;
}

export interface ActivityWidget extends WidgetBase {
  type: "activity";
  component: React.ComponentType<WidgetComponentProps>;
}

export interface CustomWidgetType extends WidgetBase {
  type: "custom";
  widgetType?: "text" | "stat" | "link";
  content?: string;
  value?: string;
  change?: string;
  isIncrease?: boolean;
  backgroundColor?: string;
}

export type Widget =
  | StatWidget
  | ChartWidget
  | ListWidget
  | TableWidget
  | ActivityWidget
  | CustomWidgetType;

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
  equipment: (
    <svg
      className="h-6 w-6 text-violet-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  compliance: (
    <svg
      className="h-6 w-6 text-emerald-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  quality: (
    <svg
      className="h-6 w-6 text-amber-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
  multiBranch: (
    <svg
      className="h-6 w-6 text-sky-500"
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
    configOptions: [
      {
        key: "showChange",
        label: "Show Change Indicator",
        type: "checkbox",
        default: true,
        description: "Show percentage change compared to previous period",
      },
      {
        key: "displayMode",
        label: "Display Mode",
        type: "select",
        options: [
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
        ],
        default: "daily",
        description: "Time period for displayed statistics",
      },
    ],
  },
  {
    id: "appointments",
    type: "stat",
    title: "Appointment Tracking",
    description: "Summary of scheduled appointments",
    icon: Icons.appointments,
    defaultWidth: 1,
    defaultHeight: 1,
    configOptions: [
      {
        key: "showUpcoming",
        label: "Show Upcoming",
        type: "checkbox",
        default: true,
        description: "Show upcoming appointments only",
      },
    ],
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
    configOptions: [
      {
        key: "chartType",
        label: "Chart Type",
        type: "select",
        options: [
          { value: "line", label: "Line Chart" },
          { value: "bar", label: "Bar Chart" },
          { value: "area", label: "Area Chart" },
        ],
        default: "line",
        description: "Type of chart to display",
      },
      {
        key: "dataPeriod",
        label: "Data Period",
        type: "select",
        options: [
          { value: "week", label: "Last 7 Days" },
          { value: "month", label: "Last 30 Days" },
          { value: "quarter", label: "Last 90 Days" },
          { value: "year", label: "Last 365 Days" },
        ],
        default: "month",
        description: "Time period for displayed data",
      },
      {
        key: "showDataPoints",
        label: "Show Data Points",
        type: "checkbox",
        default: true,
        description: "Show individual data points on the chart",
      },
    ],
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
    description: "Patient distribution across departments",
    icon: "🍩",
    component: DepartmentDistribution,
    defaultWidth: 2,
    defaultHeight: 2,
  },
  {
    id: "patient-records",
    type: "table",
    title: "Patient Records",
    description: "List of current patients and their status",
    icon: "📋",
    component: PatientTable,
    defaultWidth: 3,
    defaultHeight: 2,
  },
  {
    id: "recent-activity",
    type: "activity",
    title: "Recent Activity",
    description: "Latest hospital activities and events",
    icon: "🔔",
    component: RecentActivity,
    defaultWidth: 2,
    defaultHeight: 2,
  },
  {
    id: "staff-schedule",
    type: "table",
    title: "Staff Schedule",
    description: "Staff scheduling and availability",
    icon: Icons.staff,
    component: StaffScheduleWidget,
    defaultWidth: 2,
    defaultHeight: 2,
    configOptions: [
      {
        key: "showDepartment",
        label: "Show Department Column",
        type: "checkbox",
        default: true,
        description: "Display the department column in the staff table",
      },
      {
        key: "filterByStatus",
        label: "Filter by Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "On Duty", label: "On Duty" },
          { value: "On Call", label: "On Call" },
          { value: "Off Duty", label: "Off Duty" },
        ],
        default: "",
        description: "Filter staff list by status",
      },
    ],
  },
  {
    id: "equipment-status",
    type: "chart",
    title: "Equipment Status",
    description: "Medical equipment status and maintenance",
    icon: Icons.equipment,
    component: EquipmentStatusWidget,
    defaultWidth: 2,
    defaultHeight: 2,
    configOptions: [
      {
        key: "showPieChart",
        label: "Show Status Chart",
        type: "checkbox",
        default: true,
        description: "Display the equipment status pie chart",
      },
      {
        key: "showList",
        label: "Show Equipment List",
        type: "checkbox",
        default: true,
        description: "Display the list of critical equipment",
      },
    ],
  },
  {
    id: "compliance-status",
    type: "chart",
    title: "Compliance Status",
    description: "Regulatory compliance and audit tracking",
    icon: Icons.compliance,
    component: ComplianceWidget,
    defaultWidth: 2,
    defaultHeight: 2,
    configOptions: [
      {
        key: "showChart",
        label: "Show Compliance Chart",
        type: "checkbox",
        default: true,
        description: "Display the compliance scores chart",
      },
      {
        key: "showTable",
        label: "Show Upcoming Audits",
        type: "checkbox",
        default: true,
        description: "Display the list of upcoming audits",
      },
    ],
  },
  {
    id: "quality-metrics",
    type: "chart",
    title: "Quality Metrics",
    description: "Key quality indicators and improvement metrics",
    icon: Icons.quality,
    component: QualityMetricsWidget,
    defaultWidth: 2,
    defaultHeight: 2,
    configOptions: [
      {
        key: "showIndicators",
        label: "Show Key Indicators",
        type: "checkbox",
        default: true,
        description: "Display the quality indicators summary",
      },
      {
        key: "showTrends",
        label: "Show Metric Trends",
        type: "checkbox",
        default: true,
        description: "Display the quality trends chart",
      },
      {
        key: "metricToShow",
        label: "Focus Metric",
        type: "select",
        options: [
          { value: "all", label: "All Metrics" },
          { value: "Readmission", label: "Readmission Rate" },
          { value: "Infection", label: "Infection Rate" },
          { value: "Satisfaction", label: "Patient Satisfaction" },
          { value: "Medication", label: "Medication Errors" },
        ],
        default: "all",
        description: "Metric to highlight in the dashboard",
      },
    ],
  },
  {
    id: "multi-branch",
    type: "chart",
    title: "Multi-Branch Performance",
    description: "Metrics across different hospital branches",
    icon: Icons.multiBranch,
    component: MultiBranchWidget,
    defaultWidth: 2,
    defaultHeight: 2,
    configOptions: [
      {
        key: "showChart",
        label: "Show Branch Comparison",
        type: "checkbox",
        default: true,
        description: "Display the branch comparison chart",
      },
      {
        key: "showTable",
        label: "Show Branch Table",
        type: "checkbox",
        default: true,
        description: "Display the branch metrics table",
      },
      {
        key: "metricToShow",
        label: "Comparison Metric",
        type: "select",
        options: [
          { value: "bedOccupancy", label: "Bed Occupancy" },
          { value: "avgWaitTime", label: "Average Wait Time" },
          { value: "patientSatisfaction", label: "Patient Satisfaction" },
          { value: "staffUtilization", label: "Staff Utilization" },
        ],
        default: "bedOccupancy",
        description: "Metric to compare across branches",
      },
    ],
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
        type: "custom", // Ensure the type is always set to "custom"
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
  {
    id: "hr-and-staff",
    name: "HR & Staff Management",
    description: "Focus on workforce management and scheduling",
    layout: [
      { i: "staff-metrics", x: 0, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 1, y: 0, w: 1, h: 1 },
      { i: "revenue", x: 2, y: 0, w: 1, h: 1 },
      { i: "patient-stats", x: 3, y: 0, w: 1, h: 1 },
      { i: "staff-schedule", x: 0, y: 1, w: 2, h: 2 },
      { i: "patient-volume", x: 2, y: 1, w: 2, h: 2 },
      { i: "recent-activity", x: 0, y: 3, w: 2, h: 2 },
      { i: "multi-branch", x: 2, y: 3, w: 2, h: 2 },
    ],
  },
  {
    id: "quality-and-compliance",
    name: "Quality & Compliance",
    description: "Focus on quality metrics and regulatory compliance",
    layout: [
      { i: "patient-stats", x: 0, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 1, y: 0, w: 1, h: 1 },
      { i: "appointments", x: 2, y: 0, w: 1, h: 1 },
      { i: "revenue", x: 3, y: 0, w: 1, h: 1 },
      { i: "quality-metrics", x: 0, y: 1, w: 2, h: 2 },
      { i: "compliance-status", x: 2, y: 1, w: 2, h: 2 },
      { i: "patient-volume", x: 0, y: 3, w: 2, h: 2 },
      { i: "recent-activity", x: 2, y: 3, w: 2, h: 2 },
    ],
  },
  {
    id: "operations-and-equipment",
    name: "Operations & Equipment",
    description: "Focus on operational efficiency and equipment management",
    layout: [
      { i: "patient-stats", x: 0, y: 0, w: 1, h: 1 },
      { i: "revenue", x: 1, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 2, y: 0, w: 1, h: 1 },
      { i: "staff-metrics", x: 3, y: 0, w: 1, h: 1 },
      { i: "equipment-status", x: 0, y: 1, w: 2, h: 2 },
      { i: "revenue-expenses", x: 2, y: 1, w: 2, h: 2 },
      { i: "department-distribution", x: 0, y: 3, w: 2, h: 2 },
      { i: "multi-branch", x: 2, y: 3, w: 2, h: 2 },
    ],
  },
  {
    id: "multi-branch-overview",
    name: "Multi-Branch Overview",
    description: "Focus on performance across different hospital branches",
    layout: [
      { i: "patient-stats", x: 0, y: 0, w: 1, h: 1 },
      { i: "revenue", x: 1, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 2, y: 0, w: 1, h: 1 },
      { i: "staff-metrics", x: 3, y: 0, w: 1, h: 1 },
      { i: "multi-branch", x: 0, y: 1, w: 3, h: 2 },
      { i: "revenue-expenses", x: 3, y: 1, w: 1, h: 2 },
      { i: "quality-metrics", x: 0, y: 3, w: 2, h: 2 },
      { i: "equipment-status", x: 2, y: 3, w: 2, h: 2 },
    ],
  },
  {
    id: "enterprise-full",
    name: "Enterprise Full Dashboard",
    description: "Complete hospital management system dashboard",
    layout: [
      { i: "patient-stats", x: 0, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 1, y: 0, w: 1, h: 1 },
      { i: "revenue", x: 2, y: 0, w: 1, h: 1 },
      { i: "staff-metrics", x: 3, y: 0, w: 1, h: 1 },
      { i: "patient-volume", x: 0, y: 1, w: 2, h: 2 },
      { i: "multi-branch", x: 2, y: 1, w: 2, h: 2 },
      { i: "quality-metrics", x: 0, y: 3, w: 2, h: 2 },
      { i: "compliance-status", x: 2, y: 3, w: 2, h: 2 },
      { i: "staff-schedule", x: 0, y: 5, w: 2, h: 2 },
      { i: "equipment-status", x: 2, y: 5, w: 2, h: 2 },
    ],
  },
  {
    id: "hr-and-staff",
    name: "HR & Staff Management",
    description: "Focus on workforce management and scheduling",
    layout: [
      { i: "staff-metrics", x: 0, y: 0, w: 1, h: 1 },
      { i: "bed-occupancy", x: 1, y: 0, w: 1, h: 1 },
      { i: "revenue", x: 2, y: 0, w: 1, h: 1 },
      { i: "patient-stats", x: 3, y: 0, w: 1, h: 1 },
      { i: "staff-schedule", x: 0, y: 1, w: 2, h: 2 },
      { i: "patient-volume", x: 2, y: 1, w: 2, h: 2 },
      { i: "recent-activity", x: 0, y: 3, w: 2, h: 2 },
      { i: "multi-branch", x: 2, y: 3, w: 2, h: 2 },
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
  widget: { id: string; type: string; config?: Record<string, unknown> },
  isCustomizing: boolean,
  onRemove: (id: string) => void,
  onConfigure: (id: string) => void
) => {
  const widgetDef = getWidgetById(widget.id);

  if (!widgetDef) return null;

  // Special case for create-custom widget - we'll render just a placeholder that opens drawer on click
  if (widget.id === "create-custom") {
    return (
      <div
        className="widget-container bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg border border-white/10 h-full flex flex-col cursor-pointer"
        onClick={() => onConfigure("create-custom")}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-medium">Create Custom Widget</h3>
            <p className="text-sm text-gray-400 mt-1">
              Build your own custom widget
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get widget configuration (merged with defaults)
  const config = widget.config || {};

  // Render stat card
  if (widgetDef.type === "stat") {
    const statCardProps = getStatCardProps(widget.id);
    if (!statCardProps) return null;

    return (
      <StatCard
        id={widget.id}
        title={(config.title as string) || statCardProps.title}
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
    const customConfig: Partial<CustomWidgetType> = {
      ...widgetDef,
      title: (config.title as string) || widgetDef.title,
    };

    // Apply other custom configs if available
    if (config.content) customConfig.content = config.content as string;
    if (config.value) customConfig.value = config.value as string;
    if (config.change) customConfig.change = config.change as string;
    if (config.isIncrease !== undefined)
      customConfig.isIncrease = config.isIncrease as boolean;
    if (config.backgroundColor)
      customConfig.backgroundColor = config.backgroundColor as string;

    return (
      <CustomWidget
        id={widget.id}
        widget={customConfig as CustomWidgetType}
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
        config={config}
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
