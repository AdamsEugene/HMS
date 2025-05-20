import React from "react";
import type { NewDepartment } from "../types";
import {
  UserGroupIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

interface AddDepartmentFormProps {
  newDepartment: NewDepartment;
  setNewDepartment: React.Dispatch<React.SetStateAction<NewDepartment>>;
  addDepartment: () => void;
  cancelAdd: () => void;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({
  newDepartment,
  setNewDepartment,
  addDepartment,
  cancelAdd,
}) => {
  // Function to update basic department fields
  const updateField = <K extends keyof NewDepartment>(
    field: K,
    value: NewDepartment[K]
  ) => {
    setNewDepartment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDepartment();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-primary" />
          Add New Department
        </h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={cancelAdd}
          aria-label="Cancel adding department"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="dept-name" className="form-label">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              id="dept-name"
              type="text"
              className="form-input"
              value={newDepartment.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="dept-type" className="form-label">
              Department Type <span className="text-red-500">*</span>
            </label>
            <select
              id="dept-type"
              className="form-select"
              value={newDepartment.type}
              onChange={(e) => updateField("type", e.target.value)}
              required
            >
              <option value="Clinical">Clinical</option>
              <option value="Clinical Support">Clinical Support</option>
              <option value="Administrative">Administrative</option>
              <option value="Financial">Financial</option>
              <option value="Technical">Technical</option>
              <option value="Operational Support">Operational Support</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="dept-description" className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="dept-description"
              className="form-input"
              rows={3}
              value={newDepartment.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="dept-location" className="form-label">
              Location
            </label>
            <input
              id="dept-location"
              type="text"
              className="form-input"
              value={newDepartment.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Building, Floor, Room"
            />
          </div>

          <div>
            <label htmlFor="dept-extension" className="form-label">
              Extension Number
            </label>
            <input
              id="dept-extension"
              type="text"
              className="form-input"
              value={newDepartment.extension}
              onChange={(e) => updateField("extension", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="dept-email" className="form-label">
              Email Address
            </label>
            <input
              id="dept-email"
              type="email"
              className="form-input"
              value={newDepartment.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="dept-established" className="form-label">
              Established Date
            </label>
            <input
              id="dept-established"
              type="date"
              className="form-input"
              value={newDepartment.establishedDate}
              onChange={(e) => updateField("establishedDate", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="dept-status" className="form-label">
              Status
            </label>
            <select
              id="dept-status"
              className="form-select"
              value={newDepartment.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as "Active" | "Inactive" | "Under Construction"
                )
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg mb-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Note
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            After creating the department, you'll be able to add staff,
            resources, workflows, and key performance indicators.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn-secondary flex items-center"
            onClick={cancelAdd}
          >
            <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
            Back to List
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!newDepartment.name || !newDepartment.description}
          >
            Create Department
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartmentForm;
