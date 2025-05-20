import { useState, useEffect } from "react";
import type { Department } from "../types";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  DocumentMagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface DepartmentListProps {
  departments: Department[];
  selectDepartment: (department: Department) => void;
  showAddForm: () => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  selectDepartment,
  showAddForm,
}) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [filteredDepartments, setFilteredDepartments] =
    useState<Department[]>(departments);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique department types for filter dropdown
  const departmentTypes = [
    "All",
    ...Array.from(new Set(departments.map((dept) => dept.type))),
  ];

  // Filter departments based on search and filters
  useEffect(() => {
    const result = departments.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.location &&
          dept.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dept.email &&
          dept.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || dept.status === statusFilter;

      const matchesType = typeFilter === "All" || dept.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredDepartments(result);
  }, [departments, searchTerm, statusFilter, typeFilter]);

  // Handle clearing filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setTypeFilter("All");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <UserGroupIcon className="h-6 w-6 mr-2 text-primary" />
            Department Management
          </h2>
          <button
            type="button"
            className="btn-primary text-sm flex items-center"
            onClick={showAddForm}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Department
          </button>
        </div>

        {/* Search and filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 form-input"
                placeholder="Search departments by name, description, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            <div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filters
                {(statusFilter !== "All" || typeFilter !== "All") && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
                    Active
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-full sm:w-auto">
                    <label
                      htmlFor="status-filter"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status-filter"
                      className="form-select w-full"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Under Construction">
                        Under Construction
                      </option>
                    </select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <label
                      htmlFor="type-filter"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Type
                    </label>
                    <select
                      id="type-filter"
                      className="form-select w-full"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      {departmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type === "All" ? "All Types" : type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Departments list */}
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                >
                  Staff
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition duration-150"
                    onClick={() => selectDepartment(dept)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {dept.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                            {dept.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {dept.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {dept.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dept.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : dept.status === "Inactive"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {dept.staff.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-primary hover:text-primary-dark transition duration-150"
                        aria-label={`View details for ${dept.name}`}
                        title={`View details for ${dept.name}`}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                        <span className="sr-only">View details</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <DocumentMagnifyingGlassIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-base text-gray-900 dark:text-white font-medium mb-1">
                        No departments found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm ||
                        statusFilter !== "All" ||
                        typeFilter !== "All"
                          ? "Try adjusting your search or filters to find what you're looking for."
                          : "Get started by adding a new department."}
                      </p>
                      {(searchTerm ||
                        statusFilter !== "All" ||
                        typeFilter !== "All") && (
                        <button
                          type="button"
                          className="btn-secondary text-sm"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;
