import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  UsersIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";
import type {
  Role,
  Permission,
  UserRole,
  NewRole,
  NewUserRoleAssignment,
} from "./types";
import RolesList from "./user-roles/RolesList";
import PermissionsList from "./user-roles/PermissionsList";
import UserRoleAssignments from "./user-roles/UserRoleAssignments";

// Sample permissions data
const defaultPermissions: Permission[] = [
  {
    id: "perm1",
    name: "View Patient Records",
    description: "Ability to view patient medical records",
    category: "Clinical",
    isActive: true,
  },
  {
    id: "perm2",
    name: "Edit Patient Records",
    description: "Ability to edit patient medical records",
    category: "Clinical",
    isActive: true,
  },
  {
    id: "perm3",
    name: "Prescribe Medications",
    description: "Ability to prescribe medications to patients",
    category: "Clinical",
    isActive: true,
  },
  {
    id: "perm4",
    name: "View Financial Data",
    description: "Ability to view financial and billing information",
    category: "Administrative",
    isActive: true,
  },
  {
    id: "perm5",
    name: "Edit Financial Data",
    description: "Ability to edit financial and billing information",
    category: "Administrative",
    isActive: true,
  },
  {
    id: "perm6",
    name: "Manage Users",
    description: "Ability to create, edit, and delete users",
    category: "System",
    isActive: true,
  },
  {
    id: "perm7",
    name: "Manage Roles",
    description: "Ability to create, edit, and delete roles",
    category: "System",
    isActive: true,
  },
  {
    id: "perm8",
    name: "View System Logs",
    description: "Ability to view system audit logs",
    category: "System",
    isActive: true,
  },
  {
    id: "perm9",
    name: "Manage Department",
    description: "Ability to manage department settings and staff",
    category: "Administrative",
    isActive: true,
  },
  {
    id: "perm10",
    name: "Schedule Appointments",
    description: "Ability to schedule and manage appointments",
    category: "Clinical",
    isActive: true,
  },
];

// Sample roles data
const defaultRoles: Role[] = [
  {
    id: "role1",
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: defaultPermissions,
    isSystemRole: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    status: "Active",
  },
  {
    id: "role2",
    name: "Physician",
    description: "Clinical permissions for physicians",
    permissions: defaultPermissions.filter((p) =>
      ["perm1", "perm2", "perm3", "perm10"].includes(p.id)
    ),
    isSystemRole: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    status: "Active",
  },
  {
    id: "role3",
    name: "Nurse",
    description: "Clinical permissions for nursing staff",
    permissions: defaultPermissions.filter((p) =>
      ["perm1", "perm2", "perm10"].includes(p.id)
    ),
    isSystemRole: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    status: "Active",
  },
  {
    id: "role4",
    name: "Billing Staff",
    description: "Financial and administrative permissions",
    permissions: defaultPermissions.filter((p) =>
      ["perm1", "perm4", "perm5"].includes(p.id)
    ),
    isSystemRole: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    status: "Active",
  },
  {
    id: "role5",
    name: "Department Manager",
    description: "Department management permissions",
    permissions: defaultPermissions.filter((p) =>
      ["perm1", "perm2", "perm4", "perm9", "perm10"].includes(p.id)
    ),
    isSystemRole: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    status: "Active",
  },
];

// Sample user data
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
  { id: "user5", name: "Dr. Maria Garcia", email: "maria.garcia@hospital.com" },
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

