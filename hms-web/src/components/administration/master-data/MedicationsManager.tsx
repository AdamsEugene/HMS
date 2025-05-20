import { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Medication, NewMedication } from "../types";
import { MedicationFormModal, ConfirmationModal } from "./index";
import { cn } from "../../../utils/cn";

interface MedicationsManagerProps {
  medications: Medication[];
  updateMedications: (medications: Medication[]) => void;
}

type SearchFieldType = "name" | "genericName" | "drugClass" | "all";

const MedicationsManager: React.FC<MedicationsManagerProps> = ({
  medications,
  updateMedications,
}) => {
  // State for the medications
  const [meds, setMeds] = useState<Medication[]>(medications || []);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<SearchFieldType>("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  // Filtered medications based on search
  const filteredMedications = useMemo(() => {
    if (!searchTerm) return meds;

    return meds.filter((med) => {
      const term = searchTerm.toLowerCase();

      switch (searchField) {
        case "name":
          return med.name.toLowerCase().includes(term);
        case "genericName":
          return med.genericName.toLowerCase().includes(term);
        case "drugClass":
          return med.drugClass.toLowerCase().includes(term);
        case "all":
        default:
          return (
            med.name.toLowerCase().includes(term) ||
            med.genericName.toLowerCase().includes(term) ||
            med.drugClass.toLowerCase().includes(term) ||
            med.brandNames.some((brand) =>
              brand.toLowerCase().includes(term)
            ) ||
            med.code.toLowerCase().includes(term)
          );
      }
    });
  }, [meds, searchTerm, searchField]);

  // Handle adding a new medication
  const handleAddMedication = (newMed: NewMedication) => {
    const medToAdd: Medication = {
      ...newMed,
      id: `med-${Date.now()}`, // Generate a unique ID
    };

    const updatedMeds = [...meds, medToAdd];
    setMeds(updatedMeds);
    updateMedications(updatedMeds);
    setIsAddModalOpen(false);
  };

  // Handle updating an existing medication
  const handleUpdateMedication = (updatedMed: NewMedication) => {
    if (!selectedMedication) return;

    const medToUpdate: Medication = {
      ...updatedMed,
      id: selectedMedication.id,
    };

    const updatedMeds = meds.map((med) =>
      med.id === selectedMedication.id ? medToUpdate : med
    );

    setMeds(updatedMeds);
    updateMedications(updatedMeds);
    setIsEditModalOpen(false);
    setSelectedMedication(null);
  };

  // Handle deleting a medication
  const handleDeleteMedication = () => {
    if (!selectedMedication) return;

    const updatedMeds = meds.filter((med) => med.id !== selectedMedication.id);
    setMeds(updatedMeds);
    updateMedications(updatedMeds);
    setIsDeleteModalOpen(false);
    setSelectedMedication(null);
  };

  // Open edit modal with the selected medication
  const openEditModal = (med: Medication) => {
    setSelectedMedication(med);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal with the selected medication
  const openDeleteModal = (med: Medication) => {
    setSelectedMedication(med);
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
              placeholder="Search medications..."
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
              <option value="genericName">Generic Name</option>
              <option value="drugClass">Drug Class</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Medication
        </button>
      </div>

      {/* Medications table */}
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
                Generic Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Drug Class
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Formulation
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Strength
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
            {filteredMedications.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No medications found. Add a new medication or adjust your
                  search.
                </td>
              </tr>
            ) : (
              filteredMedications.map((med) => (
                <tr
                  key={med.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {med.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {med.genericName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {med.drugClass}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {med.formulation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {med.strength}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        med.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : med.status === "Inactive"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      )}
                    >
                      {med.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {[
                      med.controlled && "Controlled",
                      med.requiresPriorAuth && "Prior Auth",
                      med.special && "Special",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(med)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Edit {med.name}</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(med)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Delete {med.name}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Medication Modal */}
      <MedicationFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMedication}
      />

      {/* Edit Medication Modal */}
      <MedicationFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMedication(null);
        }}
        onSave={handleUpdateMedication}
        initialMedication={selectedMedication || undefined}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMedication(null);
        }}
        onConfirm={handleDeleteMedication}
        title="Delete Medication"
        message={`Are you sure you want to delete ${selectedMedication?.name}? This action cannot be undone.`}
        confirmButtonText="Delete"
        isDeleting={true}
      />
    </div>
  );
};

export default MedicationsManager;
