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
    <div className="space-y-6">
      {/* Drag and Drop Notification */}
      {showDragNotification && (
        <div className="fixed bottom-4 right-4 max-w-md p-4 bg-gray-800 text-white rounded-lg shadow-lg z-50 flex justify-between items-center animate-fade-in-up">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <div>
              <p className="font-medium">New Feature!</p>
              <p className="text-sm text-gray-300">
                You can now drag and rearrange dashboard widgets in
                customization mode. Click "Customize Dashboard" to try it out!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDragNotification(false)}
            className="ml-4 text-gray-400 hover:text-white"
            aria-label="Close notification"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

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
              className="flex items-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-all"
            >
              <span className="mr-2">✨</span>
              Create Widget
            </button>
            <button
              onClick={() => setShowConfigPanel(true)}
              className="flex items-center bg-black/20 hover:bg-black/30 text-white py-2 px-4 rounded-md transition-all"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Dashboard Settings
            </button>
            <button
              onClick={() => setIsCustomizing(false)}
              className="bg-black/20 hover:bg-black/30 text-white py-2 px-4 rounded-md transition-all"
            >
              Cancel
            </button>
            <button
              onClick={saveDashboardConfig}
              className="bg-gradient-primary text-white py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all"
            >
              Save Layout
            </button>
          </div>
        </div>
      )}

      {/* Dashboard content */}
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-2xl font-semibold"
              style={{ color: currentTheme.textColor }}
            >
              Dashboard
            </h1>

            {/* Dashboard customization controls */}
            <div className="flex space-x-2">
              {!isCustomizing && (
                <button
                  className="bg-gradient-primary text-white text-sm py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
                  onClick={() => setIsCustomizing(true)}
                >
                  <svg
                    className="h-4 w-4 mr-2"
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
                  Customize Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Available Widgets Section */}
        {isCustomizing && (
          <WidgetSelector
            activeWidgets={activeWidgets}
            onAddWidget={addWidget}
          />
        )}

        {/* Timeframe selection */}
        <div className="bg-gradient-card backdrop-filter backdrop-blur-md rounded-lg p-3 border border-white/10 my-6 flex justify-center">
          <div className="inline-flex space-x-1 rounded-md p-1 bg-black/10">
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                selectedTimeframe === "day"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setSelectedTimeframe("day")}
            >
              Day
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                selectedTimeframe === "week"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setSelectedTimeframe("week")}
            >
              Week
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                selectedTimeframe === "month"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setSelectedTimeframe("month")}
            >
              Month
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                selectedTimeframe === "year"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setSelectedTimeframe("year")}
            >
              Year
            </button>
          </div>
        </div>

        {/* Widgets grid */}
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
