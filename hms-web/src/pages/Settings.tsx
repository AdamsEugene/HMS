import { useState, useEffect, useRef } from "react";
import { Tab } from "@headlessui/react";
import { cn } from "../utils/cn";
import { useTheme } from "../contexts/ThemeContext";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Layout configurations
const availableLayouts = [
  {
    id: "default",
    name: "Standard Layout",
    description: "Traditional layout with sidebar navigation and header",
    image: "https://placehold.co/300x200/3B82F6/FFFFFF?text=Standard+Layout",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: true,
  },
  {
    id: "compact",
    name: "Compact Navigation",
    description: "Minimized navigation with icon-only sidebar",
    image: "https://placehold.co/300x200/10B981/FFFFFF?text=Compact+Layout",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-3 md:p-4",
    sidebarPosition: "left",
    sidebarCompact: true,
    headerEnabled: true,
  },
  {
    id: "clinical",
    name: "Clinical Focus",
    description:
      "Optimized for clinical workflows with prominent patient information",
    image: "https://placehold.co/300x200/8B5CF6/FFFFFF?text=Clinical+Layout",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: true,
    themeColor: "#10B981", // green
  },
  {
    id: "administrative",
    name: "Administrative View",
    description: "Focused on administrative and management tasks",
    image: "https://placehold.co/300x200/EF4444/FFFFFF?text=Admin+Layout",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: true,
    themeColor: "#8B5CF6", // purple
  },
  {
    id: "focused",
    name: "Focused Mode",
    description: "Distraction-free layout for concentrated work",
    image: "https://placehold.co/300x200/000000/FFFFFF?text=Focused+Layout",
    contentClass: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6",
    sidebarPosition: "left",
    headerEnabled: false,
    fullWidth: true,
  },
];

