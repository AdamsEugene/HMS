import { useState } from "react";
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
import DashboardBanner from "../components/dashboard/DashboardBanner";
import StatsOverviewCard from "../components/dashboard/StatsOverviewCard";
// Import all styles
import "../styles/dashboard.css";
import "../styles/customization.css";

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

const Administration = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Administrative theme color - using CSS variable instead of hardcoded color
  const adminThemeColor = "var(--color-primary)";

  return (
    <div className="relative container-administrative">
      {/* Background decorative pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DecorativePattern
          type="circles"
          color={adminThemeColor}
          opacity={0.05}
          density="low"
          animate={true}
        />
      </div>

      <div className="relative z-10">
        {/* Use DashboardBanner for consistency */}
        <DashboardBanner
          userName="Administrator"
          hospitalName="Hospital Administration"
        />

        {/* Key Stats for Administration */}
        <StatsOverviewCard
          title="Administration Overview"
          patternType="waves"
          className="mb-6"
          stats={[
            {
              label: "Total Departments",
              value: "24",
              change: {
                value: "2",
                isIncrease: true,
              },
              icon: <UserGroupIcon className="h-5 w-5" />,
            },
            {
              label: "Active Users",
              value: "512",
              change: {
                value: "5%",
                isIncrease: true,
              },
              icon: <UsersIcon className="h-5 w-5" />,
            },
            {
              label: "System Updates",
              value: "3",
              change: {
                value: "",
                isIncrease: false,
              },
              icon: <Cog6ToothIcon className="h-5 w-5" />,
            },
            {
              label: "Configuration Changes",
              value: "128",
              change: {
                value: "12%",
                isIncrease: true,
              },
              icon: <DocumentDuplicateIcon className="h-5 w-5" />,
            },
          ]}
        />

        {/* Administration Modules */}
        <div className="card bg-gradient-card backdrop-filter backdrop-blur-md mb-6 overflow-hidden shadow-lg">
          <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
            <div className="bg-gradient-primary p-4">
              <Tab.List className="flex flex-wrap gap-2">
                {administrationModules.map((module) => (
                  <Tab
                    key={module.id}
                    className={({ selected }) =>
                      cn(
                        "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-all",
                        "focus:outline-none whitespace-nowrap",
                        selected
                          ? "bg-gradient-button text-white shadow-md"
                          : "bg-white bg-opacity-10 text-white hover:bg-opacity-20 hover:text-white"
                      )
                    }
                  >
                    <module.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{module.name}</span>
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="bg-white dark:bg-gray-800 custom-scrollbar">
              {administrationModules.map((module) => (
                <Tab.Panel key={module.id} className="p-6 animate-fade-in-up">
                  <div className="p-4 mb-6 rounded-lg bg-gradient-card backdrop-filter backdrop-blur-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                      <module.icon className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                      {module.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {module.description}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-4">
                      {module.id.replace(/-/g, " ")} Module
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      This module is currently under development. Implementation
                      coming soon.
                    </p>

                    <div className="mt-12 p-8 flex justify-center items-center">
                      <div className="w-12 h-12 text-primary opacity-50 animate-pulse">
                        <module.icon className="w-full h-full" />
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recent Changes
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>No recent configuration changes to display.</p>
            </div>
          </div>
          <div className="card bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              System Status
            </h3>
            <div className="flex items-center text-sm">
              <span className="h-3 w-3 bg-success rounded-full mr-2"></span>
              <span className="text-gray-600 dark:text-gray-300">
                All systems operational
              </span>
            </div>
          </div>
          <div className="card bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Actions
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <button className="text-left text-primary hover:underline">
                System-wide Announcement
              </button>
              <button className="text-left text-primary hover:underline">
                Backup Configuration
              </button>
              <button className="text-left text-primary hover:underline">
                View Audit Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
