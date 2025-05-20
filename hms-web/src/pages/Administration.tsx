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

const Administration = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);

  return (
    <div className="p-0 md:p-6 pt-0 md:pt-0 h-full">
      <DecorativePattern />
      <DashboardBanner
        title="Administration"
        subtitle="Manage hospital configuration, departments, and system settings"
        theme="administration"
      />

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsOverviewCard
            title="Departments"
            value="24"
            trend="+2"
            trendLabel="from last quarter"
            trendType="up"
            icon={UserGroupIcon}
            chartData={[25, 20, 22, 18, 24]}
            gradients={gradients}
          />
          <StatsOverviewCard
            title="Active Integrations"
            value="18"
            trend="+3"
            trendLabel="from last month"
            trendType="up"
            icon={ArrowsRightLeftIcon}
            chartData={[12, 15, 10, 18, 18]}
            gradients={gradients}
          />
          <StatsOverviewCard
            title="User Roles"
            value="42"
            trend="0"
            trendLabel="unchanged"
            trendType="neutral"
            icon={UsersIcon}
            chartData={[42, 38, 40, 42, 42]}
            gradients={gradients}
          />
        </div>

        <div className="mb-8">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex overflow-x-auto space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 scrollbar-thin">
              {administrationModules.map((module) => (
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
            </Tab.List>
            <Tab.Panels className="mt-4">
              {administrationModules.map((module) => (
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
    </div>
  );
};

export default Administration;
