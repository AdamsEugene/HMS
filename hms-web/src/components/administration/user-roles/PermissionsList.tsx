import { useState } from "react";
import {
  UsersIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Permission } from "../types";

interface PermissionsListProps {
  permissions: Permission[];
  onAddPermission: (permission: Permission) => void;
  onUpdatePermission: (permission: Permission) => void;
  onDeletePermission: (permissionId: string) => void;
}

const PermissionsList: React.FC<PermissionsListProps> = ({
  permissions,
  onAddPermission,
  onUpdatePermission,
  onDeletePermission,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [newPermission, setNewPermission] = useState<Omit<Permission, "id">>({
    name: "",
    description: "",
    category: "Clinical",
    isActive: true,
  });

  // Get unique categories from permissions
  const categories = [...new Set(permissions.map((p) => p.category))];

  const handleOpenModal = (permission?: Permission) => {
    if (permission) {
      setEditingPermission(permission);
      setNewPermission({
        name: permission.name,
        description: permission.description,
        category: permission.category,
        isActive: permission.isActive,
      });
    } else {
      setEditingPermission(null);
      setNewPermission({
        name: "",
        description: "",
        category: categories[0] || "Clinical",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPermission(null);
  };

  const handleSavePermission = () => {
    if (editingPermission) {
      const updatedPermission = {
        ...editingPermission,
        name: newPermission.name,
        description: newPermission.description,
        category: newPermission.category,
        isActive: newPermission.isActive,
      };
      onUpdatePermission(updatedPermission);
    } else {
      // For a new permission, we include a dummy ID that will be replaced in the parent component
      const tempPermission = {
        ...newPermission,
        id: "temp-id",
      };
      onAddPermission(tempPermission);
    }
    handleCloseModal();
  };

  const handleDeleteConfirm = (permissionId: string) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      onDeletePermission(permissionId);
    }
  };

  // Group permissions by category for display
  const groupedPermissions = permissions.reduce(
    (groups, permission) => {
      const category = permission.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    },
    {} as Record<string, Permission[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <UsersIcon className="h-6 w-6 text-primary mr-2" />
          System Permissions
        </h2>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => handleOpenModal()}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add New Permission
        </button>
      </div>

      {Object.entries(groupedPermissions).map(([category, perms]) => (
        <div
          key={category}
          className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md mb-6"
        >
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {category}
            </h3>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {perms.map((permission) => (
              <li key={permission.id}>
                <div className="px-4 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </h4>
                        <span
                          className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            permission.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                        >
                          {permission.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {permission.description}
                      </p>
                    </div>
                    <div className="flex ml-4 space-x-2">
                      <button
                        type="button"
                        className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        onClick={() => handleOpenModal(permission)}
                        aria-label={`Edit ${permission.name}`}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                        onClick={() => handleDeleteConfirm(permission.id)}
                        aria-label={`Delete ${permission.name}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Add/Edit Permission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        {editingPermission
                          ? "Edit Permission"
                          : "Add New Permission"}
                      </h3>
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={handleCloseModal}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="permission-name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Permission Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="permission-name"
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          value={newPermission.name}
                          onChange={(e) =>
                            setNewPermission({
                              ...newPermission,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="permission-description"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="permission-description"
                          rows={3}
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          value={newPermission.description}
                          onChange={(e) =>
                            setNewPermission({
                              ...newPermission,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="permission-category"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Category
                        </label>
                        <div className="flex items-center mt-1">
                          <select
                            id="permission-category"
                            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:text-white"
                            value={newPermission.category}
                            onChange={(e) =>
                              setNewPermission({
                                ...newPermission,
                                category: e.target.value,
                              })
                            }
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          {/* Add new category option */}
                          <button
                            type="button"
                            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            onClick={() => {
                              const newCategory = prompt(
                                "Enter new category name:"
                              );
                              if (
                                newCategory &&
                                !categories.includes(newCategory)
                              ) {
                                setNewPermission({
                                  ...newPermission,
                                  category: newCategory,
                                });
                              }
                            }}
                            aria-label="Add new category"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="permission-active"
                          type="checkbox"
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded"
                          checked={newPermission.isActive}
                          onChange={(e) =>
                            setNewPermission({
                              ...newPermission,
                              isActive: e.target.checked,
                            })
                          }
                        />
                        <label
                          htmlFor="permission-active"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn-primary w-full sm:w-auto sm:ml-3"
                  onClick={handleSavePermission}
                  disabled={!newPermission.name || !newPermission.description}
                >
                  {editingPermission
                    ? "Update Permission"
                    : "Create Permission"}
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsList;
