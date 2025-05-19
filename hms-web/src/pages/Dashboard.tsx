import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "../styles/dashboard.css";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";

import WidgetSelector from "../components/dashboard/WidgetSelector";
import ConfigPanel from "../components/dashboard/ConfigPanel";
import WidgetConfigPanel from "../components/dashboard/WidgetConfigPanel";
import CustomWidgetDrawer from "../components/dashboard/CustomWidgetDrawer";
import {
  layoutPresets as dashboardPresets,
  renderWidget,
  getWidgetById,
} from "../components/dashboard/WidgetRegistry";
import { cn } from "../utils/cn";
import DashboardBanner from "../components/dashboard/DashboardBanner";
import DecorativePattern from "../components/dashboard/DecorativePattern";
import StatsOverviewCard from "../components/dashboard/StatsOverviewCard";

// Set up responsive grid
const ResponsiveGridLayout = WidthProvider(Responsive);

// Define layout preset interface
interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  layout: LayoutItem[];
}

// User defined layouts local storage key
const USER_LAYOUTS_KEY = "hms-dashboard-layouts";
const DRAG_NOTIFICATION_KEY = "hms-dashboard-drag-notification-shown";
const WIDGET_CONFIGS_KEY = "hms-dashboard-widget-configs";

const Dashboard = () => {
  // Use theme hook
  const { currentTheme } = useTheme();

  // Dashboard state
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [selectedLayout, setSelectedLayout] = useState("comprehensive");
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [userLayouts, setUserLayouts] = useState<LayoutPreset[]>([]);
  const [showDragNotification, setShowDragNotification] = useState(false);
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [showCreateWidgetDrawer, setShowCreateWidgetDrawer] = useState(false);
  const [widgetConfigs, setWidgetConfigs] = useState<{
    [key: string]: Record<string, unknown>;
  }>({});

  // Load user-defined layouts and widget configs from local storage
  useEffect(() => {
    const savedLayouts = localStorage.getItem(USER_LAYOUTS_KEY);
    if (savedLayouts) {
      try {
        setUserLayouts(JSON.parse(savedLayouts));
      } catch (e) {
        console.error("Failed to parse saved layouts", e);
      }
    }

    const savedWidgetConfigs = localStorage.getItem(WIDGET_CONFIGS_KEY);
    if (savedWidgetConfigs) {
      try {
        setWidgetConfigs(JSON.parse(savedWidgetConfigs));
      } catch (e) {
        console.error("Failed to parse saved widget configs", e);
      }
    }

    // Check if drag notification has been shown before
    const dragNotificationShown = localStorage.getItem(DRAG_NOTIFICATION_KEY);
    if (!dragNotificationShown) {
      setShowDragNotification(true);
      localStorage.setItem(DRAG_NOTIFICATION_KEY, "true");
    }
  }, []);

  // Initialize dashboard with default layout
  useEffect(() => {
    applyLayoutPreset("comprehensive");
  }, []);

  // Apply layout preset
  const applyLayoutPreset = (layoutId: string) => {
    // Check user layouts first
    const userPreset = userLayouts.find((p) => p.id === layoutId);

    // Then check default presets
    const preset =
      userPreset ||
      (dashboardPresets.find((p) => p.id === layoutId) as
        | LayoutPreset
        | undefined);

    if (preset) {
      // Extract active widgets from layout
      const widgetIds = preset.layout.map((item) => item.i);
      setActiveWidgets(widgetIds);

      // Create responsive layouts
      const newLayouts = {
        lg: preset.layout,
        md: preset.layout.map((item) => ({
          ...item,
          x: item.x % 3, // 3 columns on medium screens
          w: Math.min(item.w, 3),
        })),
        sm: preset.layout.map((item) => ({
          ...item,
          x: item.x % 2, // 2 columns on small screens
          w: Math.min(item.w, 2),
        })),
        xs: preset.layout.map((item) => ({
          ...item,
          x: 0, // 1 column on extra small screens
          w: 1,
        })),
      };

      setLayouts(newLayouts);
      setSelectedLayout(layoutId);
    }
  };

  // Add widget to dashboard
  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      // Get widget definition
      const widgetDef = getWidgetById(widgetId);
      if (!widgetDef) return;

      // Add widget to active list
      const newActiveWidgets = [...activeWidgets, widgetId];
      setActiveWidgets(newActiveWidgets);

      // Create layout item for the new widget
      const { defaultWidth, defaultHeight } = widgetDef;

      // Find position for new widget
      let maxY = 0;
      if (layouts[currentBreakpoint]?.length > 0) {
        layouts[currentBreakpoint].forEach((item: LayoutItem) => {
          const itemBottom = item.y + item.h;
          if (itemBottom > maxY) maxY = itemBottom;
        });
      }

      // Add to layouts
      const newLayouts = { ...layouts };
      const layoutItem = {
        i: widgetId,
        x: 0,
        y: maxY, // Place at the bottom
        w: defaultWidth || 1,
        h: defaultHeight || 1,
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
            w: breakpoint === "xs" ? 1 : layoutItem.w,
          },
        ];
      });

      setLayouts(newLayouts);
    }
  };

  // Remove widget from dashboard
  const removeWidget = (widgetId: string) => {
    // Remove from active widgets
    setActiveWidgets(activeWidgets.filter((id) => id !== widgetId));

    // Remove from layouts
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach((breakpoint) => {
      newLayouts[breakpoint] = newLayouts[breakpoint].filter(
        (item: LayoutItem) => item.i !== widgetId
      );
    });

    setLayouts(newLayouts);
  };

  // Configure a widget (or create new custom widget)
  const configureWidget = (widgetId: string) => {
    // If this is the create-custom widget, show the drawer
    if (widgetId === "create-custom") {
      setShowCreateWidgetDrawer(true);
      return;
    }

    // If this is a custom widget that needs to be added (new widget was created)
    if (widgetId.startsWith("custom-")) {
      // Always add custom widgets when they are clicked
      if (!activeWidgets.includes(widgetId)) {
        addWidget(widgetId);
        return;
      }
    }

    // Open configuration panel for the widget
    setConfiguring(widgetId);
  };

  // Handle custom widget creation
  const handleWidgetCreated = (widgetId: string) => {
    addWidget(widgetId);
  };

  // Save widget configuration
  const saveWidgetConfig = (
    widgetId: string,
    config: Record<string, unknown>
  ) => {
    // Update widget configurations
    const newWidgetConfigs = {
      ...widgetConfigs,
      [widgetId]: config,
    };

    setWidgetConfigs(newWidgetConfigs);

    // Save to localStorage
    localStorage.setItem(WIDGET_CONFIGS_KEY, JSON.stringify(newWidgetConfigs));

    // Save individual widget config for component-level access
    localStorage.setItem(`widget-config-${widgetId}`, JSON.stringify(config));

    // Close configuration panel
    setConfiguring(null);
  };

  // Save dashboard configuration
  const saveDashboardConfig = () => {
    setIsCustomizing(false);
    setShowConfigPanel(false);
    // In a real application, this would save the configuration to user preferences
    console.log("Dashboard configuration saved:", {
      activeWidgets,
      layouts,
      selectedLayout,
      widgetConfigs,
    });
  };

  // Save current layout as a new preset
  const saveAsNewLayout = (name: string, description: string) => {
    const newLayoutId = `custom-${Date.now()}`;
    const newLayout: LayoutPreset = {
      id: newLayoutId,
      name,
      description,
      layout: layouts.lg || [],
    };

    const updatedUserLayouts = [...userLayouts, newLayout];
    setUserLayouts(updatedUserLayouts);
    setSelectedLayout(newLayoutId);

    // Save to local storage
    localStorage.setItem(USER_LAYOUTS_KEY, JSON.stringify(updatedUserLayouts));
  };

  // Handle layout change
  const handleLayoutChange = (
    layout: LayoutItem[],
    allLayouts: { [key: string]: LayoutItem[] }
  ) => {
    setLayouts(allLayouts);
  };

  // Handle breakpoint change
  const handleBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  };

  // All available layout presets (system + user defined)
  const allPresets = [...dashboardPresets, ...userLayouts];

  return (
    <div className="relative">
      {/* Background decorative pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DecorativePattern
          type="circles"
          color={currentTheme.color}
          opacity={0.03}
          density="low"
          animate={true}
        />
      </div>

      <div className="relative z-10">
        <DashboardBanner
          userName="Administrator"
          hospitalName="MediHub Central"
        />

        {/* Key Stats Overview */}
        <StatsOverviewCard
          title="Hospital Performance Overview"
          patternType="waves"
          className="mb-6"
          stats={[
            {
              label: "Total Patients",
              value: "1,248",
              change: {
                value: "12%",
                isIncrease: true,
              },
              icon: (
                <svg
                  className="h-5 w-5"
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
            },
            {
              label: "Bed Occupancy",
              value: "76%",
              change: {
                value: "3%",
                isIncrease: false,
              },
              icon: (
                <svg
                  className="h-5 w-5"
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
            },
            {
              label: "Average Wait Time",
              value: "24 min",
              change: {
                value: "5%",
                isIncrease: true,
              },
              icon: (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              label: "Revenue",
              value: "$68,492",
              change: {
                value: "6%",
                isIncrease: true,
              },
              icon: (
                <svg
                  className="h-5 w-5"
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
            },
          ]}
        />

        {isCustomizing && (
          <div className="flex justify-between items-center bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg mb-6 border border-white/10">
            <div>
              <h2 className="text-lg font-medium">Customize Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add, remove, or rearrange widgets to personalize your dashboard
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateWidgetDrawer(true)}
                className="flex items-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                <span className="text-lg mr-1">+</span> Create Widget
              </button>
              <button
                onClick={() => setShowConfigPanel(true)}
                className="flex items-center bg-black/20 hover:bg-black/30 text-white py-2 px-4 rounded-md transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-1" /> Dashboard Settings
              </button>
              <button
                onClick={() => setIsCustomizing(false)}
                className="flex items-center bg-black/20 hover:bg-black/30 text-white py-2 px-4 rounded-md transition-colors"
              >
                <XMarkIcon className="h-5 w-5 mr-1" /> Done
              </button>
            </div>
          </div>
        )}

        {!isCustomizing && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-2">
              {/* Time frame filters would go here */}
            </div>
            <button
              onClick={() => setIsCustomizing(true)}
              className="flex items-center bg-black/20 hover:bg-black/30 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-1" /> Customize
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div
          className={`dashboard-grid ${isCustomizing ? "is-customizing" : ""}`}
        >
          {layouts.lg && layouts.lg.length > 0 && (
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
                <div key={widgetId}>
                  {renderWidget(
                    {
                      id: widgetId,
                      type: "",
                      config: widgetConfigs[widgetId] || {},
                    },
                    isCustomizing,
                    removeWidget,
                    configureWidget
                  )}
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfigPanel && (
        <ConfigPanel
          layouts={layouts}
          activeWidgets={activeWidgets}
          selectedLayout={selectedLayout}
          onSave={saveDashboardConfig}
          onClose={() => setShowConfigPanel(false)}
          onApplyLayout={applyLayoutPreset}
          presets={allPresets}
          onSaveAsNew={saveAsNewLayout}
        />
      )}

      {/* Widget Configuration Panel */}
      {configuring && (
        <WidgetConfigPanel
          widgetId={configuring}
          onClose={() => setConfiguring(null)}
          onSave={saveWidgetConfig}
        />
      )}

      {/* Custom Widget Creation Drawer */}
      {showCreateWidgetDrawer && (
        <CustomWidgetDrawer
          onClose={() => setShowCreateWidgetDrawer(false)}
          onWidgetCreated={handleWidgetCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
