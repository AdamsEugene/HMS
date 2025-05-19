import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Tab } from "@headlessui/react";
import {
  BuildingOffice2Icon,
  UsersIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../utils/cn";
import DecorativePattern from "../components/dashboard/DecorativePattern";

// Main modules in the Administration section
const administrationModules = [
  {
    id: "hospital-profile",
    name: "Hospital Profile",
    description: "Manage hospital details, accreditations, and certifications",
    icon: BuildingOffice2Icon,
  },
  {
    id: "departments",
    name: "Department Management",
    description:
      "Define structures, workflows, resources, and KPIs for departments",
    icon: UserGroupIcon,
  },
  {
    id: "system-config",
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
    id: "user-roles",
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

const Administration = () => {
  const { currentTheme, getGradientBackground } = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  // Administrative theme color
  const adminThemeColor = "#8B5CF6"; // purple for administrative theme

  // Placeholder for actual content
  const renderModuleContent = (moduleId: string) => {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            {moduleId} Module
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            This module is currently under development. Implementation coming
            soon.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Hero section with background pattern */}
      <div
        className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md mb-6"
        style={{
          background: getGradientBackground({
            ...currentTheme,
            color: adminThemeColor,
          }).content,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <DecorativePattern
            type="dots"
            color={adminThemeColor}
            opacity={0.5}
          />
        </div>
        <div className="relative p-6 sm:px-8 sm:py-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Hospital Administration
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl">
            Configure and manage hospital settings, departments, and system-wide
            parameters. Centralized control for hospital operations and
            administrative functions.
          </p>
        </div>
      </div>

      {/* Administration Modules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
          <Tab.List className="flex space-x-1 rounded-t-lg bg-indigo-50 dark:bg-gray-700 p-1 overflow-x-auto">
            {administrationModules.map((module) => (
              <Tab
                key={module.id}
                className={({ selected }) =>
                  cn(
                    "w-full py-3 px-4 text-sm leading-5 font-medium rounded-md flex items-center gap-2",
                    "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60 whitespace-nowrap",
                    selected
                      ? "bg-white dark:bg-gray-800 shadow text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white/[0.25] dark:hover:bg-gray-700/[0.5] hover:text-indigo-600 dark:hover:text-indigo-400"
                  )
                }
              >
                <module.icon className="h-5 w-5" />
                <span>{module.name}</span>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-3 sm:p-6">
            {administrationModules.map((module) => (
              <Tab.Panel key={module.id}>
                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-md mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex gap-2 items-center">
                    <module.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    {module.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {module.description}
                  </p>
                </div>

                {renderModuleContent(module.id)}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recent Changes
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>No recent configuration changes to display.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            System Status
          </h3>
          <div className="flex items-center text-sm">
            <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-600 dark:text-gray-300">
              All systems operational
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Actions
          </h3>
          <div className="flex flex-col space-y-2 text-sm">
            <button className="text-left text-indigo-600 dark:text-indigo-400 hover:underline">
              System-wide Announcement
            </button>
            <button className="text-left text-indigo-600 dark:text-indigo-400 hover:underline">
              Backup Configuration
            </button>
            <button className="text-left text-indigo-600 dark:text-indigo-400 hover:underline">
              View Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
