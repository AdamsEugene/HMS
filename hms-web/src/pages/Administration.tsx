import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  BuildingOffice2Icon,
  UsersIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../utils/cn";
import DecorativePattern from "../components/dashboard/DecorativePattern";
import DashboardBanner from "../components/dashboard/DashboardBanner";
import StatsOverviewCard from "../components/dashboard/StatsOverviewCard";
// Import administration components
import {
  HospitalProfile,
  DepartmentManagement,
  SystemConfiguration,
  MasterDataManagement,
  UserRoleManagement,
  InterdepartmentalCommunication,
} from "../components/administration";
// Import all styles
import "../styles/dashboard.css";
import "../styles/customization.css";
import { useTheme } from "../contexts/ThemeContext";

// Set up responsive grid
const ResponsiveGridLayout = WidthProvider(Responsive);

// Main modules in the Administration section
const administrationModules = [
  {
    id: "hospital-profile",
    name: "Hospital Profile",
    description: "Manage hospital details, accreditations, and certifications",
    icon: BuildingOffice2Icon,
  },
  {
    id: "department-management",
    name: "Department Management",
    description:
      "Define structures, workflows, resources, and KPIs for departments",
    icon: UserGroupIcon,
  },
  {
    id: "system-configuration",
    name: "System Configuration",
    description:
      "Configure department setup, pricing models, and operational hours",
    icon: Cog6ToothIcon,
  },
  {
    id: "master-data",
    name: "Master Data Management",
    description: "Manage diagnostic codes, procedure codes, and formularies",
    icon: DocumentDuplicateIcon,
  },
  {
    id: "user-role-management",
    name: "User Role Management",
    description: "Define user roles, permissions, and access controls",
    icon: UsersIcon,
  },
  {
    id: "interdepartmental",
    name: "Interdepartmental Communication",
    description: "Configure referrals, messaging systems, and shared calendars",
    icon: ArrowsRightLeftIcon,
  },
];

// Layout presets for administration page
const layoutPresets = [
  {
    id: "default",
    name: "Default Layout",
    description: "Standard administration layout with all modules",
    modules: [
      "hospital-profile",
      "department-management",
      "system-configuration",
      "master-data",
      "user-role-management",
      "interdepartmental",
    ],
    statsCards: [
      {
        id: "departments",
        title: "Departments",
        value: "24",
        trend: "+2",
        trendLabel: "from last quarter",
        trendType: "up" as const,
        icon: UserGroupIcon,
      },
      {
        id: "integrations",
        title: "Active Integrations",
        value: "18",
        trend: "+3",
        trendLabel: "from last month",
        trendType: "up" as const,
        icon: ArrowsRightLeftIcon,
      },
      {
        id: "roles",
        title: "User Roles",
        value: "42",
        trend: "0",
        trendLabel: "unchanged",
        trendType: "neutral" as const,
        icon: UsersIcon,
      },
    ],
    layout: {
      lg: [
        { i: "departments", x: 0, y: 0, w: 1, h: 1 },
        { i: "integrations", x: 1, y: 0, w: 1, h: 1 },
        { i: "roles", x: 2, y: 0, w: 1, h: 1 },
      ],
    },
  },
  {
    id: "clinical-focus",
    name: "Clinical Focus",
    description: "Focus on clinical departments and roles",
    modules: [
      "department-management",
      "user-role-management",
      "interdepartmental",
    ],
    statsCards: [
      {
        id: "departments",
        title: "Clinical Departments",
        value: "14",
        trend: "+1",
        trendLabel: "from last quarter",
        trendType: "up" as const,
        icon: UserGroupIcon,
      },
      {
        id: "clinical-staff",
        title: "Clinical Staff",
        value: "342",
        trend: "+12",
        trendLabel: "new hires",
        trendType: "up" as const,
        icon: UsersIcon,
      },
      {
        id: "referrals",
        title: "Referrals",
        value: "187",
        trend: "+23%",
        trendLabel: "monthly increase",
        trendType: "up" as const,
        icon: ArrowsRightLeftIcon,
      },
    ],
    layout: {
      lg: [
        { i: "departments", x: 0, y: 0, w: 1, h: 1 },
        { i: "clinical-staff", x: 1, y: 0, w: 1, h: 1 },
        { i: "referrals", x: 2, y: 0, w: 1, h: 1 },
      ],
    },
  },
  {
    id: "administrative-focus",
    name: "Administrative Focus",
    description: "Focus on hospital administration and configuration",
    modules: ["hospital-profile", "system-configuration", "master-data"],
    statsCards: [
      {
        id: "compliance",
        title: "Compliance Score",
        value: "98%",
        trend: "+2%",
        trendLabel: "from last audit",
        trendType: "up" as const,
        icon: Cog6ToothIcon,
      },
      {
        id: "certifications",
        title: "Active Certifications",
        value: "12",
        trend: "0",
        trendLabel: "unchanged",
        trendType: "neutral" as const,
        icon: BuildingOffice2Icon,
      },
      {
        id: "codes",
        title: "Master Codes",
        value: "1,256",
        trend: "+48",
        trendLabel: "new codes added",
        trendType: "up" as const,
        icon: DocumentDuplicateIcon,
      },
    ],
    layout: {
      lg: [
        { i: "compliance", x: 0, y: 0, w: 1, h: 1 },
        { i: "certifications", x: 1, y: 0, w: 1, h: 1 },
        { i: "codes", x: 2, y: 0, w: 1, h: 1 },
      ],
    },
  },
];

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
const ADMIN_LAYOUT_KEY = "hms-admin-layout";
const ADMIN_USER_LAYOUTS_KEY = "hms-admin-user-layouts";
const ADMIN_LAYOUTS_CONFIG_KEY = "hms-admin-layouts-config";

