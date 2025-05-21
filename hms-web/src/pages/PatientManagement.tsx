import { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  UserIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  TableCellsIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import "../styles/dashboard.css";
import "../styles/customization.css";
import { useTheme } from "../contexts/ThemeContext";
import DashboardBanner from "../components/dashboard/DashboardBanner";
import DecorativePattern from "../components/dashboard/DecorativePattern";
import { useNavigate } from "react-router-dom";

// Set up responsive grid
const ResponsiveGridLayout = WidthProvider(Responsive);

// Define layout item interface
interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

// Local storage keys
const PATIENT_LAYOUT_KEY = "hms-patient-layout";
const PATIENT_USER_LAYOUTS_KEY = "hms-patient-user-layouts";
const PATIENT_LAYOUTS_CONFIG_KEY = "hms-patient-layouts-config";

// Patient status types
type PatientStatus =
  | "Active"
  | "Discharged"
  | "Scheduled"
  | "Waiting"
  | "InProgress";

// Patient data interface
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  email: string;
  address: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  medicalRecordNumber: string;
  status: PatientStatus;
  lastVisit?: string;
  upcomingAppointment?: string;
  dateOfBirth: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
}

// Widget definition
interface Widget {
  id: string;
  title: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  icon: React.ElementType;
}

// Layout preset interface
interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  widgets: string[];
  layout?: { [key: string]: LayoutItem[] };
}

// Add type definitions for the demographics and activity data
interface PatientDemographics {
  gender: { [key: string]: number };
  ageGroups: { [key: string]: number };
  insuranceTypes: { [key: string]: number };
  statusDistribution: { [key: string]: number };
}

interface PatientActivityData {
  monthlyPatients: { month: string; count: number }[];
  appointmentTypes: { [key: string]: number };
  visitTimes: { [key: string]: number };
}

// Widget definitions
const patientWidgets: Widget[] = [
  {
    id: "patient-records",
    title: "Patient Records",
    description: "View and manage patient demographic information",
    defaultWidth: 3,
    defaultHeight: 2,
    icon: UserIcon,
  },
  {
    id: "appointments",
    title: "Appointments",
    description: "Schedule and manage patient appointments",
    defaultWidth: 2,
    defaultHeight: 2,
    icon: CalendarDaysIcon,
  },
  {
    id: "medical-history",
    title: "Medical History",
    description: "View patient medical history and conditions",
    defaultWidth: 2,
    defaultHeight: 2,
    icon: ClipboardDocumentListIcon,
  },
  {
    id: "vital-signs",
    title: "Vital Signs",
    description: "Record and monitor patient vital signs",
    defaultWidth: 1,
    defaultHeight: 1,
    icon: ChartBarIcon,
  },
  {
    id: "prescriptions",
    title: "Prescriptions",
    description: "Manage patient medications and prescriptions",
    defaultWidth: 2,
    defaultHeight: 1,
    icon: ClipboardDocumentCheckIcon,
  },
  {
    id: "patient-stats",
    title: "Patient Statistics",
    description: "View patient demographic statistics and key metrics",
    defaultWidth: 2,
    defaultHeight: 2,
    icon: UsersIcon,
  },
  {
    id: "patient-activity",
    title: "Patient Activity",
    description: "Monitor patient visit frequency and trends",
    defaultWidth: 2,
    defaultHeight: 2,
    icon: ArrowTrendingUpIcon,
  },
  {
    id: "patient-table",
    title: "Patient Data Table",
    description: "View comprehensive patient list with details",
    defaultWidth: 4,
    defaultHeight: 3,
    icon: TableCellsIcon,
  },
];

