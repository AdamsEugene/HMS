import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { PricingModel, NewPricingModel } from "../types";
import PricingModelFormModal from "./PricingModelFormModal";
import ConfirmationModal from "./ConfirmationModal";

interface PricingModelsManagerProps {
  pricingModels: PricingModel[];
  updatePricingModels: (models: PricingModel[]) => void;
}

const PricingModelsManager: React.FC<PricingModelsManagerProps> = ({
  pricingModels,
  updatePricingModels,
}) => {
  // State for models data with sample data if empty
  const [models, setModels] = useState<PricingModel[]>(
    pricingModels && pricingModels.length > 0
      ? pricingModels
      : [
          {
            id: "pm-1",
            name: "Standard Rate",
            description: "Default pricing for most patients",
            type: "Standard",
            active: true,
            defaultModel: true,
            appliesTo: ["Inpatient", "Outpatient"],
            effectiveFrom: "2023-01-01",
            markupPercentage: undefined,
            discountPercentage: undefined,
          },
          {
            id: "pm-2",
            name: "Insurance A",
            description: "Special rates for Insurance Provider A",
            type: "Insurance",
            active: true,
            defaultModel: false,
            appliesTo: ["Inpatient", "Outpatient", "Emergency"],
            effectiveFrom: "2023-01-01",
            markupPercentage: 15,
            discountPercentage: undefined,
          },
          {
            id: "pm-3",
            name: "Charity Program",
            description: "Discounted rates for charity cases",
            type: "Discounted",
            active: true,
            defaultModel: false,
            appliesTo: ["Inpatient", "Outpatient", "Procedures"],
            effectiveFrom: "2023-01-01",
            markupPercentage: undefined,
            discountPercentage: 30,
          },
        ]
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<PricingModel | null>(null);

  // Handle form submission to update models
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update both the parent state and the local state
    updatePricingModels(models);
    setIsSaved(true);

    // Reset saved message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Add new pricing model
  const handleAddModel = (newModel: NewPricingModel) => {
    const modelId = `pm-${Date.now()}`; // Generate a unique ID
    const modelToAdd: PricingModel = {
      ...newModel,
      id: modelId,
    };

    // If this is set as default, remove default flag from other models of same type
    const updatedModels = [...models];
    if (newModel.defaultModel) {
      updatedModels.forEach((model) => {
        if (model.type === newModel.type && model.id !== modelId) {
          model.defaultModel = false;
        }
      });
    }

    // Add the new model
    setModels([...updatedModels, modelToAdd]);
    setIsAddModalOpen(false);
  };

  // Edit existing pricing model
  const handleEditModel = (updatedModel: NewPricingModel) => {
    if (!selectedModel) return;

    // If this is set as default, remove default flag from other models of same type
    const updatedModels = models.map((model) => {
      if (model.id === selectedModel.id) {
        return { ...model, ...updatedModel };
      }

      if (
        updatedModel.defaultModel &&
        model.type === updatedModel.type &&
        model.id !== selectedModel.id
      ) {
        return { ...model, defaultModel: false };
      }

      return model;
    });

    setModels(updatedModels);
    setIsEditModalOpen(false);
    setSelectedModel(null);
  };

  // Delete pricing model
  const handleDeleteModel = () => {
    if (!selectedModel) return;

    const updatedModels = models.filter(
      (model) => model.id !== selectedModel.id
    );
    setModels(updatedModels);
    setIsDeleteModalOpen(false);
    setSelectedModel(null);
  };

  // Open edit modal
  const openEditModal = (model: PricingModel) => {
    setSelectedModel(model);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (model: PricingModel) => {
    setSelectedModel(model);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pricing Models
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure pricing models for patient billing and insurance
            reimbursement.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Model
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Pricing models table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          {models.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No pricing models configured. Click "Add Model" to create one.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Applies To
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Effective Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Rate Adjustment
                  </th>
                  <th
                    scope="col"
                    className="relative px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                {models.map((model) => (
                  <tr key={model.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {model.name}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1 max-w-xs truncate">
                        {model.description}
                      </div>
                      {model.defaultModel && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {model.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          model.active
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {model.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap gap-1">
                        {model.appliesTo.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        From:{" "}
                        {new Date(model.effectiveFrom).toLocaleDateString()}
                      </div>
                      {model.effectiveTo && (
                        <div>
                          To: {new Date(model.effectiveTo).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {model.markupPercentage !== undefined && (
                        <span className="text-amber-600 dark:text-amber-400">
                          +{model.markupPercentage}%
                        </span>
                      )}
                      {model.discountPercentage !== undefined && (
                        <span className="text-green-600 dark:text-green-400">
                          -{model.discountPercentage}%
                        </span>
                      )}
                      {model.markupPercentage === undefined &&
                        model.discountPercentage === undefined && (
                          <span className="text-gray-500 dark:text-gray-400">
                            Standard
                          </span>
                        )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2 justify-end">
                        <button
                          type="button"
                          className="text-primary hover:text-primary-dark"
                          onClick={() => openEditModal(model)}
                          aria-label={`Edit ${model.name}`}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(model)}
                          aria-label={`Delete ${model.name}`}
                          disabled={model.defaultModel}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Info box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400 dark:text-blue-300"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Default pricing models are applied automatically to new
                patients. Only one default model should be active for each type.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          {isSaved && (
            <div className="mr-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              Pricing models saved successfully
            </div>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Pricing Models
          </button>
        </div>
      </form>

      {/* Add Model Modal */}
      <PricingModelFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddModel}
        isEditing={false}
      />

      {/* Edit Model Modal */}
      {selectedModel && (
        <PricingModelFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedModel(null);
          }}
          onSave={handleEditModel}
          initialModel={selectedModel}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedModel && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedModel(null);
          }}
          onConfirm={handleDeleteModel}
          title="Delete Pricing Model"
          message={`Are you sure you want to delete the "${selectedModel.name}" pricing model? This action cannot be undone.`}
          confirmButtonText="Delete"
        />
      )}
    </div>
  );
};

export default PricingModelsManager;
