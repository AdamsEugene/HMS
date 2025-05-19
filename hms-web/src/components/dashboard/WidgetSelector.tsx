import React from "react";
import { cn } from "../../utils/cn";
import { widgetTypes } from "./WidgetRegistry";

interface WidgetSelectorProps {
  activeWidgets: string[];
  onAddWidget: (widgetId: string) => void;
}

const WidgetSelector = ({
  activeWidgets,
  onAddWidget,
}: WidgetSelectorProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">Available Widgets</h2>

      <div className="bg-gradient-card backdrop-filter backdrop-blur-md rounded-lg p-4 border border-gray-700/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {widgetTypes.map((widget) => (
            <div
              key={widget.id}
              className={cn(
                "p-4 rounded-lg transition-all cursor-pointer",
                activeWidgets.includes(widget.id)
                  ? "bg-primary/20 border border-primary/30"
                  : "hover:bg-white/10 border border-white/5"
              )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetSelector;