// Layout presets
const layoutPresets: LayoutPreset[] = [
  {
    id: "default",
    name: "Standard View",
    description: "Default patient management layout",
    widgets: [
      "patient-records",
      "appointments",
      "medical-history",
      "vital-signs",
      "prescriptions",
    ],
    layout: {
      lg: [
        { i: "patient-records", x: 0, y: 0, w: 3, h: 2 },
        { i: "appointments", x: 0, y: 2, w: 2, h: 2 },
        { i: "medical-history", x: 2, y: 2, w: 2, h: 2 },
        { i: "vital-signs", x: 3, y: 0, w: 1, h: 1 },
        { i: "prescriptions", x: 3, y: 1, w: 1, h: 1 },
      ],
    },
  },
  {
    id: "clinical",
    name: "Clinical Focus",
    description: "Focus on clinical information and vital signs",
    widgets: ["medical-history", "vital-signs", "prescriptions"],
    layout: {
      lg: [
        { i: "medical-history", x: 0, y: 0, w: 2, h: 2 },
        { i: "vital-signs", x: 2, y: 0, w: 2, h: 2 },
        { i: "prescriptions", x: 0, y: 2, w: 4, h: 1 },
      ],
    },
  },
  {
    id: "administrative",
    name: "Administrative View",
    description: "Focus on patient records and appointments",
    widgets: ["patient-records", "appointments"],
    layout: {
      lg: [
        { i: "patient-records", x: 0, y: 0, w: 3, h: 2 },
        { i: "appointments", x: 0, y: 2, w: 3, h: 2 },
      ],
    },
  },
];

// Add sample patient demographics data
const patientDemographics = {
  gender: { Male: 45, Female: 52, Other: 3 },
  ageGroups: { "0-18": 12, "19-35": 24, "36-50": 31, "51-65": 18, "65+": 15 },
  insuranceTypes: { "Blue Cross": 35, Medicare: 28, Aetna: 22, Other: 15 },
  statusDistribution: {
    Active: 75,
    Scheduled: 15,
    Waiting: 5,
    InProgress: 3,
    Discharged: 2,
  },
};

// Add sample patient activity data
const patientActivityData = {
  monthlyPatients: [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 140 },
    { month: "Mar", count: 135 },
    { month: "Apr", count: 155 },
    { month: "May", count: 170 },
    { month: "Jun", count: 190 },
  ],
  appointmentTypes: {
    "Follow-up": 42,
    "New Patient": 25,
    "Annual Physical": 18,
    "Specialist Referral": 15,
  },
  visitTimes: {
    "Morning (8-12)": 40,
    "Afternoon (12-5)": 35,
    "Evening (5-8)": 25,
  },
};

// Sample patient data
const samplePatients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    contactNumber: "(555) 123-4567",
    email: "john.smith@example.com",
    address: "123 Main St, Anytown, CA 12345",
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC123456789",
    medicalRecordNumber: "MRN001",
    status: "Active",
    lastVisit: "2023-04-15",
    upcomingAppointment: "2023-06-20",
    dateOfBirth: "1978-05-12",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    contactNumber: "(555) 987-6543",
    email: "sarah.johnson@example.com",
    address: "456 Oak Ave, Somewhere, NY 67890",
    insuranceProvider: "Aetna",
    insuranceNumber: "AE987654321",
    medicalRecordNumber: "MRN002",
    status: "Active",
    lastVisit: "2023-05-03",
    upcomingAppointment: "2023-07-10",
    dateOfBirth: "1991-08-23",
    bloodType: "A-",
    allergies: ["Sulfa Drugs", "Shellfish"],
    chronicConditions: [],
  },
  {
    id: "P003",
    name: "Robert Chen",
    age: 67,
    gender: "Male",
    contactNumber: "(555) 456-7890",
    email: "robert.chen@example.com",
    address: "789 Pine St, Elsewhere, TX 54321",
    insuranceProvider: "Medicare",
    insuranceNumber: "MC456789012",
    medicalRecordNumber: "MRN003",
    status: "Active",
    lastVisit: "2023-05-10",
    upcomingAppointment: "2023-06-15",
    dateOfBirth: "1956-01-30",
    bloodType: "B+",
    allergies: ["Ibuprofen", "Contrast Dye"],
    chronicConditions: [
      "Coronary Artery Disease",
      "Osteoarthritis",
      "Glaucoma",
    ],
  },
];

