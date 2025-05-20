import { useState } from "react";
import type {
  KeyPerformanceIndicator,
  NewKeyPerformanceIndicator,
} from "../../types";
import {
  ChartPieIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface KPIListProps {
  departmentId: string;
  kpis: KeyPerformanceIndicator[];
  addKPI: (departmentId: string, kpi: NewKeyPerformanceIndicator) => void;
  removeKPI: (departmentId: string, kpiId: string) => void;
}

const KPIList: React.FC<KPIListProps> = ({
  departmentId,
  kpis,
  addKPI,
  removeKPI,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKPI, setNewKPI] = useState<NewKeyPerformanceIndicator>({
    name: "",
    description: "",
    target: 0,
    unit: "",
    frequency: "Monthly",
    status: "Active",
  });

  const handleAddKPI = () => {
    if (newKPI.name && newKPI.description && newKPI.unit) {
      addKPI(departmentId, newKPI);
      setNewKPI({
        name: "",
        description: "",
        target: 0,
        unit: "",
        frequency: "Monthly",
        status: "Active",
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <ChartPieIcon className="h-5 w-5 text-primary mr-2" />
          Key Performance Indicators
        </h3>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add KPI
        </button>
      </div>

      {/* Add KPI form */}
      {showAddForm && (
        <div className="bg-blue-50 dark:bg-gray-750 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Add New KPI
            </h4>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              onClick={() => setShowAddForm(false)}
              aria-label="Close form"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="kpi-name" className="form-label">
                KPI Name <span className="text-red-500">*</span>
              </label>
              <input
                id="kpi-name"
                type="text"
                className="form-input"
                value={newKPI.name}
                onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="kpi-description" className="form-label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="kpi-description"
                className="form-input"
                rows={2}
                value={newKPI.description}
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="kpi-target" className="form-label">
                Target Value <span className="text-red-500">*</span>
              </label>
              <input
                id="kpi-target"
                type="number"
                step="0.01"
                className="form-input"
                value={newKPI.target}
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    target: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="kpi-unit" className="form-label">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                id="kpi-unit"
                type="text"
                className="form-input"
                placeholder="%, minutes, count, etc."
                value={newKPI.unit}
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    unit: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="kpi-frequency" className="form-label">
                Measurement Frequency
              </label>
              <select
                id="kpi-frequency"
                className="form-select"
                value={newKPI.frequency}
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    frequency: e.target.value as
                      | "Daily"
                      | "Weekly"
                      | "Monthly"
                      | "Quarterly"
                      | "Annually",
                  })
                }
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
            <div>
              <label htmlFor="kpi-status" className="form-label">
                Status
              </label>
              <select
                id="kpi-status"
                className="form-select"
                value={newKPI.status}
                onChange={(e) =>
                  setNewKPI({
                    ...newKPI,
                    status: e.target.value as
                      | "Active"
                      | "Under Review"
                      | "Inactive",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary text-sm"
              onClick={handleAddKPI}
              disabled={!newKPI.name || !newKPI.description || !newKPI.unit}
            >
              Add KPI
            </button>
          </div>
        </div>
      )}

      {/* KPI list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpis.length > 0 ? (
          kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  {kpi.name}
                </h4>
                <button
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => removeKPI(departmentId, kpi.id)}
                  aria-label={`Remove ${kpi.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {kpi.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[100px]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Target
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {kpi.target} {kpi.unit}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Frequency
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {kpi.frequency}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Status
                    </div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        kpi.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : kpi.status === "Under Review"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {kpi.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            <ChartPieIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <p>No KPIs added yet</p>
            <p className="text-sm mt-1">
              KPIs help track and measure department performance
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIList;
