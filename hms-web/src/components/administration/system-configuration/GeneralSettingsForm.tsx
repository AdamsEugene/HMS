import { useState } from "react";
import type { GeneralSettings } from "../types";
import {
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface GeneralSettingsFormProps {
  settings: GeneralSettings;
  updateSettings: (settings: GeneralSettings) => void;
}

const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({
  settings,
  updateSettings,
}) => {
  const [formData, setFormData] = useState<GeneralSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Handle different input types
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);

    // Reset saved message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          General System Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure base system settings including language, timezone, and
          security parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Name */}
          <div>
            <label
              htmlFor="systemName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              System Name
            </label>
            <input
              type="text"
              name="systemName"
              id="systemName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.systemName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Default Language */}
          <div>
            <label
              htmlFor="defaultLanguage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Default Language
            </label>
            <select
              name="defaultLanguage"
              id="defaultLanguage"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.defaultLanguage}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Timezone
            </label>
            <select
              name="timezone"
              id="timezone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.timezone}
              onChange={handleChange}
            >
              <option value="UTC-12 (Baker Island)">
                UTC-12 (Baker Island)
              </option>
              <option value="UTC-11 (American Samoa)">
                UTC-11 (American Samoa)
              </option>
              <option value="UTC-10 (Hawaii)">UTC-10 (Hawaii)</option>
              <option value="UTC-9 (Alaska)">UTC-9 (Alaska)</option>
              <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
              <option value="UTC-7 (Mountain Time)">
                UTC-7 (Mountain Time)
              </option>
              <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
              <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
              <option value="UTC-4 (Atlantic Time)">
                UTC-4 (Atlantic Time)
              </option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="UTC+1 (Central European Time)">
                UTC+1 (Central European Time)
              </option>
              <option value="UTC+2 (Eastern European Time)">
                UTC+2 (Eastern European Time)
              </option>
              <option value="UTC+3 (Moscow Time)">UTC+3 (Moscow Time)</option>
              <option value="UTC+5:30 (Indian Standard Time)">
                UTC+5:30 (Indian Standard Time)
              </option>
              <option value="UTC+8 (China Standard Time)">
                UTC+8 (China Standard Time)
              </option>
              <option value="UTC+9 (Japan Standard Time)">
                UTC+9 (Japan Standard Time)
              </option>
              <option value="UTC+10 (Australian Eastern Time)">
                UTC+10 (Australian Eastern Time)
              </option>
              <option value="UTC+12 (New Zealand)">UTC+12 (New Zealand)</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label
              htmlFor="dateFormat"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date Format
            </label>
            <select
              name="dateFormat"
              id="dateFormat"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.dateFormat}
              onChange={handleChange}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="YYYY/MM/DD">YYYY/MM/DD</option>
              <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
            </select>
          </div>

          {/* Time Format */}
          <div>
            <label
              htmlFor="timeFormat"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Time Format
            </label>
            <select
              name="timeFormat"
              id="timeFormat"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.timeFormat}
              onChange={handleChange}
            >
              <option value="12-hour">12-hour (1:30 PM)</option>
              <option value="24-hour">24-hour (13:30)</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Currency
            </label>
            <select
              name="currency"
              id="currency"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Session Timeout */}
          <div>
            <label
              htmlFor="sessionTimeout"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              name="sessionTimeout"
              id="sessionTimeout"
              min="5"
              max="240"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.sessionTimeout}
              onChange={handleChange}
            />
          </div>

          {/* Password Expiry */}
          <div>
            <label
              htmlFor="passwordExpiryDays"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password Expiry (days)
            </label>
            <input
              type="number"
              name="passwordExpiryDays"
              id="passwordExpiryDays"
              min="0"
              max="365"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.passwordExpiryDays}
              onChange={handleChange}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Set to 0 for passwords that never expire
            </p>
          </div>

          {/* Minimum Password Length */}
          <div>
            <label
              htmlFor="minimumPasswordLength"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Minimum Password Length
            </label>
            <input
              type="number"
              name="minimumPasswordLength"
              id="minimumPasswordLength"
              min="6"
              max="32"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.minimumPasswordLength}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mt-6 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="enableNotifications"
                id="enableNotifications"
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                checked={formData.enableNotifications}
                onChange={handleChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="enableNotifications"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Enable System Notifications
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Allow the system to send notifications to users about events and
                alerts
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="enableAuditLogs"
                id="enableAuditLogs"
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                checked={formData.enableAuditLogs}
                onChange={handleChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="enableAuditLogs"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Enable Audit Logs
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Log all system actions for security and compliance purposes
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="maintenanceMode"
                id="maintenanceMode"
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                checked={formData.maintenanceMode}
                onChange={handleChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="maintenanceMode"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Maintenance Mode
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Put the system in maintenance mode, restricting access to all
                users except administrators
              </p>
            </div>
          </div>
        </div>

        {/* Maintenance Message */}
        {formData.maintenanceMode && (
          <div className="mt-6">
            <label
              htmlFor="maintenanceMessage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Maintenance Message
            </label>
            <textarea
              name="maintenanceMessage"
              id="maintenanceMessage"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.maintenanceMessage}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Info box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400 dark:text-blue-300"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Changes to these settings may require users to log out and log
                back in for full effect.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          {isSaved && (
            <div className="mr-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              Settings saved successfully
            </div>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettingsForm;