// Sample user role assignments
const defaultUserRoles: UserRole[] = [
  {
    id: "ur1",
    userId: "user1",
    userName: "Dr. John Smith",
    userEmail: "john.smith@hospital.com",
    role: defaultRoles[1], // Physician
    assignedAt: "2023-01-15",
    assignedBy: "Admin User",
    status: "Active",
  },
  {
    id: "ur2",
    userId: "user2",
    userName: "Nurse Jane Doe",
    userEmail: "jane.doe@hospital.com",
    role: defaultRoles[2], // Nurse
    assignedAt: "2023-02-01",
    assignedBy: "Admin User",
    status: "Active",
  },
  {
    id: "ur3",
    userId: "user3",
    userName: "Admin Sarah Johnson",
    userEmail: "sarah.johnson@hospital.com",
    role: defaultRoles[0], // Administrator
    assignedAt: "2023-01-05",
    assignedBy: "System",
    status: "Active",
  },
  {
    id: "ur4",
    userId: "user4",
    userName: "Robert Williams",
    userEmail: "robert.williams@hospital.com",
    role: defaultRoles[3], // Billing Staff
    assignedAt: "2023-03-10",
    assignedBy: "Admin User",
    status: "Active",
  },
  {
    id: "ur5",
    userId: "user5",
    userName: "Dr. Maria Garcia",
    userEmail: "maria.garcia@hospital.com",
    role: defaultRoles[4], // Department Manager
    assignedAt: "2023-02-15",
    assignedBy: "Admin User",
    status: "Active",
  },
];

const tabItems = [
  {
    name: "Roles",
    icon: ShieldCheckIcon,
  },
  {
    name: "Permissions",
    icon: UsersIcon,
  },
  {
    name: "User Assignments",
    icon: UserCircleIcon,
  },
];

const UserRoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [permissions, setPermissions] =
    useState<Permission[]>(defaultPermissions);
  const [userRoles, setUserRoles] = useState<UserRole[]>(defaultUserRoles);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Helper function to find a user by ID
  const findUserById = (userId: string) => {
    return sampleUsers.find((user) => user.id === userId);
  };

  // Handler to add a new role
  const handleAddRole = (newRole: NewRole) => {
    const role: Role = {
      id: `role${roles.length + 1}`,
      name: newRole.name,
      description: newRole.description,
      permissions: permissions.filter((p) =>
        newRole.permissions.includes(p.id)
      ),
      isSystemRole: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: newRole.status,
    };

    setRoles([...roles, role]);
  };

  // Handler to update a role
  const handleUpdateRole = (updatedRole: Role) => {
    // Make sure updatedAt is updated
    const now = new Date().toISOString();
    const roleWithTimestamp = {
      ...updatedRole,
      updatedAt: now,
    };

    setRoles(
      roles.map((role) =>
        role.id === updatedRole.id ? roleWithTimestamp : role
      )
    );

    // Also update any user role assignments that have this role
    setUserRoles(
      userRoles.map((userRole) =>
        userRole.role.id === updatedRole.id
          ? { ...userRole, role: roleWithTimestamp }
          : userRole
      )
    );
  };

  // Handler to delete a role
  const handleDeleteRole = (roleId: string) => {
    // Don't allow deleting system roles
    const roleToDelete = roles.find((r) => r.id === roleId);
    if (!roleToDelete) {
      alert("Role not found.");
      return;
    }

    if (roleToDelete.isSystemRole) {
      alert("System roles cannot be deleted.");
      return;
    }

    // Check if any users have this role assigned
    const hasAssignments = userRoles.some((ur) => ur.role.id === roleId);
    if (hasAssignments) {
      alert(
        "Cannot delete a role that is assigned to users. Please remove all assignments first."
      );
      return;
    }

    setRoles(roles.filter((role) => role.id !== roleId));
  };

  // Handler to add a new permission
  const handleAddPermission = (permission: Permission) => {
    const newPermission = {
      ...permission,
      id: `perm${permissions.length + 1}`,
    };
    setPermissions([...permissions, newPermission]);
  };

  // Handler to update a permission
  const handleUpdatePermission = (updatedPermission: Permission) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === updatedPermission.id ? updatedPermission : permission
      )
    );

    // Update roles that have this permission
    setRoles(
      roles.map((role) => {
        const hasPermission = role.permissions.some(
          (p) => p.id === updatedPermission.id
        );
        if (hasPermission) {
          return {
            ...role,
            permissions: role.permissions.map((p) =>
              p.id === updatedPermission.id ? updatedPermission : p
            ),
            updatedAt: new Date().toISOString(), // Update the role's timestamp
          };
        }
        return role;
      })
    );
  };

  // Handler to delete a permission
  const handleDeletePermission = (permissionId: string) => {
    // Check if the permission exists
    const permissionToDelete = permissions.find((p) => p.id === permissionId);
    if (!permissionToDelete) {
      alert("Permission not found.");
      return;
    }

    // Check if any roles use this permission
    const isUsed = roles.some((role) =>
      role.permissions.some((p) => p.id === permissionId)
    );

    if (isUsed) {
      alert(
        "Cannot delete a permission that is used by one or more roles. Please remove it from all roles first."
      );
      return;
    }

    setPermissions(permissions.filter((p) => p.id !== permissionId));
  };

  // Handler to assign a role to a user
  const handleAssignRole = (assignment: NewUserRoleAssignment) => {
    // Check if role exists
    const role = roles.find((r) => r.id === assignment.roleId);
    if (!role) {
      alert("Selected role not found");
      return;
    }

    // Find user in the sample data
    const user = findUserById(assignment.userId);
    if (!user) {
      alert("Selected user not found");
      return;
    }

    // Check if this user already has this role
    const hasRole = userRoles.some(
      (ur) =>
        ur.userId === assignment.userId && ur.role.id === assignment.roleId
    );

    if (hasRole) {
      alert("This user already has the selected role.");
      return;
    }

    const newUserRole: UserRole = {
      id: `ur${userRoles.length + 1}`,
      userId: assignment.userId,
      userName: user.name,
      userEmail: user.email,
      role: role,
      assignedAt: new Date().toISOString(),
      assignedBy: "Current User", // In a real system, use the current user's name
      expiresAt: assignment.expiresAt,
      status: "Active",
    };

    setUserRoles([...userRoles, newUserRole]);
  };

  // Handler to update a user role assignment
  const handleUpdateUserRole = (updatedUserRole: UserRole) => {
    // Add updatedAt timestamp if needed
    const updatedAssignment = {
      ...updatedUserRole,
      updatedAt: new Date().toISOString(),
    };

    setUserRoles(
      userRoles.map((ur) =>
        ur.id === updatedUserRole.id ? updatedAssignment : ur
      )
    );
  };

  // Handler to remove a role from a user
  const handleRemoveUserRole = (userRoleId: string) => {
    // Check if the user role exists
    const userRoleToRemove = userRoles.find((ur) => ur.id === userRoleId);
    if (!userRoleToRemove) {
      alert("User role assignment not found.");
      return;
    }

    setUserRoles(userRoles.filter((ur) => ur.id !== userRoleId));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Tab.Group
        selectedIndex={selectedTabIndex}
        onChange={setSelectedTabIndex}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          {tabItems.map((item) => (
            <Tab
              key={item.name}
              className={({ selected }) =>
                cn(
                  "w-full py-2.5 text-sm font-medium leading-5 rounded-lg flex items-center justify-center",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-primary-400 ring-opacity-60",
                  selected
                    ? "bg-white dark:bg-gray-700 shadow text-primary"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.50] dark:hover:bg-gray-700/[0.50] hover:text-gray-700"
                )
              }
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-primary-400 ring-opacity-60">
            <RolesList
              roles={roles}
              permissions={permissions}
              onAddRole={handleAddRole}
              onUpdateRole={handleUpdateRole}
              onDeleteRole={handleDeleteRole}
            />
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-primary-400 ring-opacity-60">
            <PermissionsList
              permissions={permissions}
              onAddPermission={handleAddPermission}
              onUpdatePermission={handleUpdatePermission}
              onDeletePermission={handleDeletePermission}
            />
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-primary-400 ring-opacity-60">
            <UserRoleAssignments
              userRoles={userRoles}
              roles={roles}
              onAssignRole={handleAssignRole}
              onUpdateUserRole={handleUpdateUserRole}
              onRemoveUserRole={handleRemoveUserRole}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default UserRoleManagement;
