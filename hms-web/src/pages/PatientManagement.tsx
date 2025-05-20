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
} from "@heroicons/react/24/outline";
import "../styles/dashboard.css";
import "../styles/customization.css";
import { useTheme } from "../contexts/ThemeContext";
import DashboardBanner from "../components/dashboard/DashboardBanner";
import DecorativePattern from "../components/dashboard/DecorativePattern";

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

const PatientManagement = () => {
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);

  // State for customization
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState("default");
  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [userLayouts, setUserLayouts] = useState<LayoutPreset[]>([]);

  // Patient state
  const [patients] = useState<Patient[]>(samplePatients);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.medicalRecordNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

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
        {/* Search Bar and Add Patient Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
              placeholder="Search patients by name, ID, or medical record number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                  {[...layoutPresets, ...userLayouts].map((preset) => (
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
