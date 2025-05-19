import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getWidgetById } from "./WidgetRegistry";
import { useTheme } from "../../contexts/ThemeContext";

interface WidgetConfigPanelProps {
  widgetId: string;
  onClose: () => void;
  onSave: (widgetId: string, config: Record<string, unknown>) => void;
}

const WidgetConfigPanel: React.FC<WidgetConfigPanelProps> = ({
  widgetId,
  onClose,
  onSave,
}) => {
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const widget = getWidgetById(widgetId);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after component mounts for animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Load existing configuration if available
    const savedConfig = localStorage.getItem(`widget-config-${widgetId}`);
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Failed to parse saved widget config", e);
      }
    } else if (widget?.defaultConfig) {
      setConfig(widget.defaultConfig);
    }
  }, [widgetId, widget]);

  const handleConfigChange = (key: string, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(widgetId, config);
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual unmounting to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-full max-w-md shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: gradients.content }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold">Configure Widget</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-white/10"
              aria-label="Close configuration panel"
              title="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <h3 className="font-medium mb-2">{widget?.title || widgetId}</h3>
            {widget?.description && (
              <p className="text-sm text-gray-400 mb-4">{widget.description}</p>
            )}

            <div className="space-y-4">
              {/* Basic configuration options */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="widget-title"
                >
                  Widget Title
                </label>
                <input
                  id="widget-title"
                  type="text"
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                  value={(config.title as string) || widget?.title || ""}
                  onChange={(e) => handleConfigChange("title", e.target.value)}
                  placeholder="Enter widget title"
                  aria-label="Widget title"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="refresh-rate"
                >
                  Refresh Rate
                </label>
                <select
                  id="refresh-rate"
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                  value={(config.refreshInterval as string) || "0"}
                  onChange={(e) =>
                    handleConfigChange("refreshInterval", e.target.value)
                  }
                  aria-label="Widget refresh rate"
                  title="Select how often the widget should refresh"
                >
                  <option value="0">Manual refresh only</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every minute</option>
                  <option value="300">Every 5 minutes</option>
                  <option value="600">Every 10 minutes</option>
                  <option value="1800">Every 30 minutes</option>
                  <option value="3600">Every hour</option>
                </select>
              </div>

              {/* Data source selection for applicable widgets */}
              {(widget?.type === "chart" || widget?.type === "stat") && (
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="data-source"
                  >
                    Data Source
                  </label>
                  <select
                    id="data-source"
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                    value={(config.dataSource as string) || "default"}
                    onChange={(e) =>
                      handleConfigChange("dataSource", e.target.value)
                    }
                    aria-label="Widget data source"
                    title="Select the data source for this widget"
                  >
                    <option value="default">Default</option>
                    <option value="patients">Patient Data</option>
                    <option value="appointments">Appointment Data</option>
                    <option value="revenue">Revenue Data</option>
                    <option value="performance">Performance Metrics</option>
                  </select>
                </div>
              )}

              {/* Widget-specific configuration options */}
              {widget?.configOptions?.map((option) => (
                <div key={option.key}>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor={`option-${option.key}`}
                  >
                    {option.label}
                  </label>
                  {option.type === "select" ? (
                    <select
                      id={`option-${option.key}`}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                      value={
                        (config[option.key] as string) ||
                        (option.default as string)
                      }
                      onChange={(e) =>
                        handleConfigChange(option.key, e.target.value)
                      }
                      aria-label={option.label}
                      title={option.description || `Select ${option.label}`}
                    >
                      {option.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : option.type === "checkbox" ? (
                    <input
                      id={`option-${option.key}`}
                      type="checkbox"
                      checked={
                        (config[option.key] as boolean) ??
                        (option.default as boolean)
                      }
                      onChange={(e) =>
                        handleConfigChange(option.key, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      aria-label={option.label}
                      title={option.description || option.label}
                    />
                  ) : (
                    <input
                      id={`option-${option.key}`}
                      type={option.type || "text"}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                      value={
                        (config[option.key] as string) ||
                        (option.default as string) ||
                        ""
                      }
                      onChange={(e) =>
                        handleConfigChange(option.key, e.target.value)
                      }
                      placeholder={`Enter ${option.label.toLowerCase()}`}
                      aria-label={option.label}
                      title={option.description || `Enter ${option.label}`}
                    />
                  )}
                  {option.description && (
                    <p className="mt-1 text-xs text-gray-400">
                      {option.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-black/20 text-gray-300 rounded-md hover:bg-black/30"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfigPanel;
