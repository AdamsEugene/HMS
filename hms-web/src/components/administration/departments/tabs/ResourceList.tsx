import { useState } from "react";
import type { DepartmentResource, NewDepartmentResource } from "../../types";
import {
  ComputerDesktopIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ResourceListProps {
  departmentId: string;
  resources: DepartmentResource[];
  addResource: (departmentId: string, resource: NewDepartmentResource) => void;
  removeResource: (departmentId: string, resourceId: string) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({
  departmentId,
  resources,
  addResource,
  removeResource,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState<NewDepartmentResource>({
    name: "",
    type: "Equipment",
    quantity: 1,
    status: "Available",
    lastUpdated: new Date().toISOString().split("T")[0],
  });

  const handleAddResource = () => {
    if (newResource.name) {
      addResource(departmentId, newResource);
      setNewResource({
        name: "",
        type: "Equipment",
        quantity: 1,
        status: "Available",
        lastUpdated: new Date().toISOString().split("T")[0],
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <ComputerDesktopIcon className="h-5 w-5 text-primary mr-2" />
          Department Resources
        </h3>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Resource
        </button>
      </div>

      {/* Add resource form */}
      {showAddForm && (
        <div className="bg-blue-50 dark:bg-gray-750 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Add New Resource
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
              <label htmlFor="resource-name" className="form-label">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                id="resource-name"
                type="text"
                className="form-input"
                value={newResource.name}
                onChange={(e) =>
                  setNewResource({ ...newResource, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="resource-type" className="form-label">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="resource-type"
                className="form-select"
                value={newResource.type}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    type: e.target.value as
                      | "Equipment"
                      | "Facility"
                      | "Software"
                      | "Service",
                  })
                }
                required
              >
                <option value="Equipment">Equipment</option>
                <option value="Facility">Facility</option>
                <option value="Software">Software</option>
                <option value="Service">Service</option>
              </select>
            </div>
            <div>
              <label htmlFor="resource-quantity" className="form-label">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="resource-quantity"
                type="number"
                min="1"
                className="form-input"
                value={newResource.quantity}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="resource-status" className="form-label">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="resource-status"
                className="form-select"
                value={newResource.status}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    status: e.target.value as
                      | "Available"
                      | "Limited"
                      | "Unavailable",
                  })
                }
                required
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Unavailable">Unavailable</option>
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
              onClick={handleAddResource}
              disabled={!newResource.name}
            >
              Add Resource
            </button>
          </div>
        </div>
      )}

      {/* Resource list */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Resource
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
              >
                Last Updated
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {resource.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {resource.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {resource.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resource.status === "Available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : resource.status === "Limited"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {new Date(resource.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => removeResource(departmentId, resource.id)}
                      aria-label={`Remove ${resource.name}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No resources added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceList;
