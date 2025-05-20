import { useState } from "react";
import type { StaffMember, NewStaffMember } from "../../types";
import {
  UsersIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface StaffListProps {
  departmentId: string;
  staff: StaffMember[];
  headId?: string;
  addStaffMember: (departmentId: string, staff: NewStaffMember) => void;
  removeStaffMember: (departmentId: string, staffId: string) => void;
}

const StaffList: React.FC<StaffListProps> = ({
  departmentId,
  staff,
  headId,
  addStaffMember,
  removeStaffMember,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState<NewStaffMember>({
    name: "",
    position: "",
    email: "",
    phone: "",
    role: "Staff",
    status: "Active",
  });

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.position && newStaff.email) {
      addStaffMember(departmentId, newStaff);
      setNewStaff({
        name: "",
        position: "",
        email: "",
        phone: "",
        role: "Staff",
        status: "Active",
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <UsersIcon className="h-5 w-5 text-primary mr-2" />
          Staff Members
        </h3>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Staff Member
        </button>
      </div>

      {/* Add staff form */}
      {showAddForm && (
        <div className="bg-blue-50 dark:bg-gray-750 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Add New Staff Member
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
              <label htmlFor="staff-name" className="form-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="staff-name"
                type="text"
                className="form-input"
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="staff-position" className="form-label">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                id="staff-position"
                type="text"
                className="form-input"
                value={newStaff.position}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, position: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="staff-specialization" className="form-label">
                Specialization
              </label>
              <input
                id="staff-specialization"
                type="text"
                className="form-input"
                value={newStaff.specialization || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, specialization: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="staff-email" className="form-label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="staff-email"
                type="email"
                className="form-input"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="staff-phone" className="form-label">
                Phone Number
              </label>
              <input
                id="staff-phone"
                type="tel"
                className="form-input"
                value={newStaff.phone}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="staff-role" className="form-label">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="staff-role"
                className="form-select"
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    role: e.target.value as "Head" | "Staff" | "Admin",
                  })
                }
                required
              >
                <option value="Head">Department Head</option>
                <option value="Staff">Staff Member</option>
                <option value="Admin">Administrative</option>
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
              onClick={handleAddStaff}
              disabled={!newStaff.name || !newStaff.position || !newStaff.email}
            >
              Add Staff Member
            </button>
          </div>
        </div>
      )}

      {/* Staff list */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {staff.length > 0 ? (
              staff.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          {member.name}
                          {member.id === headId && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Head
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                          {member.position}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    <div>
                      {member.position}
                      {member.specialization && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {member.specialization}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    <div>{member.email}</div>
                    <div>{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : member.status === "On Leave"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => removeStaffMember(departmentId, member.id)}
                      aria-label={`Remove ${member.name}`}
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
                  No staff members added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
