import { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { ProcedureCode, NewProcedureCode } from "../types";
import { ProcedureCodeFormModal, ConfirmationModal } from "./index";
import { cn } from "../../../utils/cn";

interface ProcedureCodesManagerProps {
  procedureCodes: ProcedureCode[];
  updateProcedureCodes: (codes: ProcedureCode[]) => void;
}

type SearchFieldType = "code" | "description" | "category" | "all";

const ProcedureCodesManager: React.FC<ProcedureCodesManagerProps> = ({
  procedureCodes,
  updateProcedureCodes,
}) => {
  // State for the procedure codes
  const [codes, setCodes] = useState<ProcedureCode[]>(procedureCodes || []);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<SearchFieldType>("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<ProcedureCode | null>(null);

  // Filtered codes based on search
  const filteredCodes = useMemo(() => {
    if (!searchTerm) return codes;

    return codes.filter((code) => {
      const term = searchTerm.toLowerCase();

      switch (searchField) {
        case "code":
          return code.code.toLowerCase().includes(term);
        case "description":
          return code.description.toLowerCase().includes(term);
        case "category":
          return code.category.toLowerCase().includes(term);
        case "all":
        default:
          return (
            code.code.toLowerCase().includes(term) ||
            code.description.toLowerCase().includes(term) ||
            code.category.toLowerCase().includes(term) ||
            code.version.toLowerCase().includes(term)
          );
      }
    });
  }, [codes, searchTerm, searchField]);

  // Handle adding a new procedure code
  const handleAddCode = (newCode: NewProcedureCode) => {
    const codeToAdd: ProcedureCode = {
      ...newCode,
      id: `proc-${Date.now()}`, // Generate a unique ID
    };

    const updatedCodes = [...codes, codeToAdd];
    setCodes(updatedCodes);
    updateProcedureCodes(updatedCodes);
    setIsAddModalOpen(false);
  };

  // Handle updating an existing procedure code
  const handleUpdateCode = (updatedCode: NewProcedureCode) => {
    if (!selectedCode) return;

    const codeToUpdate: ProcedureCode = {
      ...updatedCode,
      id: selectedCode.id,
    };

    const updatedCodes = codes.map((code) =>
      code.id === selectedCode.id ? codeToUpdate : code
    );

    setCodes(updatedCodes);
    updateProcedureCodes(updatedCodes);
    setIsEditModalOpen(false);
    setSelectedCode(null);
  };

  // Handle deleting a procedure code
  const handleDeleteCode = () => {
    if (!selectedCode) return;

    const updatedCodes = codes.filter((code) => code.id !== selectedCode.id);
    setCodes(updatedCodes);
    updateProcedureCodes(updatedCodes);
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };

  // Open edit modal with the selected code
  const openEditModal = (code: ProcedureCode) => {
    setSelectedCode(code);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal with the selected code
  const openDeleteModal = (code: ProcedureCode) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value as SearchFieldType);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search procedure codes..."
          />
        </div>

        <div className="flex-shrink-0 flex space-x-2">
          <select
            value={searchField}
            onChange={handleSearchFieldChange}
            className="block w-40 py-2 px-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            aria-label="Search field filter"
          >
            <option value="all">All Fields</option>
            <option value="code">Code</option>
            <option value="description">Description</option>
            <option value="category">Category</option>
          </select>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            Add New
          </button>
        </div>
      </div>

      {/* Procedure Codes Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
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
                Description
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
                Version
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
                Requires Consent
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCodes.length > 0 ? (
              filteredCodes.map((code) => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {code.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {code.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {code.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {code.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        code.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : code.status === "Inactive"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      )}
                    >
                      {code.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {code.requiresConsent ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button
                      onClick={() => openEditModal(code)}
                      className="text-primary hover:text-primary-dark transition-colors"
                      aria-label={`Edit ${code.code}`}
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(code)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label={`Delete ${code.code}`}
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {searchTerm
                    ? "No procedure codes match your search criteria."
                    : "No procedure codes available. Add your first one!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <ProcedureCodeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCode}
      />

      {/* Edit Modal */}
      {selectedCode && (
        <ProcedureCodeFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCode(null);
          }}
          onSave={handleUpdateCode}
          initialCode={selectedCode}
          isEditing
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedCode && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCode(null);
          }}
          onConfirm={handleDeleteCode}
          title="Delete Procedure Code"
          message={`Are you sure you want to delete the procedure code "${selectedCode.code}: ${selectedCode.description}"? This action cannot be undone.`}
          confirmButtonText="Delete"
          isDeleting
        />
      )}
    </div>
  );
};

export default ProcedureCodesManager;