// Dashboard layout presets
const dashboardPresets = [
  {
    id: "clinical",
    name: "Clinical Focus",
    description: "Emphasizes patient care metrics",
    image: "https://placehold.co/300x200/10B981/FFFFFF?text=Clinical+Dashboard",
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
    image: "https://placehold.co/300x200/8B5CF6/FFFFFF?text=Admin+Dashboard",
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
    image: "https://placehold.co/300x200/3B82F6/FFFFFF?text=Full+Dashboard",
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

// Organizations with more customization options
const organizations = [
  {
    id: 1,
    name: "General Hospital",
    logo: "https://placehold.co/100x40/3B82F6/FFFFFF?text=GH",
    color: "#3B82F6",
    description: "Multi-specialty general hospital with comprehensive services",
    address: "123 Medical Plaza, Healthcare City, HC 12345",
    phone: "(555) 123-4567",
    email: "info@generalhospital.org",
    website: "www.generalhospital.org",
    established: "1985",
    tagline: "Excellence in patient care",
  },
  {
    id: 2,
    name: "Children's Medical Center",
    logo: "https://placehold.co/100x40/10B981/FFFFFF?text=CMC",
    color: "#10B981",
    description:
      "Specialized pediatric care facility focused on children's health",
    address: "456 Pediatric Avenue, Children's District, CD 67890",
    phone: "(555) 234-5678",
    email: "care@childrensmedical.org",
    website: "www.childrensmedical.org",
    established: "1992",
    tagline: "Healing little heroes every day",
  },
  {
    id: 3,
    name: "University Health System",
    logo: "https://placehold.co/100x40/8B5CF6/FFFFFF?text=UHS",
    color: "#8B5CF6",
    description:
      "Academic medical center with research and teaching facilities",
    address: "789 Academic Boulevard, University Park, UP 54321",
    phone: "(555) 345-6789",
    email: "contact@universityhealth.edu",
    website: "www.universityhealth.edu",
    established: "1967",
    tagline: "Advancing medicine through research and education",
  },
];

const Settings = () => {
  // Use theme hook instead of local theme state
  const {
    currentTheme,
    setTheme,
    availableThemes,
    highContrastMode,
    toggleHighContrastMode,
    getCardStyle,
  } = useTheme();

  // User preferences (would be loaded from API in real app)
  const [selectedLayout, setSelectedLayout] = useState(availableLayouts[0].id);
  const [selectedDashboard, setSelectedDashboard] = useState(
    dashboardPresets[2].id
  );
  const [selectedOrganization, setSelectedOrganization] = useState(
    organizations[0].id
  );

  // More detailed preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [fontSize, setFontSize] = useState("medium");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Add state for customizing organization
  const [customOrg, setCustomOrg] = useState(organizations[0]);
  const [editingField, setEditingField] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved preferences including custom organization data
  useEffect(() => {
    // In a real app, this would fetch from an API
    const loadUserPreferences = () => {
      const savedLayout = localStorage.getItem("preferredLayout") || "default";
      const savedDashboard =
        localStorage.getItem("preferredDashboard") || "comprehensive";
      const savedOrgId = parseInt(
        localStorage.getItem("selectedOrganization") || "1"
      );

      // Load custom organization if available
      const savedCustomOrg = localStorage.getItem("customOrganization");
      let orgToUse =
        organizations.find((o) => o.id === savedOrgId) || organizations[0];

      if (savedCustomOrg) {
        try {
          const parsedOrg = JSON.parse(savedCustomOrg);
          if (parsedOrg && parsedOrg.id === savedOrgId) {
            orgToUse = parsedOrg;
          }
        } catch (e) {
          console.error("Error parsing saved organization data", e);
        }
      }

      setCustomOrg(orgToUse);
      setSelectedOrganization(savedOrgId);

      // More detailed settings
      const savedNotifications =
        localStorage.getItem("notificationsEnabled") !== "false";
      const savedAutoSave = localStorage.getItem("autoSaveEnabled") !== "false";
      const savedFontSize = localStorage.getItem("fontSize") || "medium";
      const savedAnimations =
        localStorage.getItem("animationsEnabled") !== "false";

      // Set states
      setSelectedLayout(savedLayout);
      setSelectedDashboard(savedDashboard);

      setNotificationsEnabled(savedNotifications);
      setAutoSaveEnabled(savedAutoSave);
      setFontSize(savedFontSize);
      setAnimationsEnabled(savedAnimations);
    };

    loadUserPreferences();
  }, []);

  // Save preferences when they change
  const savePreferences = () => {
    // Save layout and dashboard preferences
    localStorage.setItem("preferredLayout", selectedLayout);
    localStorage.setItem("preferredDashboard", selectedDashboard);
    localStorage.setItem(
      "selectedOrganization",
      selectedOrganization.toString()
    );

    // Save custom organization data
    localStorage.setItem("customOrganization", JSON.stringify(customOrg));

    // Save detailed settings
    localStorage.setItem(
      "notificationsEnabled",
      notificationsEnabled.toString()
    );
    localStorage.setItem("autoSaveEnabled", autoSaveEnabled.toString());
    localStorage.setItem("highContrastMode", highContrastMode.toString());
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("animationsEnabled", animationsEnabled.toString());

    // Show success message
    alert(
      "Your preferences have been saved. Some changes will take effect after page reload."
    );
  };

  // Apply font size
  useEffect(() => {
    const fontSizeMap: Record<string, string> = {
      small: "0.875rem",
      medium: "1rem",
      large: "1.125rem",
      "x-large": "1.25rem",
    };

    document.documentElement.style.setProperty(
      "--font-size-base",
      fontSizeMap[fontSize] || "1rem"
    );
  }, [fontSize]);

  // Apply animations setting
  useEffect(() => {
    if (!animationsEnabled) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [animationsEnabled]);

  // Handle organization selection
  const handleOrganizationSelect = (orgId: number) => {
    setSelectedOrganization(orgId);
    const selectedOrg = organizations.find((org) => org.id === orgId);
    if (selectedOrg) {
      setCustomOrg(selectedOrg);
    }
  };

  // Handle field editing
  const handleFieldEdit = (field: string, value: string) => {
    setCustomOrg((prev) => ({ ...prev, [field]: value }));
    setEditingField("");
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomOrg((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ color: currentTheme.textColor }}
        >
          Settings
        </h1>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              Appearance
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              Dashboard
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              Organization
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              Accessibility
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* Appearance Panel */}
            <Tab.Panel>
              <div className="space-y-8">
                {/* Theme Selection */}
                <div className="theme-selection mt-6">
                  <h3 className="text-lg font-medium mb-4">Theme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {availableThemes.map((theme) => (
                      <div
                        key={theme.name}
                        className={cn(
                          "theme-option relative rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md",
                          currentTheme.name === theme.name &&
                            "ring-2 ring-primary"
                        )}
                        onClick={() => setTheme(theme)}
                      >
                        <div
                          className={cn(
                            "h-40 p-4 flex flex-col justify-between",
                            theme.isDark
                              ? "main-gradient-dark"
                              : "main-gradient-light"
                          )}
                          style={{
                            background: `linear-gradient(135deg, ${theme.color}20 0%, ${theme.color}05 100%)`,
                            color: theme.isDark
                              ? "#fff"
                              : theme.textColor || "#111827",
                          }}
                        >
                          <div className="flex justify-between">
                            <div className="flex flex-col">
                              <span className="font-medium">{theme.name}</span>
                              <span className="text-xs mt-1">
                                {theme.isDark ? "Dark Mode" : "Light Mode"}
                              </span>
                            </div>
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: theme.color }}
                            ></div>
                          </div>

                          <div
                            className="theme-preview mt-auto bg-gradient-card p-3 rounded"
                            style={{
                              background: theme.isDark
                                ? `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03))`
                                : `linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))`,
                              backdropFilter: "blur(4px)",
                              WebkitBackdropFilter: "blur(4px)",
                            }}
                          >
                            <div className="text-xs font-medium mb-1">
                              Sample Card
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-xs opacity-80">Value</div>
                              <div className="text-xs">
                                {theme.isDark ? "10.2K" : "10.2K"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layout Selection */}
                <div
                  style={{
                    ...getCardStyle(),
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <h2
                    className="text-lg font-medium mb-4"
                    style={{ color: currentTheme.textColor }}
                  >
                    Select Layout
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableLayouts.map((layout) => (
                      <div
                        key={layout.id}
                        className={cn(
                          "rounded-lg border-2 overflow-hidden transition-all",
                          selectedLayout === layout.id
                            ? "border-primary shadow-md"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                      >
                        <img
                          src={layout.image}
                          alt={layout.name}
                          className="w-full h-40 object-cover"
                        />
                        <div
                          className="p-4"
                          style={{
                            backgroundColor: currentTheme.cardColor,
                            color: currentTheme.textColor,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{layout.name}</h3>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="layout"
                                checked={selectedLayout === layout.id}
                                onChange={() => setSelectedLayout(layout.id)}
                                className="form-radio text-primary"
                                aria-label={`Select ${layout.name} layout`}
                              />
                            </label>
                          </div>
                          <p
                            className="text-sm mt-1"
                            style={{ color: currentTheme.textColorSecondary }}
                          >
                            {layout.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Appearance Settings */}
                <div
                  style={{
                    ...getCardStyle(),
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <h2
                    className="text-lg font-medium mb-4"
                    style={{ color: currentTheme.textColor }}
                  >
                    Additional Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: currentTheme.textColor }}
                        >
                          Animations
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: currentTheme.textColorSecondary }}
                        >
                          Enable animations and transitions
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={animationsEnabled}
                          onChange={(e) =>
                            setAnimationsEnabled(e.target.checked)
                          }
                          className="sr-only peer"
                          aria-label="Toggle animations"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: currentTheme.textColor }}
                        >
                          Auto-save Settings
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: currentTheme.textColorSecondary }}
                        >
                          Automatically save changes to preferences
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSaveEnabled}
                          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                          className="sr-only peer"
                          aria-label="Toggle auto-save"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Dashboard Panel */}
            <Tab.Panel>
              <div className="space-y-8">
                <div
                  style={{
                    ...getCardStyle(),
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <h2
                    className="text-lg font-medium mb-4"
                    style={{ color: currentTheme.textColor }}
                  >
                    Dashboard Layout
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className={cn(
                          "rounded-lg border-2 overflow-hidden transition-all",
                          selectedDashboard === preset.id
                            ? "border-primary shadow-md"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                      >
                        <img
                          src={preset.image}
                          alt={preset.name}
                          className="w-full h-40 object-cover"
                        />
                        <div
                          className="p-4"
                          style={{
                            backgroundColor: currentTheme.cardColor,
                            color: currentTheme.textColor,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{preset.name}</h3>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="dashboard"
                                checked={selectedDashboard === preset.id}
                                onChange={() => setSelectedDashboard(preset.id)}
                                className="form-radio text-primary"
                              />
                            </label>
                          </div>
                          <p
                            className="text-sm mt-1"
                            style={{ color: currentTheme.textColorSecondary }}
                          >
                            {preset.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    ...getCardStyle(),
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <h2
                    className="text-lg font-medium mb-4"
                    style={{ color: currentTheme.textColor }}
                  >
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: currentTheme.textColor }}
                        >
                          Enable Notifications
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: currentTheme.textColorSecondary }}
                        >
                          Show system notifications and alerts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={(e) =>
                            setNotificationsEnabled(e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Organization Panel - Enhanced */}
            <Tab.Panel>
              <div className="space-y-8">
                <div
                  style={{
                    ...getCardStyle(),
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <h2
                    className="text-lg font-medium mb-6"
                    style={{ color: currentTheme.textColor }}
                  >
                    Organization Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {organizations.map((org) => (
                      <div
                        key={org.id}
                        className={cn(
                          "rounded-lg border-2 overflow-hidden transition-all p-6",
                          selectedOrganization === org.id
                            ? "border-primary shadow-md"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <img src={org.logo} alt={org.name} className="h-10" />
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="organization"
                              checked={selectedOrganization === org.id}
                              onChange={() => handleOrganizationSelect(org.id)}
                              className="form-radio text-primary"
                            />
                          </label>
                        </div>
                        <h3 className="font-medium text-lg">{org.name}</h3>
                        <div
                          className="w-full h-1 my-2 rounded-full"
                          style={{ backgroundColor: org.color }}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {org.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Custom organization settings */}
                  <div className="border-t pt-6 mt-8">
                    <h3 className="text-lg font-medium mb-4">
                      Customize Organization
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      Personalize your organization branding and information
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {/* Logo section */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Organization Logo
                        </label>
                        <div className="flex items-start">
                          <img
                            src={customOrg?.logo}
                            alt={customOrg?.name}
                            className="h-16 border rounded p-2 mb-2 bg-white"
                          />
                          <div className="ml-4">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleLogoUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1 bg-primary text-white rounded-md text-sm flex items-center"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" /> Change
                              Logo
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                              Recommended size: 200x80px
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Color picker */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Brand Color
                        </label>
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-md mr-3"
                            style={{ backgroundColor: customOrg?.color }}
                          />
                          <input
                            type="color"
                            value={customOrg?.color || "#3B82F6"}
                            onChange={(e) =>
                              setCustomOrg((prev) => ({
                                ...prev,
                                color: e.target.value,
                              }))
                            }
                            className="h-8 w-16 p-0 border-0"
                          />
                          <span className="ml-3 text-sm">
                            {customOrg?.color}
                          </span>
                        </div>
                      </div>

                      {/* Organization fields */}
                      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Organization name */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Organization Name
                          </label>
                          {editingField === "name" ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={customOrg?.name || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleFieldEdit("name", customOrg?.name || "")
                                }
                                className="text-primary ml-2"
                                aria-label="Save organization name"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingField("")}
                                className="text-gray-500 ml-1"
                                aria-label="Cancel editing"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span>{customOrg?.name}</span>
                              <button
                                onClick={() => setEditingField("name")}
                                className="text-gray-500 hover:text-primary"
                                aria-label="Edit organization name"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Tagline */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Tagline
                          </label>
                          {editingField === "tagline" ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={customOrg?.tagline || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    tagline: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleFieldEdit(
                                    "tagline",
                                    customOrg?.tagline || ""
                                  )
                                }
                                className="text-primary ml-2"
                                aria-label="Save tagline"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingField("")}
                                className="text-gray-500 ml-1"
                                aria-label="Cancel editing"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span>{customOrg?.tagline}</span>
                              <button
                                onClick={() => setEditingField("tagline")}
                                className="text-gray-500 hover:text-primary"
                                aria-label="Edit tagline"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          {editingField === "description" ? (
                            <div className="flex items-start">
                              <textarea
                                value={customOrg?.description || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex flex-col ml-2">
                                <button
                                  onClick={() =>
                                    handleFieldEdit(
                                      "description",
                                      customOrg?.description || ""
                                    )
                                  }
                                  className="text-primary mb-1"
                                  aria-label="Save description"
                                >
                                  <CheckIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setEditingField("")}
                                  className="text-gray-500"
                                  aria-label="Cancel editing"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between p-2 border rounded">
                              <span>{customOrg?.description}</span>
                              <button
                                onClick={() => setEditingField("description")}
                                className="text-gray-500 hover:text-primary ml-2 flex-shrink-0"
                                aria-label="Edit description"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Address */}
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Address
                          </label>
                          {editingField === "address" ? (
                            <div className="flex items-start">
                              <textarea
                                value={customOrg?.address || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    address: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                rows={2}
                                autoFocus
                              />
                              <div className="flex flex-col ml-2">
                                <button
                                  onClick={() =>
                                    handleFieldEdit(
                                      "address",
                                      customOrg?.address || ""
                                    )
                                  }
                                  className="text-primary mb-1"
                                  aria-label="Save address"
                                >
                                  <CheckIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setEditingField("")}
                                  className="text-gray-500"
                                  aria-label="Cancel editing"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between p-2 border rounded">
                              <span>{customOrg?.address}</span>
                              <button
                                onClick={() => setEditingField("address")}
                                className="text-gray-500 hover:text-primary ml-2 flex-shrink-0"
                                aria-label="Edit address"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Contact information */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone
                          </label>
                          {editingField === "phone" ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={customOrg?.phone || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleFieldEdit(
                                    "phone",
                                    customOrg?.phone || ""
                                  )
                                }
                                className="text-primary ml-2"
                                aria-label="Save phone"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingField("")}
                                className="text-gray-500 ml-1"
                                aria-label="Cancel editing"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span>{customOrg?.phone}</span>
                              <button
                                onClick={() => setEditingField("phone")}
                                className="text-gray-500 hover:text-primary"
                                aria-label="Edit phone"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          {editingField === "email" ? (
                            <div className="flex items-center">
                              <input
                                type="email"
                                value={customOrg?.email || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleFieldEdit(
                                    "email",
                                    customOrg?.email || ""
                                  )
                                }
                                className="text-primary ml-2"
                                aria-label="Save email"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingField("")}
                                className="text-gray-500 ml-1"
                                aria-label="Cancel editing"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span>{customOrg?.email}</span>
                              <button
                                onClick={() => setEditingField("email")}
                                className="text-gray-500 hover:text-primary"
                                aria-label="Edit email"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Website
                          </label>
                          {editingField === "website" ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={customOrg?.website || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    website: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleFieldEdit(
                                    "website",
                                    customOrg?.website || ""
                                  )
                                }
                                className="text-primary ml-2"
                                aria-label="Save website"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingField("")}
                                className="text-gray-500 ml-1"
                                aria-label="Cancel editing"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span>{customOrg?.website}</span>
                              <button
                                onClick={() => setEditingField("website")}
                                className="text-gray-500 hover:text-primary"
                                aria-label="Edit website"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Year Established
                          </label>
                          {editingField === "established" ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={customOrg?.established || ""}
                                onChange={(e) =>
                                  setCustomOrg((prev) => ({
                                    ...prev,
                                    established: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded"
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleFieldEdit(
                                    "established",
                                    customOrg?.established || ""
                                  )
                                }
                                className="text-primary ml-2"
                                aria-label="Save year established"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingField("")}
                                className="text-gray-500 ml-1"
                                aria-label="Cancel editing"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span>{customOrg?.established}</span>
                              <button
                                onClick={() => setEditingField("established")}
                                className="text-gray-500 hover:text-primary"
                                aria-label="Edit year established"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={savePreferences}
                      className="px-4 py-2 bg-primary text-white rounded-md"
                    >
                      Save Organization Settings
                    </button>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Accessibility Panel */}
            <Tab.Panel>
              <div className="space-y-8">
                <div
                  style={{
                    ...getCardStyle(),
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <h2
                    className="text-lg font-medium mb-4"
                    style={{ color: currentTheme.textColor }}
                  >
                    Accessibility Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: currentTheme.textColor }}
                        >
                          High Contrast Mode
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: currentTheme.textColorSecondary }}
                        >
                          Increase contrast for better readability
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={highContrastMode}
                          onChange={(e) =>
                            toggleHighContrastMode(e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3
                            className="font-medium"
                            style={{ color: currentTheme.textColor }}
                          >
                            Font Size
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: currentTheme.textColorSecondary }}
                          >
                            Adjust text size for better readability
                          </p>
                        </div>
                        <div className="w-1/3">
                          <select
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            className="form-select block w-full"
                            aria-label="Select font size"
                            title="Font size selection"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="x-large">Extra Large</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: currentTheme.textColor }}
                        >
                          Reduce Animations
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: currentTheme.textColorSecondary }}
                        >
                          Disable animations for reduced motion sensitivity
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!animationsEnabled}
                          onChange={(e) =>
                            setAnimationsEnabled(!e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            className="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Reset to Defaults
          </button>
          <button
            type="button"
            onClick={savePreferences}
            className="btn btn-primary"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