// Hospital profile data
interface Accreditation {
  id: string;
  name: string;
  issuedBy: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Pending";
}

interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Pending";
}

interface HospitalProfile {
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  establishedYear: string;
  capacity: {
    beds: number;
    operatingRooms: number;
    emergencyRooms: number;
  };
  accreditations: Accreditation[];
  certifications: Certification[];
}

interface StatsCard {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendLabel: string;
  trendType: "up" | "down" | "neutral";
  icon: React.ElementType;
  chartData?: number[];
}

interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  modules: string[];
  statsCards: StatsCard[];
  layout?: { [key: string]: LayoutItem[] };
}

const Administration = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);

  // Customization state
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [activeStatsCards, setActiveStatsCards] = useState<StatsCard[]>([]);
  const [selectedLayout, setSelectedLayout] = useState("default");
  const [userLayouts, setUserLayouts] = useState<LayoutPreset[]>([]);
  const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");

  // Load saved layout from local storage
  useEffect(() => {
    const savedLayout = localStorage.getItem(ADMIN_LAYOUT_KEY);
    if (savedLayout) {
      try {
        const layout = JSON.parse(savedLayout);
        setSelectedLayout(layout.id);
        setActiveModules(layout.modules);
        setActiveStatsCards(layout.statsCards);
      } catch (e) {
        console.error("Failed to parse saved layout", e);
        applyLayoutPreset("default");
      }
    } else {
      applyLayoutPreset("default");
    }

    // Load user-defined layouts
    const savedUserLayouts = localStorage.getItem(ADMIN_USER_LAYOUTS_KEY);
    if (savedUserLayouts) {
      try {
        setUserLayouts(JSON.parse(savedUserLayouts));
      } catch (e) {
        console.error("Failed to parse user layouts", e);
      }
    }

    // Load saved grid layouts
    const savedLayouts = localStorage.getItem(ADMIN_LAYOUTS_CONFIG_KEY);
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
      setActiveModules(preset.modules);
      setActiveStatsCards(preset.statsCards);
      setSelectedLayout(layoutId);

      // Set grid layout if available
      if (preset.layout) {
        // Create responsive layouts if not defined in preset
        const newLayouts: { [key: string]: LayoutItem[] } = {
          ...preset.layout,
        };

        // Add responsive variants if not present
        if (!newLayouts.md) {
          newLayouts.md = (newLayouts.lg || []).map((item) => ({
            ...item,
            x: item.x % 2, // 2 columns on medium
            w: Math.min(item.w, 2),
          }));
        }

        if (!newLayouts.sm) {
          newLayouts.sm = (newLayouts.lg || []).map((item) => ({
            ...item,
            x: 0, // 1 column on small
            w: 1,
          }));
        }

        setLayouts(newLayouts);
      } else {
        // Create default layout based on stats cards
        const newLayouts = {
          lg: preset.statsCards.map((card, index) => ({
            i: card.id,
            x: index % 3,
            y: Math.floor(index / 3),
            w: 1,
            h: 1,
            minW: 1,
            minH: 1,
          })),
          md: preset.statsCards.map((card, index) => ({
            i: card.id,
            x: index % 2,
            y: Math.floor(index / 2),
            w: 1,
            h: 1,
            minW: 1,
            minH: 1,
          })),
          sm: preset.statsCards.map((card, index) => ({
            i: card.id,
            x: 0,
            y: index,
            w: 1,
            h: 1,
            minW: 1,
            minH: 1,
          })),
        };
        setLayouts(newLayouts);
      }

      // If module in activeModules is not in the tabs, set selectedTab to first active module
      if (selectedTab >= preset.modules.length) {
        setSelectedTab(0);
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
    localStorage.setItem(ADMIN_LAYOUTS_CONFIG_KEY, JSON.stringify(allLayouts));
  };

  // Handle breakpoint change
  const handleBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  };

  // Save current layout
  const saveLayout = () => {
    const currentLayout = {
      id: selectedLayout,
      modules: activeModules,
      statsCards: activeStatsCards,
      layout: layouts,
    };

    localStorage.setItem(ADMIN_LAYOUT_KEY, JSON.stringify(currentLayout));
    localStorage.setItem(ADMIN_LAYOUTS_CONFIG_KEY, JSON.stringify(layouts));
    setIsCustomizing(false);
    setShowConfigPanel(false);
  };

  // Add a new stats card
  const addStatsCard = (card: StatsCard) => {
    if (!activeStatsCards.some((c) => c.id === card.id)) {
      // Find position for new card
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
        i: card.id,
        x: 0,
        y: maxY,
        w: 1,
        h: 1,
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
            w: breakpoint === "sm" ? 1 : layoutItem.w,
            x: breakpoint === "sm" ? 0 : layoutItem.x,
          },
        ];
      });

      setLayouts(newLayouts);
      setActiveStatsCards([...activeStatsCards, card]);
    }
  };

  // Save as new layout
  const saveAsNewLayout = (name: string, description: string) => {
    const newLayoutId = `custom-${Date.now()}`;
    const newLayout: LayoutPreset = {
      id: newLayoutId,
      name,
      description,
      modules: activeModules,
      statsCards: activeStatsCards,
      layout: layouts,
    };

    const updatedUserLayouts = [...userLayouts, newLayout];
    setUserLayouts(updatedUserLayouts);
    setSelectedLayout(newLayoutId);

    // Save to local storage
    localStorage.setItem(
      ADMIN_USER_LAYOUTS_KEY,
      JSON.stringify(updatedUserLayouts)
    );
    localStorage.setItem(ADMIN_LAYOUT_KEY, JSON.stringify(newLayout));
    localStorage.setItem(ADMIN_LAYOUTS_CONFIG_KEY, JSON.stringify(layouts));

    setIsCustomizing(false);
    setShowConfigPanel(false);
  };

  // Toggle module visibility
  const toggleModule = (moduleId: string) => {
    if (activeModules.includes(moduleId)) {
      // Remove module
      setActiveModules(activeModules.filter((id) => id !== moduleId));
    } else {
      // Add module
      setActiveModules([...activeModules, moduleId]);
    }
  };

  // Toggle stats card visibility
  const toggleStatsCard = (cardId: string) => {
    const allCards = [...layoutPresets.flatMap((p) => p.statsCards)];
    const cardExists = activeStatsCards.some((card) => card.id === cardId);

    if (cardExists) {
      // Remove card
      setActiveStatsCards(
        activeStatsCards.filter((card) => card.id !== cardId)
      );

      // Remove from layouts
      const newLayouts = { ...layouts };
      Object.keys(newLayouts).forEach((breakpoint) => {
        newLayouts[breakpoint] = newLayouts[breakpoint].filter(
          (item) => item.i !== cardId
        );
      });
      setLayouts(newLayouts);
    } else {
      // Add card
      const cardToAdd = allCards.find((card) => card.id === cardId);
      if (cardToAdd) {
        addStatsCard(cardToAdd);
      }
    }
  };

  // Available modules for display
  const displayModules = administrationModules.filter((module) =>
    activeModules.includes(module.id)
  );

  return (
    <div className="p-0 md:p-6 pt-0 md:pt-0 h-full">
      <DecorativePattern />
      <DashboardBanner
        title="Administration"
        subtitle="Manage hospital configuration, departments, and system settings"
        theme="administration"
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
        {/* Stats Grid */}
        <div
          className={`dashboard-grid ${isCustomizing ? "is-customizing" : ""} mb-8`}
        >
          {activeStatsCards.length > 0 && layouts.lg && (
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
              cols={{ lg: 3, md: 2, sm: 1, xs: 1 }}
              rowHeight={160}
              margin={[16, 16]}
              containerPadding={[0, 0]}
              onLayoutChange={handleLayoutChange}
              onBreakpointChange={handleBreakpointChange}
              isDraggable={isCustomizing}
              isResizable={isCustomizing}
              draggableHandle=".widget-drag-handle"
            >
              {activeStatsCards.map((card) => (
                <div
                  key={card.id}
                  className="card relative overflow-hidden animate-fade-in-up"
                >
                  {isCustomizing && (
                    <>
                      <div className="widget-drag-handle absolute inset-x-0 top-0 h-8 z-10 flex items-center justify-center cursor-move">
                        <div className="w-10 h-1 bg-gray-300/30 rounded-full"></div>
                      </div>
                      <button
                        onClick={() => toggleStatsCard(card.id)}
                        className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 shadow-lg transition-opacity"
                        title="Remove card"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <StatsOverviewCard
                    title={card.title}
                    value={card.value}
                    trend={card.trend}
                    trendLabel={card.trendLabel}
                    trendType={card.trendType}
                    icon={card.icon}
                    chartData={card.chartData || [25, 20, 22, 18, 24]}
                    gradients={gradients}
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          )}

          {isCustomizing && activeStatsCards.length === 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowConfigPanel(true)}
                className="h-32 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:bg-gray-800 text-gray-500 hover:border-primary hover:text-primary transition-colors px-6"
              >
                <div className="flex flex-col items-center">
                  <PlusIcon className="h-8 w-8 mb-2" />
                  <span>Add Stat Cards</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex overflow-x-auto space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 scrollbar-thin">
              {displayModules.map((module) => (
                <Tab
                  key={module.id}
                  className={({ selected }) =>
                    cn(
                      "flex items-center w-full md:w-auto px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      selected
                        ? "bg-white dark:bg-gray-700 text-primary shadow"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white/[0.50] dark:hover:bg-gray-700/[0.50] hover:text-gray-700 dark:hover:text-white"
                    )
                  }
                >
                  <module.icon className="h-5 w-5 mr-2" />
                  {module.name}
                </Tab>
              ))}

              {isCustomizing && (
                <button
                  onClick={() => setShowConfigPanel(true)}
                  className="flex items-center px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Module
                </button>
              )}
            </Tab.List>
            <Tab.Panels className="mt-4">
              {displayModules.map((module) => (
                <Tab.Panel key={module.id} className="p-6 animate-fade-in-up">
                  <div className="flex items-center mb-6">
                    <module.icon className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {module.name}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  {module.id === "hospital-profile" ? (
                    <HospitalProfile />
                  ) : module.id === "department-management" ? (
                    <DepartmentManagement />
                  ) : module.id === "system-configuration" ? (
                    <SystemConfiguration />
                  ) : module.id === "master-data" ? (
                    <MasterDataManagement />
                  ) : module.id === "user-role-management" ? (
                    <UserRoleManagement />
                  ) : module.id === "interdepartmental" ? (
                    <InterdepartmentalCommunication />
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center">
                      <module.icon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        {module.name} Module
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                        This module is currently under development. Check back
                        soon for updates.
                      </p>
                      <button type="button" className="btn-primary">
                        Request Early Access
                      </button>
                    </div>
                  )}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
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
              Administration Page Configuration
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

            {/* Module Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Available Modules
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {administrationModules.map((module) => (
                  <div
                    key={module.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                      activeModules.includes(module.id)
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-black/10 hover:bg-black/20"
                    }`}
                    onClick={() => toggleModule(module.id)}
                  >
                    <module.icon className="h-5 w-5 mr-2" />
                    <span>{module.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Stat Cards
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ...new Map(
                    layoutPresets.flatMap((p) =>
                      p.statsCards.map((card) => [card.id, card])
                    )
                  ).values(),
                ].map((card) => (
                  <div
                    key={card.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                      activeStatsCards.some((c) => c.id === card.id)
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-black/10 hover:bg-black/20"
                    }`}
                    onClick={() => toggleStatsCard(card.id)}
                  >
                    <card.icon className="h-5 w-5 mr-2" />
                    <span>{card.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout Instructions */}
            {isCustomizing && activeStatsCards.length > 0 && (
              <div className="mb-6 p-3 bg-black/10 rounded-md">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Layout Tips
                </h3>
                <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                  <li>Drag the handle at the top of each card to move it</li>
                  <li>Drag the bottom-right corner to resize cards</li>
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

export default Administration;
