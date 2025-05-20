import { useState } from "react";
import {
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Role, Permission, NewRole } from "../types";

interface RolesListProps {
  roles: Role[];
  permissions: Permission[];
  onAddRole: (role: NewRole) => void;
  onUpdateRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
}

const RolesList: React.FC<RolesListProps> = ({
  roles,
  permissions,
  onAddRole,
  onUpdateRole,
  onDeleteRole,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<NewRole>({
    name: "",
    description: "",
    permissions: [],
    status: "Active",
  });

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setNewRole({
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((p) => p.id),
        status: role.status,
      });
    } else {
      setEditingRole(null);
      setNewRole({
        name: "",
        description: "",
        permissions: [],
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSaveRole = () => {
    if (editingRole) {
      const updatedRole = {
        ...editingRole,
        name: newRole.name,
        description: newRole.description,
        permissions: permissions.filter((p) =>
          newRole.permissions.includes(p.id)
        ),
        updatedAt: new Date().toISOString(),
        status: newRole.status,
      };
      onUpdateRole(updatedRole);
    } else {
      onAddRole(newRole);
    }
    handleCloseModal();
  };

  const handleDeleteConfirm = (roleId: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      onDeleteRole(roleId);
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    if (newRole.permissions.includes(permissionId)) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter((id) => id !== permissionId),
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId],
      });
    }
  };

  // Group permissions by category for the modal
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
          <ShieldCheckIcon className="h-6 w-6 text-primary mr-2" />
          System Roles
        </h2>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => handleOpenModal()}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add New Role
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {roles.map((role) => (
            <li key={role.id}>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {role.name}
                      </h3>
                      <span
                        className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          role.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {role.status}
                      </span>
                      {role.isSystemRole && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          System Role
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {role.description}
                    </p>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Permissions:
                      </h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <span
                            key={permission.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
                          >
                            {permission.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex ml-4 space-x-2">
                    <button
                      type="button"
                      className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                      onClick={() => handleOpenModal(role)}
                      aria-label={`Edit ${role.name}`}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    {!role.isSystemRole && (
                      <button
                        type="button"
                        className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                        onClick={() => handleDeleteConfirm(role.id)}
                        aria-label={`Delete ${role.name}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add/Edit Role Modal */}
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
                        {editingRole ? "Edit Role" : "Add New Role"}
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
                          htmlFor="role-name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="role-name"
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          value={newRole.name}
                          onChange={(e) =>
                            setNewRole({ ...newRole, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="role-description"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="role-description"
                          rows={3}
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          value={newRole.description}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="role-status"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Status
                        </label>
                        <select
                          id="role-status"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:text-white"
                          value={newRole.status}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              status: e.target.value as "Active" | "Inactive",
                            })
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Permissions
                        </label>

                        <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3">
                          {Object.entries(groupedPermissions).map(
                            ([category, perms]) => (
                              <div key={category} className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  {category}
                                </h4>
                                <div className="space-y-2">
                                  {perms.map((permission) => (
                                    <div
                                      key={permission.id}
                                      className="flex items-start"
                                    >
                                      <div className="flex items-center h-5">
                                        <input
                                          id={`permission-${permission.id}`}
                                          type="checkbox"
                                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded"
                                          checked={newRole.permissions.includes(
                                            permission.id
                                          )}
                                          onChange={() =>
                                            handlePermissionChange(
                                              permission.id
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="ml-3 text-sm">
                                        <label
                                          htmlFor={`permission-${permission.id}`}
                                          className="font-medium text-gray-700 dark:text-gray-300"
                                        >
                                          {permission.name}
                                        </label>
                                        <p className="text-gray-500 dark:text-gray-400">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn-primary w-full sm:w-auto sm:ml-3"
                  onClick={handleSaveRole}
                  disabled={
                    !newRole.name ||
                    !newRole.description ||
                    newRole.permissions.length === 0
                  }
                >
                  {editingRole ? "Update Role" : "Create Role"}
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

export default RolesList;
