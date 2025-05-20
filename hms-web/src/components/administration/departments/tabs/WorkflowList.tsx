import { useState } from "react";
import type { Workflow, NewWorkflow } from "../../types";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface WorkflowListProps {
  departmentId: string;
  workflows: Workflow[];
  addWorkflow: (departmentId: string, workflow: NewWorkflow) => void;
  removeWorkflow: (departmentId: string, workflowId: string) => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({
  departmentId,
  workflows,
  addWorkflow,
  removeWorkflow,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<NewWorkflow>({
    name: "",
    description: "",
    status: "Draft",
    lastUpdated: new Date().toISOString().split("T")[0],
    steps: [],
  });

  const handleAddWorkflow = () => {
    if (newWorkflow.name && newWorkflow.description) {
      addWorkflow(departmentId, newWorkflow);
      setNewWorkflow({
        name: "",
        description: "",
        status: "Draft",
        lastUpdated: new Date().toISOString().split("T")[0],
        steps: [],
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <ArrowPathIcon className="h-5 w-5 text-primary mr-2" />
          Department Workflows
        </h3>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Workflow
        </button>
      </div>

      {/* Add workflow form */}
      {showAddForm && (
        <div className="bg-blue-50 dark:bg-gray-750 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Add New Workflow
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

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="workflow-name" className="form-label">
                Workflow Name <span className="text-red-500">*</span>
              </label>
              <input
                id="workflow-name"
                type="text"
                className="form-input"
                value={newWorkflow.name}
                onChange={(e) =>
                  setNewWorkflow({ ...newWorkflow, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="workflow-description" className="form-label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="workflow-description"
                className="form-input"
                rows={3}
                value={newWorkflow.description}
                onChange={(e) =>
                  setNewWorkflow({
                    ...newWorkflow,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="workflow-status" className="form-label">
                Status
              </label>
              <select
                id="workflow-status"
                className="form-select"
                value={newWorkflow.status}
                onChange={(e) =>
                  setNewWorkflow({
                    ...newWorkflow,
                    status: e.target.value as "Active" | "Draft" | "Archived",
                  })
                }
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Note: After creating the workflow, you can add steps to define the
              process in detail.
            </p>
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
              onClick={handleAddWorkflow}
              disabled={!newWorkflow.name || !newWorkflow.description}
            >
              Add Workflow
            </button>
          </div>
        </div>
      )}

      {/* Workflow list */}
      <div className="space-y-4">
        {workflows.length > 0 ? (
          workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    {workflow.name}
                  </h4>
                  <span
                    className={`ml-3 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      workflow.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : workflow.status === "Draft"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {workflow.status}
                  </span>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => removeWorkflow(departmentId, workflow.id)}
                  aria-label={`Remove ${workflow.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {workflow.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Last updated:{" "}
                  {new Date(workflow.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Steps ({workflow.steps.length})
                </h5>
                {workflow.steps.length > 0 ? (
                  <ul className="space-y-2">
                    {workflow.steps
                      .sort((a, b) => a.order - b.order)
                      .map((step) => (
                        <li
                          key={step.id}
                          className="text-sm bg-white dark:bg-gray-700 rounded px-3 py-2 flex justify-between items-center"
                        >
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {step.order}. {step.name}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {step.description}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Assigned to: {step.assignedRole} • Est. Duration:{" "}
                              {step.estimatedDuration} min
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              step.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : step.status === "In Review"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {step.status}
                          </span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No steps defined yet. Steps can be added to define the
                    workflow process.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            <ArrowPathIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <p>No workflows added yet</p>
            <p className="text-sm mt-1">
              Workflows help standardize processes within the department
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowList;