// Extend the sample patients data
const extendedPatients: Patient[] = [
  ...samplePatients,
  {
    id: "P004",
    name: "Emily Rodriguez",
    age: 28,
    gender: "Female",
    contactNumber: "(555) 789-1234",
    email: "emily.rodriguez@example.com",
    address: "321 Elm St, Somewhere, CA 90210",
    insuranceProvider: "Aetna",
    insuranceNumber: "AE123456789",
    medicalRecordNumber: "MRN004",
    status: "Scheduled",
    lastVisit: "2023-04-22",
    upcomingAppointment: "2023-06-12",
    dateOfBirth: "1995-03-17",
    bloodType: "A+",
    allergies: ["Dust", "Pollen"],
    chronicConditions: ["Asthma"],
  },
  {
    id: "P005",
    name: "David Kim",
    age: 52,
    gender: "Male",
    contactNumber: "(555) 567-8901",
    email: "david.kim@example.com",
    address: "456 Maple Ave, Anystate, NY 12345",
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC987654321",
    medicalRecordNumber: "MRN005",
    status: "Active",
    lastVisit: "2023-05-05",
    upcomingAppointment: "2023-06-25",
    dateOfBirth: "1971-11-08",
    bloodType: "O-",
    allergies: ["Sulfa"],
    chronicConditions: ["Hypertension", "High Cholesterol"],
  },
  {
    id: "P006",
    name: "Sophia Martinez",
    age: 35,
    gender: "Female",
    contactNumber: "(555) 234-5678",
    email: "sophia.martinez@example.com",
    address: "789 Oak St, Othertown, FL 33456",
    insuranceProvider: "Medicare",
    insuranceNumber: "MC123789456",
    medicalRecordNumber: "MRN006",
    status: "Waiting",
    lastVisit: "2023-05-15",
    dateOfBirth: "1988-07-22",
    bloodType: "B-",
    allergies: [],
    chronicConditions: ["Migraine"],
  },
  {
    id: "P007",
    name: "James Wilson",
    age: 72,
    gender: "Male",
    contactNumber: "(555) 345-6789",
    email: "james.wilson@example.com",
    address: "123 Cherry Ln, Somewhere, CA 95123",
    insuranceProvider: "Medicare",
    insuranceNumber: "MC654321987",
    medicalRecordNumber: "MRN007",
    status: "Discharged",
    lastVisit: "2023-05-01",
    dateOfBirth: "1951-02-14",
    bloodType: "AB+",
    allergies: ["Penicillin", "Morphine"],
    chronicConditions: ["Diabetes Type 2", "COPD", "Arthritis"],
  },
];

