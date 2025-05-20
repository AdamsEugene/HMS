import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { PricingModel, NewPricingModel } from "../types";

interface PricingModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (model: NewPricingModel) => void;
  initialModel?: PricingModel;
  isEditing?: boolean;
}

// Define the allowed values for appliesTo
type AppliesToType = "Inpatient" | "Outpatient" | "Emergency" | "Procedures";

const defaultModel: NewPricingModel = {
  name: "",
  description: "",
  type: "Standard",
  active: true,
  defaultModel: false,
  appliesTo: ["Inpatient"],
  effectiveFrom: new Date().toISOString().split("T")[0],
};

const PricingModelFormModal: React.FC<PricingModelFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialModel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<NewPricingModel>(
    initialModel || defaultModel
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(initialModel || defaultModel);
      setErrors({});
    }
  }, [isOpen, initialModel]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === "markupPercentage" || name === "discountPercentage") {
      // Handle percentage fields as numbers
      const numValue = value === "" ? undefined : parseFloat(value);
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAppliesToChange = (value: AppliesToType) => {
    const currentAppliesTo = [...formData.appliesTo];

    if (currentAppliesTo.includes(value)) {
      // Remove if already selected
      setFormData({
        ...formData,
        appliesTo: currentAppliesTo.filter((item) => item !== value),
      });
    } else {
      // Add if not selected
      setFormData({
        ...formData,
        appliesTo: [...currentAppliesTo, value],
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.appliesTo.length === 0) {
      newErrors.appliesTo = "Select at least one application area";
    }

    if (!formData.effectiveFrom) {
      newErrors.effectiveFrom = "Effective from date is required";
    }

    if (
      formData.effectiveTo &&
      new Date(formData.effectiveTo) <= new Date(formData.effectiveFrom)
    ) {
      newErrors.effectiveTo = "End date must be after start date";
    }

    // Validate percentages are valid numbers
    if (
      formData.markupPercentage !== undefined &&
      (isNaN(Number(formData.markupPercentage)) ||
        formData.markupPercentage < 0 ||
        formData.markupPercentage > 1000)
    ) {
      newErrors.markupPercentage = "Must be a valid number between 0-1000";
    }

    if (
      formData.discountPercentage !== undefined &&
      (isNaN(Number(formData.discountPercentage)) ||
        formData.discountPercentage < 0 ||
        formData.discountPercentage > 100)
    ) {
      newErrors.discountPercentage = "Must be a valid number between 0-100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  // Array of allowed options for appliesTo
  const appliesToOptions: AppliesToType[] = [
    "Inpatient",
    "Outpatient",
    "Emergency",
    "Procedures",
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {isEditing ? "Edit Pricing Model" : "Add New Pricing Model"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Name */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Model Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm
                            ${
                              errors.name
                                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                            } dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Type */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Model Type <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Discounted">Discounted</option>
                          <option value="Special">Special</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={2}
                          value={formData.description}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm
                            ${
                              errors.description
                                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                            } dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="active"
                            name="active"
                            type="checkbox"
                            checked={formData.active}
                            onChange={handleInputChange}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="active"
                            className="font-medium text-gray-700 dark:text-gray-300"
                          >
                            Active
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Enable to make this pricing model available
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Default Model */}
                    <div className="sm:col-span-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="defaultModel"
                            name="defaultModel"
                            type="checkbox"
                            checked={formData.defaultModel}
                            onChange={handleInputChange}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="defaultModel"
                            className="font-medium text-gray-700 dark:text-gray-300"
                          >
                            Default Model
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Make this the default pricing model
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Applies To */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Applies To <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {appliesToOptions.map((option) => (
                          <div key={option} className="flex items-center">
                            <input
                              id={`applies-to-${option}`}
                              type="checkbox"
                              className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                              checked={formData.appliesTo.includes(option)}
                              onChange={() => handleAppliesToChange(option)}
                            />
                            <label
                              htmlFor={`applies-to-${option}`}
                              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.appliesTo && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.appliesTo}
                        </p>
                      )}
                    </div>

                    {/* Effective Dates */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="effectiveFrom"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Effective From <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="effectiveFrom"
                          id="effectiveFrom"
                          value={formData.effectiveFrom}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm
                            ${
                              errors.effectiveFrom
                                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                            } dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.effectiveFrom && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.effectiveFrom}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="effectiveTo"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Effective To{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="effectiveTo"
                          id="effectiveTo"
                          value={formData.effectiveTo || ""}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm
                            ${
                              errors.effectiveTo
                                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                            } dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.effectiveTo && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.effectiveTo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rate Adjustments */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="markupPercentage"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Markup Percentage{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          name="markupPercentage"
                          id="markupPercentage"
                          min="0"
                          max="1000"
                          step="0.1"
                          value={formData.markupPercentage || ""}
                          onChange={handleInputChange}
                          disabled={formData.discountPercentage !== undefined}
                          className={`block w-full rounded-md shadow-sm sm:text-sm pr-12
                            ${
                              errors.markupPercentage
                                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                            } ${
                              formData.discountPercentage !== undefined
                                ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                                : "dark:bg-gray-700"
                            } dark:text-white`}
                          placeholder="0.0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                            %
                          </span>
                        </div>
                        {errors.markupPercentage && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.markupPercentage}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="discountPercentage"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Discount Percentage{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          name="discountPercentage"
                          id="discountPercentage"
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.discountPercentage || ""}
                          onChange={handleInputChange}
                          disabled={formData.markupPercentage !== undefined}
                          className={`block w-full rounded-md shadow-sm sm:text-sm pr-12
                            ${
                              errors.discountPercentage
                                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                            } ${
                              formData.markupPercentage !== undefined
                                ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                                : "dark:bg-gray-700"
                            } dark:text-white`}
                          placeholder="0.0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                            %
                          </span>
                        </div>
                        {errors.discountPercentage && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.discountPercentage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Notes <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes || ""}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                          placeholder="Additional information about this pricing model..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {isEditing ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PricingModelFormModal;
