import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ConfigPanelProps {
  layouts: { [key: string]: LayoutItem[] };
  activeWidgets: string[];
  selectedLayout: string;
  onSave: () => void;
  onClose: () => void;
  onApplyLayout: (layoutId: string) => void;
  presets: Array<{ id: string; name: string; description: string }>;
  onSaveAsNew: (name: string, description: string) => void;
}

const ConfigPanel = ({
  activeWidgets,
  selectedLayout,
  onSave,
  onClose,
  onApplyLayout,
  presets,
  onSaveAsNew,
}: ConfigPanelProps) => {
  const { currentTheme, getGradientBackground } = useTheme();
  const gradients = getGradientBackground(currentTheme);
  const [newLayoutName, setNewLayoutName] = useState("");
  const [newLayoutDescription, setNewLayoutDescription] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSaveNew = () => {
    if (newLayoutName.trim()) {
      onSaveAsNew(newLayoutName, newLayoutDescription);
      setNewLayoutName("");
      setNewLayoutDescription("");
      setShowSaveForm(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-6 rounded-lg shadow-xl"
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

        <h2 className="text-xl font-semibold mb-4">Dashboard Configuration</h2>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Current Layout
          </h3>
          <div className="flex items-center justify-between p-3 bg-black/10 rounded-md">
            <div>
              <p className="font-medium">
                {presets.find((p) => p.id === selectedLayout)?.name ||
                  "Custom Layout"}
              </p>
              <p className="text-xs text-gray-400">
                {activeWidgets.length} widgets
              </p>
            </div>
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Layout Presets
          </h3>
          <div className="space-y-2">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedLayout === preset.id
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-black/10 hover:bg-black/20"
                }`}
                onClick={() => onApplyLayout(preset.id)}
              >
                <p className="font-medium">{preset.name}</p>
                <p className="text-xs text-gray-400">{preset.description}</p>
              </div>
            ))}
          </div>
        </div>

        {showSaveForm ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Save Current Layout
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Layout name"
                className="w-full p-2 rounded-md bg-black/10 border border-gray-700/30 text-white"
                value={newLayoutName}
                onChange={(e) => setNewLayoutName(e.target.value)}
              />
              <textarea
                placeholder="Description (optional)"
                className="w-full p-2 rounded-md bg-black/10 border border-gray-700/30 text-white h-20 resize-none"
                value={newLayoutDescription}
                onChange={(e) => setNewLayoutDescription(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveNew}
                  className="px-4 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveForm(false)}
                  className="px-4 py-2 text-sm font-medium rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSaveForm(true)}
            className="w-full py-2 text-sm font-medium rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Save as New Layout
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfigPanel;
