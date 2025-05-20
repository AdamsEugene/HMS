import { useState } from "react";
import {
  UserCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { UserRole, Role, NewUserRoleAssignment } from "../types";

interface UserRoleAssignmentsProps {
  userRoles: UserRole[];
  roles: Role[];
  onAssignRole: (assignment: NewUserRoleAssignment) => void;
  onUpdateUserRole: (userRole: UserRole) => void;
  onRemoveUserRole: (userRoleId: string) => void;
}

const UserRoleAssignments: React.FC<UserRoleAssignmentsProps> = ({
  userRoles,
  roles,
  onAssignRole,
  onUpdateUserRole,
  onRemoveUserRole,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserRole, setEditingUserRole] = useState<UserRole | null>(null);
  const [newAssignment, setNewAssignment] = useState<NewUserRoleAssignment>({
    userId: "",
    roleId: roles.length > 0 ? roles[0].id : "",
  });

  // Sample users for the demo - in a real app, this would come from an API
  const sampleUsers = [
    { id: "user1", name: "Dr. John Smith", email: "john.smith@hospital.com" },
    { id: "user2", name: "Nurse Jane Doe", email: "jane.doe@hospital.com" },
    {
      id: "user3",
      name: "Admin Sarah Johnson",
      email: "sarah.johnson@hospital.com",
    },
    {
      id: "user4",
      name: "Robert Williams",
      email: "robert.williams@hospital.com",
    },
    {
      id: "user5",
      name: "Dr. Maria Garcia",
      email: "maria.garcia@hospital.com",
    },
    {
      id: "user6",
      name: "Tech Support Alan Johnson",
      email: "alan.johnson@hospital.com",
    },
    {
      id: "user7",
      name: "Receptionist Lisa Chen",
      email: "lisa.chen@hospital.com",
    },
    {
      id: "user8",
      name: "Pharmacist David Miller",
      email: "david.miller@hospital.com",
    },
  ];

  const handleOpenModal = (userRole?: UserRole) => {
    if (userRole) {
      setEditingUserRole(userRole);
      setNewAssignment({
        userId: userRole.userId,
        roleId: userRole.role.id,
        expiresAt: userRole.expiresAt,
      });
    } else {
      setEditingUserRole(null);
      // Find the first user that doesn't have all roles assigned
      const firstAvailableUser = sampleUsers.find((user) =>
        roles.some((role) => !userHasAssignedRole(user.id, role.id))
      );

      // Find the first role that the selected user doesn't have
      const firstAvailableRole = roles.find(
        (role) =>
          firstAvailableUser &&
          !userHasAssignedRole(firstAvailableUser.id, role.id)
      );

      setNewAssignment({
        userId: firstAvailableUser?.id || sampleUsers[0]?.id || "",
        roleId: firstAvailableRole?.id || roles[0]?.id || "",
        expiresAt: undefined,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserRole(null);
  };

  const handleSaveAssignment = () => {
    if (editingUserRole) {
      const role = roles.find((r) => r.id === newAssignment.roleId);
      if (!role) {
        alert("Selected role not found");
        return;
      }

      const updatedUserRole: UserRole = {
        ...editingUserRole,
        role: role,
        expiresAt: newAssignment.expiresAt,
      };
      onUpdateUserRole(updatedUserRole);
    } else {
      // For new assignments, validate that the user doesn't already have the role
      if (userHasAssignedRole(newAssignment.userId, newAssignment.roleId)) {
        alert("This user already has the selected role.");
        return;
      }
      onAssignRole(newAssignment);
    }
    handleCloseModal();
  };

  const handleRemoveConfirm = (userRoleId: string) => {
    if (
      window.confirm("Are you sure you want to remove this role assignment?")
    ) {
      onRemoveUserRole(userRoleId);
    }
  };

  // Group user roles by role for display
  const groupedUserRoles = userRoles.reduce(
    (groups, userRole) => {
      const roleName = userRole.role.name;
      if (!groups[roleName]) {
        groups[roleName] = [];
      }
      groups[roleName].push(userRole);
      return groups;
    },
    {} as Record<string, UserRole[]>
  );

  // Check if a user already has a role assigned to prevent duplicates
  const userHasAssignedRole = (userId: string, roleId: string) => {
    return userRoles.some(
      (ur) => ur.userId === userId && ur.role.id === roleId
    );
  };

  // Check if any roles are available for assignment to a user
  const hasAvailableRolesForUser = (userId: string) => {
    return roles.some((role) => !userHasAssignedRole(userId, role.id));
  };

  // Check if there are any available role assignments possible
  const hasAvailableAssignments = () => {
    return sampleUsers.some((user) => hasAvailableRolesForUser(user.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <UserCircleIcon className="h-6 w-6 text-primary mr-2" />
          User Role Assignments
        </h2>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => handleOpenModal()}
          disabled={!hasAvailableAssignments()}
          title={
            !hasAvailableAssignments()
              ? "All users have all available roles"
              : ""
          }
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Assign Role
        </button>
      </div>

      {Object.entries(groupedUserRoles).length > 0 ? (
        Object.entries(groupedUserRoles).map(([roleName, assignments]) => (
          <div
            key={roleName}
            className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md mb-6"
          >
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex items-center">
              <UserGroupIcon className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {roleName} ({assignments.length})
              </h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {assignments.map((userRole) => (
                <li key={userRole.id}>
                  <div className="px-4 py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white">
                            {userRole.userName}
                          </h4>
                          <span
                            className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userRole.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : userRole.status === "Suspended"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            }`}
                          >
                            {userRole.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {userRole.userEmail}
                        </p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            Assigned:{" "}
                            {new Date(userRole.assignedAt).toLocaleDateString()}
                          </span>
                          {userRole.expiresAt && (
                            <span className="ml-3">
                              Expires:{" "}
                              {new Date(
                                userRole.expiresAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                          <span className="ml-3">
                            By: {userRole.assignedBy}
                          </span>
                        </div>
                      </div>
                      <div className="flex ml-4 space-x-2">
                        <button
                          type="button"
                          className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                          onClick={() => handleOpenModal(userRole)}
                          aria-label={`Edit role assignment for ${userRole.userName}`}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                          onClick={() => handleRemoveConfirm(userRole.id)}
                          aria-label={`Remove role assignment for ${userRole.userName}`}
                          disabled={userRole.role.isSystemRole}
                          title={
                            userRole.role.isSystemRole
                              ? "System role assignments cannot be removed"
                              : ""
                          }
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
        ))
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          <UserCircleIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <p>No role assignments found</p>
          <p className="text-sm mt-1">
            Assign roles to users to manage their access to the system
          </p>
        </div>
      )}

      {/* Add/Edit Role Assignment Modal */}
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
                        {editingUserRole
                          ? `Edit Role for ${editingUserRole.userName}`
                          : "Assign Role to User"}
                      </h3>
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={handleCloseModal}
                        aria-label="Close modal"
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {!editingUserRole && (
                        <div>
                          <label
                            htmlFor="user-select"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            User <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="user-select"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:text-white"
                            value={newAssignment.userId}
                            onChange={(e) => {
                              const userId = e.target.value;
                              // Find the first role that the selected user doesn't have
                              const firstAvailableRole = roles.find(
                                (role) => !userHasAssignedRole(userId, role.id)
                              );

                              setNewAssignment({
                                ...newAssignment,
                                userId,
                                roleId:
                                  firstAvailableRole?.id || roles[0]?.id || "",
                              });
                            }}
                            required
                          >
                            {sampleUsers
                              .filter(
                                (user) =>
                                  hasAvailableRolesForUser(user.id) ||
                                  (editingUserRole &&
                                    user.id ===
                                      (editingUserRole as UserRole).userId)
                              )
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>
                          {sampleUsers.filter((user) =>
                            hasAvailableRolesForUser(user.id)
                          ).length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                              All users have all available roles.
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="role-select"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="role-select"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:text-white"
                          value={newAssignment.roleId}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              roleId: e.target.value,
                            })
                          }
                          required
                        >
                          {roles
                            .filter((role) =>
                              editingUserRole
                                ? role.id === editingUserRole.role.id ||
                                  !userHasAssignedRole(
                                    newAssignment.userId,
                                    role.id
                                  )
                                : !userHasAssignedRole(
                                    newAssignment.userId,
                                    role.id
                                  )
                            )
                            .map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                        </select>
                        {roles.length === 0 && (
                          <p className="mt-1 text-sm text-red-500">
                            No roles available. Please create roles first.
                          </p>
                        )}
                        {roles.length > 0 &&
                          roles.filter((role) =>
                            editingUserRole
                              ? role.id === editingUserRole.role.id ||
                                !userHasAssignedRole(
                                  newAssignment.userId,
                                  role.id
                                )
                              : !userHasAssignedRole(
                                  newAssignment.userId,
                                  role.id
                                )
                          ).length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                              This user already has all available roles.
                            </p>
                          )}
                      </div>

                      <div>
                        <label
                          htmlFor="expires-at"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="date"
                          id="expires-at"
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          value={newAssignment.expiresAt?.split("T")[0] || ""}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              expiresAt: e.target.value
                                ? new Date(e.target.value).toISOString()
                                : undefined,
                            })
                          }
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Leave blank for permanent assignment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn-primary w-full sm:w-auto sm:ml-3"
                  onClick={handleSaveAssignment}
                  disabled={!newAssignment.userId || !newAssignment.roleId}
                >
                  {editingUserRole ? "Update Assignment" : "Assign Role"}
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

export default UserRoleAssignments;