const PatientManagement = () => {
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);
  const navigate = useNavigate();

  // State for customization
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState("default");
  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [userLayouts, setUserLayouts] = useState<LayoutPreset[]>([]);

  // Patient state - using the extended patients dataset
  const [patients] = useState<Patient[]>(extendedPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "All">(
    "All"
  );

  // Add a layout preset that includes all the new chart widgets
  const analyticsPreset: LayoutPreset = {
    id: "analytics",
    name: "Analytics Dashboard",
    description: "Focus on patient statistics and activity trends",
    widgets: ["patient-stats", "patient-activity", "patient-table"],
    layout: {
      lg: [
        { i: "patient-stats", x: 0, y: 0, w: 2, h: 2 },
        { i: "patient-activity", x: 2, y: 0, w: 2, h: 2 },
        { i: "patient-table", x: 0, y: 2, w: 4, h: 3 },
      ],
    },
  };

  // Add the analytics preset to layout presets
  const allLayoutPresets = [...layoutPresets, analyticsPreset];

  // Load saved layout from local storage
  useEffect(() => {
    const savedLayout = localStorage.getItem(PATIENT_LAYOUT_KEY);
    if (savedLayout) {
      try {
        const layout = JSON.parse(savedLayout);
        setSelectedLayout(layout.id);
        setActiveWidgets(layout.widgets);
      } catch (e) {
        console.error("Failed to parse saved layout", e);
        applyLayoutPreset("default");
      }
    } else {
      applyLayoutPreset("default");
    }

    // Load user-defined layouts
    const savedUserLayouts = localStorage.getItem(PATIENT_USER_LAYOUTS_KEY);
    if (savedUserLayouts) {
      try {
        setUserLayouts(JSON.parse(savedUserLayouts));
      } catch (e) {
        console.error("Failed to parse user layouts", e);
      }
    }

    // Load saved grid layouts
    const savedLayouts = localStorage.getItem(PATIENT_LAYOUTS_CONFIG_KEY);
    if (savedLayouts) {
      try {
        setLayouts(JSON.parse(savedLayouts));
      } catch (e) {
        console.error("Failed to parse saved grid layouts", e);
      }
    }
  }, []);

  // Apply a layout preset
  const applyLayoutPreset = (layoutId: string) => {
    // Check user layouts first
    const userPreset = userLayouts.find((p) => p.id === layoutId);

    // Then check default presets
    const preset = userPreset || layoutPresets.find((p) => p.id === layoutId);

    if (preset) {
      setActiveWidgets(preset.widgets);
      setSelectedLayout(layoutId);

      // Set grid layout if available
      if (preset.layout) {
        // Create responsive layouts
        const newLayouts: { [key: string]: LayoutItem[] } = {
          ...preset.layout,
        };

        // Add responsive variants if not present
        if (!newLayouts.md) {
          newLayouts.md = (newLayouts.lg || []).map((item) => ({
            ...item,
            x: item.x % 3, // 3 columns on medium
            w: Math.min(item.w, 3),
          }));
        }

        if (!newLayouts.sm) {
          newLayouts.sm = (newLayouts.lg || []).map((item) => ({
            ...item,
            x: item.x % 2, // 2 columns on small
            w: Math.min(item.w, 2),
          }));
        }

        if (!newLayouts.xs) {
          newLayouts.xs = (newLayouts.lg || []).map((item) => ({
            ...item,
            x: 0, // 1 column on xs
            w: 1,
          }));
        }

        setLayouts(newLayouts);
      } else {
        // Create default layout based on widgets
        const widgetsData = preset.widgets
          .map((id) => patientWidgets.find((w) => w.id === id))
          .filter(Boolean) as Widget[];

        const newLayouts = {
          lg: widgetsData.map((widget, index) => ({
            i: widget.id,
            x: index % 4,
            y: Math.floor(index / 4),
            w: widget.defaultWidth,
            h: widget.defaultHeight,
            minW: 1,
            minH: 1,
          })),
          md: widgetsData.map((widget, index) => ({
            i: widget.id,
            x: index % 3,
            y: Math.floor(index / 3),
            w: Math.min(widget.defaultWidth, 3),
            h: widget.defaultHeight,
            minW: 1,
            minH: 1,
          })),
          sm: widgetsData.map((widget, index) => ({
            i: widget.id,
            x: index % 2,
            y: Math.floor(index / 2),
            w: Math.min(widget.defaultWidth, 2),
            h: widget.defaultHeight,
            minW: 1,
            minH: 1,
          })),
          xs: widgetsData.map((widget, index) => ({
            i: widget.id,
            x: 0,
            y: index,
            w: 1,
            h: widget.defaultHeight,
            minW: 1,
            minH: 1,
          })),
        };
        setLayouts(newLayouts);
      }
    }
  };

  // Handle layout change
  const handleLayoutChange = (
    layout: LayoutItem[],
    allLayouts: { [key: string]: LayoutItem[] }
  ) => {
    setLayouts(allLayouts);
    // Save to localStorage
    localStorage.setItem(
      PATIENT_LAYOUTS_CONFIG_KEY,
      JSON.stringify(allLayouts)
    );
  };

  // Handle breakpoint change
  const handleBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  };

  // Save current layout
  const saveLayout = () => {
    const currentLayout = {
      id: selectedLayout,
      widgets: activeWidgets,
      layout: layouts,
    };

    localStorage.setItem(PATIENT_LAYOUT_KEY, JSON.stringify(currentLayout));
    localStorage.setItem(PATIENT_LAYOUTS_CONFIG_KEY, JSON.stringify(layouts));
    setIsCustomizing(false);
    setShowConfigPanel(false);
  };

  // Add a widget
  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      // Get widget definition
      const widgetDef = patientWidgets.find((w) => w.id === widgetId);
      if (!widgetDef) return;

      // Add widget to active list
      const newActiveWidgets = [...activeWidgets, widgetId];
      setActiveWidgets(newActiveWidgets);

      // Find position for new widget
      let maxY = 0;
      if (layouts[currentBreakpoint]?.length > 0) {
        layouts[currentBreakpoint].forEach((item) => {
          const itemBottom = item.y + item.h;
          if (itemBottom > maxY) maxY = itemBottom;
        });
      }

      // Add to layouts
      const newLayouts = { ...layouts };
      const layoutItem = {
        i: widgetId,
        x: 0,
        y: maxY,
        w: widgetDef.defaultWidth || 1,
        h: widgetDef.defaultHeight || 1,
        minW: 1,
        minH: 1,
      };

      // Add to all breakpoints
      Object.keys(newLayouts).forEach((breakpoint) => {
        if (!newLayouts[breakpoint]) {
          newLayouts[breakpoint] = [];
        }
        newLayouts[breakpoint] = [
          ...newLayouts[breakpoint],
          {
            ...layoutItem,
            x: breakpoint === "xs" ? 0 : layoutItem.x,
            w:
              breakpoint === "xs"
                ? 1
                : breakpoint === "sm"
                  ? Math.min(layoutItem.w, 2)
                  : layoutItem.w,
          },
        ];
      });

      setLayouts(newLayouts);
    }
  };

  // Remove widget
  const removeWidget = (widgetId: string) => {
    // Remove from active widgets
    setActiveWidgets(activeWidgets.filter((id) => id !== widgetId));

    // Remove from layouts
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach((breakpoint) => {
      newLayouts[breakpoint] = newLayouts[breakpoint].filter(
        (item) => item.i !== widgetId
      );
    });

    setLayouts(newLayouts);
  };

  // Save as new layout
  const saveAsNewLayout = (name: string, description: string) => {
    const newLayoutId = `custom-${Date.now()}`;
    const newLayout: LayoutPreset = {
      id: newLayoutId,
      name,
      description,
      widgets: activeWidgets,
      layout: layouts,
    };

    const updatedUserLayouts = [...userLayouts, newLayout];
    setUserLayouts(updatedUserLayouts);
    setSelectedLayout(newLayoutId);

    // Save to local storage
    localStorage.setItem(
      PATIENT_USER_LAYOUTS_KEY,
      JSON.stringify(updatedUserLayouts)
    );
    localStorage.setItem(PATIENT_LAYOUT_KEY, JSON.stringify(newLayout));
    localStorage.setItem(PATIENT_LAYOUTS_CONFIG_KEY, JSON.stringify(layouts));

    setIsCustomizing(false);
    setShowConfigPanel(false);
  };

  // Filter patients based on search query and status filter
  const filteredPatients = patients.filter(
    (patient) =>
      (statusFilter === "All" || patient.status === statusFilter) &&
      (patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.medicalRecordNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  // Add function to handle patient click
  const handlePatientClick = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="p-0 md:p-6 pt-0 md:pt-0 h-full">
      <DecorativePattern />
      <DashboardBanner
        title="Patient Management"
        subtitle="View and manage patient information, appointments, and medical records"
        actionButton={
          isCustomizing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConfigPanel(true)}
                className="flex items-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                Configure Layout
              </button>
              <button
                onClick={() => setIsCustomizing(false)}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Exit Customization
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCustomizing(true)}
              className="flex items-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Customize Page
            </button>
          )
        }
      />

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar, Status Filter, and Add Patient Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
              placeholder="Search patients by name, ID, or MRN"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as PatientStatus | "All")
              }
              aria-label="Filter patients by status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Waiting">Waiting</option>
              <option value="InProgress">In Progress</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add New Patient
          </button>
        </div>

        {/* Widget Grid */}
        <div
          className={`dashboard-grid ${isCustomizing ? "is-customizing" : ""} mb-8`}
        >
          {activeWidgets.length > 0 && layouts.lg && (
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
              cols={{ lg: 4, md: 3, sm: 2, xs: 1 }}
              rowHeight={150}
              margin={[16, 16]}
              containerPadding={[0, 0]}
              onLayoutChange={handleLayoutChange}
              onBreakpointChange={handleBreakpointChange}
              isDraggable={isCustomizing}
              isResizable={isCustomizing}
              draggableHandle=".widget-drag-handle"
            >
              {activeWidgets.map((widgetId) => (
                <div
                  key={widgetId}
                  className="card relative overflow-hidden animate-fade-in-up"
                >
                  {isCustomizing && (
                    <>
                      <div className="widget-drag-handle absolute inset-x-0 top-0 h-8 z-10 flex items-center justify-center cursor-move">
                        <div className="w-10 h-1 bg-gray-300/30 rounded-full"></div>
                      </div>
                      <button
                        onClick={() => removeWidget(widgetId)}
                        className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 shadow-lg transition-opacity"
                        title="Remove widget"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <div className="h-full p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">
                      {patientWidgets.find((w) => w.id === widgetId)?.title ||
                        "Widget"}
                    </h2>
                    <div className="text-sm">
                      {widgetId === "patient-records" ? (
                        filteredPatients.length > 0 ? (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {filteredPatients.map((patient) => (
                              <div
                                key={patient.id}
                                className="p-2 bg-black/10 rounded-md hover:bg-black/20 cursor-pointer"
                                onClick={() => handlePatientClick(patient.id)}
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {patient.name}
                                  </span>
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                    {patient.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  MRN: {patient.medicalRecordNumber} | DOB:{" "}
                                  {patient.dateOfBirth}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 py-4">
                            No patients match your search criteria
                          </div>
                        )
                      ) : widgetId === "patient-stats" ? (
                        <PatientStatsWidget
                          demographics={patientDemographics}
                        />
                      ) : widgetId === "patient-activity" ? (
                        <PatientActivityWidget
                          activityData={patientActivityData}
                        />
                      ) : widgetId === "patient-table" ? (
                        <PatientTableWidget
                          patients={filteredPatients}
                          onPatientClick={handlePatientClick}
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          Widget content will be implemented here
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          )}

          {isCustomizing && activeWidgets.length === 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowConfigPanel(true)}
                className="h-32 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:bg-gray-800 text-gray-500 hover:border-primary hover:text-primary transition-colors px-6"
              >
                <div className="flex flex-col items-center">
                  <PlusIcon className="h-8 w-8 mb-2" />
                  <span>Add Widgets</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Configuration Panel */}
        {showConfigPanel && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfigPanel(false)}
          >
            <div
              className="relative w-full max-w-2xl p-6 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{ background: gradients.content }}
            >
              <button
                onClick={() => setShowConfigPanel(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10"
                aria-label="Close dialog"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Patient Management Configuration
              </h2>

              {/* Layout Presets */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Layout Presets
                </h3>
                <div className="space-y-2">
                  {[...allLayoutPresets, ...userLayouts].map((preset) => (
                    <div
                      key={preset.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedLayout === preset.id
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-black/10 hover:bg-black/20"
                      }`}
                      onClick={() => applyLayoutPreset(preset.id)}
                    >
                      <p className="font-medium">{preset.name}</p>
                      <p className="text-xs text-gray-400">
                        {preset.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Available Widgets
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {patientWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                        activeWidgets.includes(widget.id)
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-black/10 hover:bg-black/20"
                      }`}
                      onClick={() => {
                        if (activeWidgets.includes(widget.id)) {
                          removeWidget(widget.id);
                        } else {
                          addWidget(widget.id);
                        }
                      }}
                    >
                      <widget.icon className="h-5 w-5 mr-2" />
                      <span>{widget.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Instructions */}
              {isCustomizing && activeWidgets.length > 0 && (
                <div className="mb-6 p-3 bg-black/10 rounded-md">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Layout Tips
                  </h3>
                  <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                    <li>
                      Drag the handle at the top of each widget to move it
                    </li>
                    <li>Drag the bottom-right corner to resize widgets</li>
                    <li>Changes are saved automatically</li>
                    <li>The layout adapts to different screen sizes</li>
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={saveLayout}
                  className="px-4 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>

                <SaveAsNewLayoutForm onSave={saveAsNewLayout} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// New components for the patient widgets
const PatientStatsWidget = ({
  demographics,
}: {
  demographics: PatientDemographics;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Gender Distribution</h3>
        <div className="flex h-8 rounded-md overflow-hidden">
          {Object.entries(demographics.gender).map(([gender, count], index) => {
            const percentage = (
              (count /
                Object.values(demographics.gender).reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(0);
            const colors = ["bg-blue-500", "bg-pink-500", "bg-purple-500"];
            return (
              <div
                key={gender}
                className={`${colors[index]} flex items-center justify-center`}
                style={{ width: `${percentage}%` }}
                title={`${gender}: ${percentage}%`}
              >
                <span className="text-xs text-white font-medium">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-2 space-x-4">
          {Object.entries(demographics.gender).map(([gender, count], index) => {
            const colors = [
              "text-blue-500",
              "text-pink-500",
              "text-purple-500",
            ];
            return (
              <div key={gender} className="flex items-center">
                <div
                  className={`w-3 h-3 ${colors[index].replace("text", "bg")} rounded-full mr-1`}
                ></div>
                <span className="text-xs">
                  {gender} ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Age Distribution</h3>
        <div className="grid grid-cols-5 gap-1 h-24">
          {Object.entries(demographics.ageGroups).map(([range, count]) => {
            const maxCount = Math.max(...Object.values(demographics.ageGroups));
            const height = ((count / maxCount) * 100).toFixed(0);

            return (
              <div key={range} className="flex flex-col items-center">
                <div className="flex-grow w-full flex items-end">
                  <div
                    className="w-full bg-primary/80 rounded-t-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-xs mt-1">{range}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Patient Status</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(demographics.statusDistribution).map(
            ([status, count]) => {
              const colors: { [key: string]: string } = {
                Active: "bg-green-500",
                Scheduled: "bg-blue-500",
                Waiting: "bg-yellow-500",
                InProgress: "bg-purple-500",
                Discharged: "bg-gray-500",
              };

              return (
                <div key={status} className="flex items-center space-x-1">
                  <div
                    className={`${colors[status] || "bg-gray-500"} w-2 h-2 rounded-full`}
                  ></div>
                  <span className="text-xs">
                    {status}: {count}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

const PatientActivityWidget = ({
  activityData,
}: {
  activityData: PatientActivityData;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Monthly Patient Visits</h3>
        <div className="h-32">
          <div className="flex items-end h-24 space-x-1">
            {activityData.monthlyPatients.map((data) => {
              const maxCount = Math.max(
                ...activityData.monthlyPatients.map((d) => d.count)
              );
              const height = ((data.count / maxCount) * 100).toFixed(0);

              return (
                <div
                  key={data.month}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-primary/80 rounded-t-sm hover:bg-primary transition-colors"
                    style={{ height: `${height}%` }}
                    title={`${data.month}: ${data.count} visits`}
                  ></div>
                  <span className="text-xs mt-1">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Appointment Types</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(activityData.appointmentTypes).map(
            ([type, count], index) => {
              const colors = [
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-purple-500",
                "bg-red-500",
              ];
              return (
                <div key={type} className="flex items-center space-x-1">
                  <div
                    className={`${colors[index % colors.length]} w-2 h-2 rounded-full`}
                  ></div>
                  <span className="text-xs">
                    {type}: {count}%
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Visit Time Distribution</h3>
        <div className="flex items-center h-8 rounded-md overflow-hidden">
          {Object.entries(activityData.visitTimes).map(
            ([time, percent], index) => {
              const colors = ["bg-yellow-400", "bg-blue-400", "bg-indigo-400"];
              return (
                <div
                  key={time}
                  className={`${colors[index]} h-full flex items-center justify-center`}
                  style={{ width: `${percent}%` }}
                >
                  <span className="text-xs text-gray-800 font-medium">
                    {percent}%
                  </span>
                </div>
              );
            }
          )}
        </div>
        <div className="flex justify-center mt-2 space-x-4">
          {Object.entries(activityData.visitTimes).map(([time], index) => {
            const colors = [
              "text-yellow-400",
              "text-blue-400",
              "text-indigo-400",
            ];
            return (
              <div key={time} className="flex items-center">
                <div
                  className={`w-3 h-3 ${colors[index].replace("text", "bg")} rounded-full mr-1`}
                ></div>
                <span className="text-xs">{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PatientTableWidget = ({
  patients,
  onPatientClick,
}: {
  patients: Patient[];
  onPatientClick: (patientId: string) => void;
}) => {
  return (
    <div className="overflow-auto h-full max-h-[400px] custom-scrollbar">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
          <tr>
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Patient
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Demographics
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Insurance
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Medical
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-800/60 cursor-pointer"
              onClick={() => onPatientClick(patient.id)}
            >
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-medium">{patient.name}</div>
                    <div className="text-xs text-gray-500">{patient.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm">
                  {patient.gender}, {patient.age}
                </div>
                <div className="text-xs text-gray-500">
                  DOB: {patient.dateOfBirth}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm">{patient.contactNumber}</div>
                <div className="text-xs text-gray-500">{patient.email}</div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm">
                  {patient.insuranceProvider || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  {patient.insuranceNumber || "N/A"}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                <div className="text-sm">
                  MRN: {patient.medicalRecordNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {patient.chronicConditions.length > 0
                    ? `${patient.chronicConditions.length} conditions`
                    : "No conditions"}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${patient.status === "Active" ? "bg-green-100 text-green-800" : ""}
                  ${patient.status === "Scheduled" ? "bg-blue-100 text-blue-800" : ""}
                  ${patient.status === "Waiting" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${patient.status === "InProgress" ? "bg-purple-100 text-purple-800" : ""}
                  ${patient.status === "Discharged" ? "bg-gray-100 text-gray-800" : ""}
                `}
                >
                  {patient.status}
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  {patient.lastVisit
                    ? `Last: ${patient.lastVisit}`
                    : "No visits"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Save As New Layout Form component
const SaveAsNewLayoutForm = ({
  onSave,
}: {
  onSave: (name: string, description: string) => void;
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, description);
      setName("");
      setDescription("");
      setIsFormVisible(false);
    }
  };

  if (!isFormVisible) {
    return (
      <button
        onClick={() => setIsFormVisible(true)}
        className="px-4 py-2 text-sm font-medium rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
      >
        Save as New Layout
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Layout name"
        className="w-full p-2 rounded-md bg-black/10 border border-gray-700/30 text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description (optional)"
        className="w-full p-2 rounded-md bg-black/10 border border-gray-700/30 text-white h-20 resize-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => setIsFormVisible(false)}
          className="px-4 py-2 text-sm font-medium rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PatientManagement;
