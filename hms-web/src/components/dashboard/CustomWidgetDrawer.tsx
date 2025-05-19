import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { saveCustomWidget } from "./WidgetRegistry";
import type { CustomWidgetData } from "./CustomWidget";

interface CustomWidgetDrawerProps {
  onClose: () => void;
  onWidgetCreated: (widgetId: string) => void;
}

const CustomWidgetDrawer: React.FC<CustomWidgetDrawerProps> = ({
  onClose,
  onWidgetCreated,
}) => {
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);
  const [isVisible, setIsVisible] = useState(false);

  // State for widget creation
  const [widgetType, setWidgetType] = useState<"text" | "stat" | "link">(
    "text"
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>("📝");
  const [content, setContent] = useState("");
  const [value, setValue] = useState("");
  const [change, setChange] = useState("0%");
  const [isIncrease, setIsIncrease] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(
    currentTheme.primaryColor
  );

  useEffect(() => {
    // Set visible after component mounts for animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual unmounting to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Handle creating a new custom widget
  const handleCreateWidget = () => {
    // Validate
    if (!title.trim()) {
      alert("Please enter a title for your widget");
      return;
    }

    // Generate a unique ID
    const newWidgetId = `custom-${Date.now()}`;

    // Create the widget data
    const newWidget: CustomWidgetData = {
      id: newWidgetId,
      type: "custom", // Always set type to "custom" for widget system
      widgetType, // Store actual widget type (text, stat, link) in a separate property
      title,
      description,
      icon,
      content:
        widgetType === "text" || widgetType === "link" ? content : undefined,
      value: widgetType === "stat" ? value : undefined,
      change: widgetType === "stat" ? change : undefined,
      isIncrease: widgetType === "stat" ? isIncrease : undefined,
      backgroundColor,
      defaultWidth: 2,
      defaultHeight: widgetType === "stat" ? 1 : 2,
    };

    // Save the widget
    if (saveCustomWidget(newWidget)) {
      onWidgetCreated(newWidgetId);
      handleClose();
    }
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
            <h2 className="text-xl font-semibold">Create Custom Widget</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-white/10"
              aria-label="Close drawer"
              title="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="widget-type"
                >
                  Widget Type
                </label>
                <div className="flex space-x-2" id="widget-type">
                  <button
                    className={`px-3 py-2 rounded-md text-sm ${
                      widgetType === "text"
                        ? "bg-primary text-white"
                        : "bg-black/10 text-gray-300"
                    }`}
                    onClick={() => setWidgetType("text")}
                    aria-label="Text Widget"
                  >
                    Text Widget
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm ${
                      widgetType === "stat"
                        ? "bg-primary text-white"
                        : "bg-black/10 text-gray-300"
                    }`}
                    onClick={() => setWidgetType("stat")}
                    aria-label="Stat Card"
                  >
                    Stat Card
                  </button>
                  <button
                    className={`px-3 py-2 rounded-md text-sm ${
                      widgetType === "link"
                        ? "bg-primary text-white"
                        : "bg-black/10 text-gray-300"
                    }`}
                    onClick={() => setWidgetType("link")}
                    aria-label="Links Widget"
                  >
                    Links Widget
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="widget-title"
                >
                  Widget Title
                </label>
                <input
                  id="widget-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Enter widget title"
                  aria-label="Widget title"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="widget-description"
                >
                  Description
                </label>
                <input
                  id="widget-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Brief description"
                  aria-label="Widget description"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="widget-icon"
                >
                  Icon (emoji)
                </label>
                <input
                  id="widget-icon"
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Icon or emoji"
                  maxLength={2}
                  aria-label="Widget icon"
                />
              </div>

              {widgetType === "text" && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="widget-content"
                  >
                    Text Content
                  </label>
                  <textarea
                    id="widget-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                    rows={4}
                    placeholder="Enter content for your text widget"
                    aria-label="Widget content"
                  />
                </div>
              )}

              {widgetType === "link" && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="widget-links"
                  >
                    Links (One per line)
                  </label>
                  <textarea
                    id="widget-links"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                    rows={4}
                    placeholder="Format: Title|URL (one per line)"
                    aria-label="Widget links"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Example: Google|https://google.com
                  </p>
                </div>
              )}

              {widgetType === "stat" && (
                <>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="widget-value"
                    >
                      Value
                    </label>
                    <input
                      id="widget-value"
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="Stat value (e.g. 42, $1,200)"
                      aria-label="Stat value"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="widget-change"
                    >
                      Change
                    </label>
                    <input
                      id="widget-change"
                      type="text"
                      value={change}
                      onChange={(e) => setChange(e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="Change percentage (e.g. 5%)"
                      aria-label="Change percentage"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="widget-trend"
                    >
                      Trend Direction
                    </label>
                    <div className="flex space-x-2" id="widget-trend">
                      <button
                        className={`px-3 py-1 rounded-md text-sm ${
                          isIncrease
                            ? "bg-green-500/20 text-green-500"
                            : "bg-black/10 text-gray-300"
                        }`}
                        onClick={() => setIsIncrease(true)}
                        aria-label="Increasing trend"
                      >
                        Increasing ↑
                      </button>
                      <button
                        className={`px-3 py-1 rounded-md text-sm ${
                          !isIncrease
                            ? "bg-red-500/20 text-red-500"
                            : "bg-black/10 text-gray-300"
                        }`}
                        onClick={() => setIsIncrease(false)}
                        aria-label="Decreasing trend"
                      >
                        Decreasing ↓
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="widget-color"
                >
                  Accent Color
                </label>
                <input
                  id="widget-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 rounded-md cursor-pointer"
                  aria-label="Widget accent color"
                />
              </div>
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
              onClick={handleCreateWidget}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Create Widget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomWidgetDrawer;
