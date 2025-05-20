import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  Cog6ToothIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import type {
  SystemConfiguration as SystemConfigurationType,
  GeneralSettings,
  OperationalHours,
  PricingModel,
} from "./types";
import { cn } from "../../utils/cn";
import {
  GeneralSettingsForm,
  OperationalHoursManager,
  PricingModelsManager,
} from "./system-configuration";

// Default configuration data
const defaultConfiguration: SystemConfigurationType = {
  generalSettings: {
    systemName: "MediHub Central",
    defaultLanguage: "English",
    timezone: "UTC-5 (Eastern Time)",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12-hour",
    currency: "USD",
    maintenanceMode: false,
    maintenanceMessage:
      "System is currently under maintenance. Please try again later.",
    enableNotifications: true,
    enableAuditLogs: true,
    sessionTimeout: 30,
    passwordExpiryDays: 90,
    minimumPasswordLength: 8,
  },
  operationalHours: [
    {
      dayOfWeek: "Monday",
      isOpen: true,
      timeSlots: [{ from: "08:00", to: "17:00" }],
    },
    {
      dayOfWeek: "Tuesday",
      isOpen: true,
      timeSlots: [{ from: "08:00", to: "17:00" }],
    },
    {
      dayOfWeek: "Wednesday",
      isOpen: true,
      timeSlots: [{ from: "08:00", to: "17:00" }],
    },
    {
      dayOfWeek: "Thursday",
      isOpen: true,
      timeSlots: [{ from: "08:00", to: "17:00" }],
    },
    {
      dayOfWeek: "Friday",
      isOpen: true,
      timeSlots: [{ from: "08:00", to: "17:00" }],
    },
    {
      dayOfWeek: "Saturday",
      isOpen: true,
      timeSlots: [{ from: "09:00", to: "14:00" }],
    },
    {
      dayOfWeek: "Sunday",
      isOpen: false,
      timeSlots: [],
    },
  ],
  pricingModels: [
    {
      id: "pm-1",
      name: "Standard Rate",
      description: "Default pricing for most patients",
      type: "Standard",
      active: true,
      defaultModel: true,
      appliesTo: ["Inpatient", "Outpatient"],
      effectiveFrom: "2023-01-01",
    },
    {
      id: "pm-2",
      name: "Insurance A",
      description: "Special rates for Insurance Provider A",
      type: "Insurance",
      active: true,
      defaultModel: false,
      appliesTo: ["Inpatient", "Outpatient", "Emergency"],
      effectiveFrom: "2023-01-01",
      markupPercentage: 15,
    },
    {
      id: "pm-3",
      name: "Charity Program",
      description: "Discounted rates for charity cases",
      type: "Discounted",
      active: true,
      defaultModel: false,
      appliesTo: ["Inpatient", "Outpatient", "Procedures"],
      effectiveFrom: "2023-01-01",
      discountPercentage: 30,
    },
  ],
};

const SystemConfiguration = () => {
  // State for system configuration
  const [configuration, setConfiguration] =
    useState<SystemConfigurationType>(defaultConfiguration);

  // Update handlers for each section
  const updateGeneralSettings = (settings: GeneralSettings) => {
    setConfiguration({
      ...configuration,
      generalSettings: settings,
    });
  };

  const updateOperationalHours = (hours: OperationalHours[]) => {
    setConfiguration({
      ...configuration,
      operationalHours: hours,
    });
  };

  const updatePricingModels = (models: PricingModel[]) => {
    setConfiguration({
      ...configuration,
      pricingModels: models,
    });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          System Configuration
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Configure system-wide settings, operational hours, and pricing models.
        </p>
      </div>

      <div className="mt-6">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 dark:bg-gray-800 p-1">
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              <div className="flex items-center justify-center">
                <Cog6ToothIcon className="w-5 h-5 mr-2" />
                General Settings
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              <div className="flex items-center justify-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Operational Hours
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              <div className="flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Pricing Models
              </div>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <GeneralSettingsForm
                settings={configuration.generalSettings}
                updateSettings={updateGeneralSettings}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <OperationalHoursManager
                operationalHours={configuration.operationalHours}
                updateOperationalHours={updateOperationalHours}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <PricingModelsManager
                pricingModels={configuration.pricingModels}
                updatePricingModels={updatePricingModels}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default SystemConfiguration;
