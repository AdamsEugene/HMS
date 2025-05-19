import { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { cn } from "../utils/cn";
import { useTheme } from "../contexts/ThemeContext";

// Layout configurations
const availableLayouts = [
  {
    id: "default",
    name: "Standard Layout",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: true,
    sidebarCompact: false,
    sidebarCollapsed: false,
    fullWidth: true,
  },
  {
    id: "compact",
    name: "Compact Navigation",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-3 md:p-4",
    sidebarPosition: "left",
    sidebarCompact: true,
    headerEnabled: true,
  },
  {
    id: "clinical",
    name: "Clinical Focus",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: true,
    themeColor: "#10B981", // green
  },
  {
    id: "administrative",
    name: "Administrative View",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: true,
    themeColor: "#8B5CF6", // purple
  },
  {
    id: "focused",
    name: "Focused Mode",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: false,
    fullWidth: true,
  },
];

// Available organizations for demo
const organizations = [
  {
    id: 1,
    name: "General Hospital",
    logo: "https://placehold.co/100x40/3B82F6/FFFFFF?text=GH",
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "Children's Medical Center",
    logo: "https://placehold.co/100x40/10B981/FFFFFF?text=CMC",
    color: "#10B981",
  },
  {
    id: 3,
    name: "University Health System",
    logo: "https://placehold.co/100x40/8B5CF6/FFFFFF?text=UHS",
    color: "#8B5CF6",
  },
];

// Function to get organization data from localStorage or fallback to default
const getSelectedOrganization = () => {
  const savedOrgId = parseInt(
    localStorage.getItem("selectedOrganization") || "1"
  );
  const savedCustomOrg = localStorage.getItem("customOrganization");

  // Look for saved custom organization data
  if (savedCustomOrg) {
    try {
      const parsedOrg = JSON.parse(savedCustomOrg);
      if (parsedOrg && parsedOrg.id === savedOrgId) {
        return parsedOrg;
      }
    } catch (e) {
      console.error("Error parsing saved organization data", e);
    }
  }

  // Fall back to default organization data
  return organizations.find((org) => org.id === savedOrgId) || organizations[0];
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { currentTheme, getGradientBackground } = useTheme();

  // User preferences (would be loaded from a user settings API in a real app)
  const [currentLayout, setCurrentLayout] = useState(availableLayouts[0]);
  const [selectedOrganization, setSelectedOrganization] = useState(
    getSelectedOrganization()
  );

  // Use useMemo to prevent the theme object from changing on every render
  const currentThemeMemo = useMemo(
    () => ({
      color: selectedOrganization.color || "#3B82F6",
      isDark: false,
    }),
    [selectedOrganization.color]
  );

  // Simulating loading user preferences
  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    const loadUserPreferences = () => {
      const savedLayoutId = localStorage.getItem("preferredLayout");

      // Updated to use the getSelectedOrganization helper
      const org = getSelectedOrganization();
      setSelectedOrganization(org);

      if (savedLayoutId) {
        const layout = availableLayouts.find((l) => l.id === savedLayoutId);
        if (layout) setCurrentLayout(layout);
      }
    };

    loadUserPreferences();

    // Add event listener to detect organization changes from Settings page
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "customOrganization" || e.key === "selectedOrganization") {
        setSelectedOrganization(getSelectedOrganization());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem("preferredLayout", currentLayout.id);
  }, [currentLayout]);

  useEffect(() => {
    localStorage.setItem(
      "selectedOrganization",
      selectedOrganization.id.toString()
    );
  }, [selectedOrganization]);

  useEffect(() => {
    localStorage.setItem("selectedTheme", JSON.stringify(currentThemeMemo));
  }, [currentThemeMemo]);

  // Extract the current page name from the location
  const currentPath = location.pathname;
  const getPageTitle = () => {
    if (currentPath === "/") return "Dashboard";
    const lastSegment = currentPath.split("/").filter(Boolean).pop();
    return lastSegment
      ? lastSegment.charAt(0).toUpperCase() +
          lastSegment.slice(1).replace(/-/g, " ")
      : "";
  };

  // These functions are commented out to resolve linting issues
  // They would be used in a real app
  /*
  // Handle layout change
  const changeLayout = (layoutId: string) => {
    const newLayout = availableLayouts.find((l) => l.id === layoutId);
    if (newLayout) setCurrentLayout(newLayout);
  };

  // Handle organization change
  const changeOrganization = (orgId: number) => {
    const org = organizations.find((o) => o.id === orgId);
    if (org) setSelectedOrganization(org);
  };

  // Handle theme change
  const changeTheme = (theme: { color: string; isDark: boolean }) => {
    setCurrentTheme(theme);
  };
  */

  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden",
        currentTheme.isDark
          ? "main-gradient-dark text-white"
          : "main-gradient-light text-gray-900"
      )}
      style={{
        background: getGradientBackground(currentTheme).primary,
      }}
    >
      {/* Sidebar - conditionally rendered based on layout */}
      {currentLayout.sidebarPosition !== "none" && (
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          compact={currentLayout.sidebarCompact || sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          // Pass organization data to sidebar
          organization={{
            ...selectedOrganization,
            // Use the theme color if specified in the layout, otherwise use the organization color
            color: currentLayout.themeColor || selectedOrganization.color,
          }}
        />
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden",
          currentLayout.sidebarPosition !== "none"
            ? sidebarCollapsed
              ? "lg:ml-20 transition-all duration-300"
              : "lg:ml-64 transition-all duration-300"
            : ""
        )}
      >
        {/* Header - conditionally rendered based on layout */}
        {currentLayout.headerEnabled && (
          <Header
            setSidebarOpen={setSidebarOpen}
            title={getPageTitle()}
            showSearch={true}
            showDateInfo={true}
            showNotifications={true}
            themeColor={currentLayout.themeColor || currentTheme.color}
            organizationName={selectedOrganization.name}
            organizationLogo={selectedOrganization.logo}
            organizationTagline={selectedOrganization.tagline}
            actions={
              // Example actions that could be passed from specific pages
              currentPath === "/" ? (
                <div className="flex space-x-2">
                  <button className="btn bg-primary text-white text-sm">
                    New Admission
                  </button>
                </div>
              ) : undefined
            }
          />
        )}

        {/* Page Content */}
        <main
          className={cn(
            currentLayout.contentClass,
            currentLayout.fullWidth ? "max-w-full" : "max-w-7xl mx-auto"
          )}
        >
          <Outlet />
        </main>
      </div>

      {/* Layout Switcher - this would typically be in a settings panel */}
      {/* Commenting out for now, will be enabled in future updates
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-50">
        <div className="flex flex-col space-y-2">
          <select
            className="form-select py-1 text-sm"
            aria-label="Layout Selector"
            value={currentLayout.id}
            onChange={(e) => changeLayout(e.target.value)}
          >
            {availableLayouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      */}
    </div>
  );
};

export default MainLayout;
