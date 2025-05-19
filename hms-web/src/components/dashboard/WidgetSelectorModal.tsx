import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { getAllWidgetTypes } from "./WidgetRegistry";

interface WidgetSelectorModalProps {
  activeWidgets: string[];
  onAddWidget: (widgetId: string) => void;
  onClose: () => void;
}

const WidgetSelectorModal = ({
  activeWidgets,
  onAddWidget,
  onClose,
}: WidgetSelectorModalProps) => {
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);
  const [allWidgets, setAllWidgets] = useState(getAllWidgetTypes());
  const [filter, setFilter] = useState("");

  // Update widgets when something changes
  useEffect(() => {
    setAllWidgets(getAllWidgetTypes());
  }, [activeWidgets]); // Refresh when active widgets change

  // Filter widgets based on search input
  const filteredWidgets = allWidgets.filter(
    (widget) =>
      widget.title.toLowerCase().includes(filter.toLowerCase()) ||
      widget.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl p-6 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ background: gradients.content }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10"
          aria-label="Close dialog"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Available Widgets</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search widgets..."
            className="w-full p-2 rounded-md bg-black/10 border border-gray-700/30 text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWidgets.map((widget) => (
            <div
              key={widget.id}
              className={`p-4 rounded-lg transition-all cursor-pointer 
                ${
                  activeWidgets.includes(widget.id)
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-black/10 hover:bg-black/20 border border-white/5"
                }`}
              onClick={() => {
                if (!activeWidgets.includes(widget.id)) {
                  onAddWidget(widget.id);
                }
              }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {typeof widget.icon === "string" ? (
                      <span className="text-lg">{widget.icon}</span>
                    ) : (
                      widget.icon
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">{widget.title}</h3>
                  <p className="text-xs text-gray-400">{widget.description}</p>
                </div>
              </div>
              {activeWidgets.includes(widget.id) && (
                <div className="mt-2 text-xs text-right text-primary font-medium">
                  Already added
                </div>
              )}
              {widget.isCustom && (
                <div className="mt-1 text-xs text-gray-400 italic">
                  Custom widget
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetSelectorModal;
