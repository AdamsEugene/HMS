import { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { MedicalSupply, NewMedicalSupply } from "../types";
import { MedicalSupplyFormModal, ConfirmationModal } from "./index";
import { cn } from "../../../utils/cn";

interface MedicalSuppliesManagerProps {
  medicalSupplies: MedicalSupply[];
  updateMedicalSupplies: (supplies: MedicalSupply[]) => void;
}

type SearchFieldType = "name" | "category" | "code" | "all";

const MedicalSuppliesManager: React.FC<MedicalSuppliesManagerProps> = ({
  medicalSupplies,
  updateMedicalSupplies,
}) => {
  // State for the medical supplies
  const [supplies, setSupplies] = useState<MedicalSupply[]>(
    medicalSupplies || []
  );

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<SearchFieldType>("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<MedicalSupply | null>(
    null
  );

  // Filtered supplies based on search
  const filteredSupplies = useMemo(() => {
    if (!searchTerm) return supplies;

    return supplies.filter((supply) => {
      const term = searchTerm.toLowerCase();

      switch (searchField) {
        case "name":
          return supply.name.toLowerCase().includes(term);
        case "category":
          return supply.category.toLowerCase().includes(term);
        case "code":
          return supply.code.toLowerCase().includes(term);
        case "all":
        default:
          return (
            supply.name.toLowerCase().includes(term) ||
            supply.category.toLowerCase().includes(term) ||
            supply.code.toLowerCase().includes(term) ||
            supply.description.toLowerCase().includes(term)
          );
      }
    });
  }, [supplies, searchTerm, searchField]);

  // Handle adding a new medical supply
  const handleAddSupply = (newSupply: NewMedicalSupply) => {
    const supplyToAdd: MedicalSupply = {
      ...newSupply,
      id: `supply-${Date.now()}`, // Generate a unique ID
    };

    const updatedSupplies = [...supplies, supplyToAdd];
    setSupplies(updatedSupplies);
    updateMedicalSupplies(updatedSupplies);
    setIsAddModalOpen(false);
  };

  // Handle updating an existing medical supply
  const handleUpdateSupply = (updatedSupply: NewMedicalSupply) => {
    if (!selectedSupply) return;

    const supplyToUpdate: MedicalSupply = {
      ...updatedSupply,
      id: selectedSupply.id,
    };

    const updatedSupplies = supplies.map((supply) =>
      supply.id === selectedSupply.id ? supplyToUpdate : supply
    );

    setSupplies(updatedSupplies);
    updateMedicalSupplies(updatedSupplies);
    setIsEditModalOpen(false);
    setSelectedSupply(null);
  };

  // Handle deleting a medical supply
  const handleDeleteSupply = () => {
    if (!selectedSupply) return;

    const updatedSupplies = supplies.filter(
      (supply) => supply.id !== selectedSupply.id
    );
    setSupplies(updatedSupplies);
    updateMedicalSupplies(updatedSupplies);
    setIsDeleteModalOpen(false);
    setSelectedSupply(null);
  };

  // Open edit modal with the selected supply
  const openEditModal = (supply: MedicalSupply) => {
    setSelectedSupply(supply);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal with the selected supply
  const openDeleteModal = (supply: MedicalSupply) => {
    setSelectedSupply(supply);
    setIsDeleteModalOpen(true);
  };

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value as SearchFieldType);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Search and Add header */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              placeholder="Search supplies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>

          <div className="relative">
            <select
              value={searchField}
              onChange={handleSearchFieldChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              aria-label="Search field"
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="code">Code</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Medical Supply
        </button>
      </div>

      {/* Medical Supplies table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Unit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Properties
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSupplies.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No medical supplies found. Add a new medical supply or adjust
                  your search.
                </td>
              </tr>
            ) : (
              filteredSupplies.map((supply) => (
                <tr
                  key={supply.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {supply.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {supply.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {supply.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {supply.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        supply.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : supply.status === "Inactive"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      )}
                    >
                      {supply.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {[
                      supply.reusable && "Reusable",
                      supply.sterile && "Sterile",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(supply)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Edit {supply.name}</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(supply)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Delete {supply.name}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Medical Supply Modal */}
      <MedicalSupplyFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSupply}
      />

      {/* Edit Medical Supply Modal */}
      <MedicalSupplyFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSupply(null);
        }}
        onSave={handleUpdateSupply}
        initialSupply={selectedSupply || undefined}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSupply(null);
        }}
        onConfirm={handleDeleteSupply}
        title="Delete Medical Supply"
        message={`Are you sure you want to delete ${selectedSupply?.name}? This action cannot be undone.`}
        confirmButtonText="Delete"
        isDeleting={true}
      />
    </div>
  );
};

export default MedicalSuppliesManager;
