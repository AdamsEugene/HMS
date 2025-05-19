import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import ChartContainer from "./ChartContainer";
import { saveCustomWidget } from "./WidgetRegistry";
import { PlusIcon } from "@heroicons/react/24/outline";

// Custom widget interfaces
export interface CustomWidgetProps {
  id: string;
  widget: {
    id: string;
    type: string;
    widgetType?: "text" | "stat" | "link";
    title: string;
    description: string;
    icon: React.ReactNode | string;
    content?: string;
    value?: string;
    change?: string;
    isIncrease?: boolean;
    backgroundColor?: string;
    isCreator?: boolean;
  };
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export interface CustomWidgetData {
  id: string;
  type: string; // Always "custom" for widget system
  widgetType?: "text" | "stat" | "link"; // The actual widget subtype
  title: string;
  description: string;
  icon: string;
  content?: string;
  value?: string;
  change?: string;
  isIncrease?: boolean;
  textColor?: string;
  backgroundColor?: string;
  defaultWidth: number;
  defaultHeight: number;
}

const CustomWidget = ({
  id,
  widget,
  isCustomizing,
  onRemove,
  onConfigure,
}: CustomWidgetProps) => {
  const { currentTheme } = useTheme();

  // State for widget creation
  const [isCreating, setIsCreating] = useState(widget.isCreator || false);
  const [widgetType, setWidgetType] = useState<"text" | "stat" | "link">(
    "text"
  );
  const [title, setTitle] = useState(widget.title || "");
  const [description, setDescription] = useState(widget.description || "");
  const [icon, setIcon] = useState<string>(
    typeof widget.icon === "string" ? widget.icon : "📝"
  );
  const [content, setContent] = useState(widget.content || "");
  const [value, setValue] = useState(widget.value || "");
  const [change, setChange] = useState(widget.change || "0%");
  const [isIncrease, setIsIncrease] = useState(
    widget.isIncrease !== undefined ? widget.isIncrease : true
  );
  const [backgroundColor, setBackgroundColor] = useState(
    widget.backgroundColor || currentTheme.primaryColor
  );

  // Handle creating a new custom widget
  const handleCreateWidget = () => {
    // Generate a unique ID
    const newWidgetId = `custom-${Date.now()}`;

    // Create the widget data
    const newWidget: CustomWidgetData = {
      id: newWidgetId,
      type: "custom",
      widgetType,
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
      // Add this widget to the dashboard
      if (onConfigure) {
        onConfigure(newWidgetId); // We'll use the configure function to add to dashboard
      }

      // Reset the creator
      setIsCreating(false);
      setWidgetType("text");
      setTitle("");
      setDescription("");
      setIcon("📝");
      setContent("");
      setValue("");
      setChange("0%");
      setIsIncrease(true);
    }
  };

  // Render widget creator
  if (isCreating || widget.isCreator) {
    return (
      <ChartContainer
        id={id}
        title="Create Custom Widget"
        onRemove={onRemove}
        onConfigure={onConfigure}
        isCustomizing={isCustomizing}
      >
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Widget Type
            </label>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-2 rounded-md text-sm ${
                  widgetType === "text"
                    ? "bg-primary text-white"
                    : "bg-black/10 text-gray-300"
                }`}
                onClick={() => setWidgetType("text")}
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
              >
                Links Widget
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Widget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-black/10 border border-gray-700/30 rounded-md"
              placeholder="Enter widget title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-black/10 border border-gray-700/30 rounded-md"
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Icon (emoji)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-2 bg-black/10 border border-gray-700/30 rounded-md"
              placeholder="Icon or emoji"
              maxLength={2}
            />
          </div>

          {widgetType === "stat" ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full p-2 bg-black/10 border border-gray-700/30 rounded-md"
                  placeholder="Stat value (e.g. 42, $1,200)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Change</label>
                <input
                  type="text"
                  value={change}
                  onChange={(e) => setChange(e.target.value)}
                  className="w-full p-2 bg-black/10 border border-gray-700/30 rounded-md"
                  placeholder="Change percentage (e.g. 5%)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trend</label>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      isIncrease
                        ? "bg-green-500/20 text-green-500"
                        : "bg-black/10 text-gray-300"
                    }`}
                    onClick={() => setIsIncrease(true)}
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
                  >
                    Decreasing ↓
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                {widgetType === "text" ? "Content" : "Links (one per line)"}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 bg-black/10 border border-gray-700/30 rounded-md min-h-[100px]"
                placeholder={
                  widgetType === "text"
                    ? "Enter widget content"
                    : "Format: Link Text | https://example.com"
                }
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded"
                aria-label="Select background color"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full p-2 bg-black/10 border border-gray-700/30 rounded-md"
                placeholder="#RRGGBB"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
              onClick={handleCreateWidget}
              disabled={!title.trim()}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Widget
            </button>
          </div>
        </div>
      </ChartContainer>
    );
  }

  // Render different types of custom widgets
  switch (widget.widgetType || widget.type) {
    case "text":
      return (
        <ChartContainer
          id={id}
          title={widget.title}
          onRemove={onRemove}
          onConfigure={onConfigure}
          isCustomizing={isCustomizing}
        >
          <div
            className="p-4 h-full overflow-auto custom-scrollbar"
            style={{
              backgroundColor: widget.backgroundColor
                ? `${widget.backgroundColor}10`
                : undefined,
            }}
          >
            <p className="whitespace-pre-wrap">{widget.content}</p>
          </div>
        </ChartContainer>
      );

    case "link":
      return (
        <ChartContainer
          id={id}
          title={widget.title}
          onRemove={onRemove}
          onConfigure={onConfigure}
          isCustomizing={isCustomizing}
        >
          <div
            className="p-4 h-full overflow-auto custom-scrollbar"
            style={{
              backgroundColor: widget.backgroundColor
                ? `${widget.backgroundColor}10`
                : undefined,
            }}
          >
            <ul className="space-y-2">
              {widget.content
                ?.split("\n")
                .map((link: string, index: number) => {
                  const [text, url] = link.split("|").map((s) => s.trim());
                  if (!text || !url) return null;

                  return (
                    <li key={index} className="py-1">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <span className="mr-1">→</span> {text}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </ChartContainer>
      );

    case "stat":
      return (
        <ChartContainer
          id={id}
          title={widget.title}
          onRemove={onRemove}
          onConfigure={onConfigure}
          isCustomizing={isCustomizing}
        >
          <div
            className="p-4 h-full flex flex-col justify-center"
            style={{
              backgroundColor: widget.backgroundColor
                ? `${widget.backgroundColor}10`
                : undefined,
            }}
          >
            <div className="text-3xl font-semibold">
              {widget.value || "N/A"}
            </div>
            {widget.change && (
              <div
                className={`text-sm mt-1 ${
                  widget.isIncrease ? "text-green-500" : "text-red-500"
                }`}
              >
                {widget.isIncrease ? "↑" : "↓"} {widget.change}
              </div>
            )}
          </div>
        </ChartContainer>
      );

    default:
      // Fallback for unknown widget types
      return (
        <ChartContainer
          id={id}
          title={widget.title || "Custom Widget"}
          onRemove={onRemove}
          onConfigure={onConfigure}
          isCustomizing={isCustomizing}
        >
          <div className="p-4 flex items-center justify-center h-full">
            <p className="text-gray-400">Widget content not available</p>
          </div>
        </ChartContainer>
      );
  }
};

export default CustomWidget;
