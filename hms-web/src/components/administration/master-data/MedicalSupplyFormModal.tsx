import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { MedicalSupply, NewMedicalSupply } from "../types";
import { cn } from "../../../utils/cn";

interface MedicalSupplyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supply: NewMedicalSupply) => void;
  initialSupply?: MedicalSupply;
  isEditing?: boolean;
}

const defaultSupply: NewMedicalSupply = {
  name: "",
  category: "",
  description: "",
  code: "",
  unit: "",
  reusable: false,
  sterile: false,
  status: "Active",
};

const MedicalSupplyFormModal: React.FC<MedicalSupplyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSupply,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<NewMedicalSupply>(defaultSupply);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSupply) {
      setFormData(initialSupply);
    } else {
      setFormData(defaultSupply);
    }
    setErrors({});
  }, [initialSupply, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSaving(true);
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error("Error saving medical supply:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const categoryOptions = [
    "Bandages & Dressings",
    "Catheters",
    "Diagnostic Supplies",
    "Disinfectants & Cleaning Supplies",
    "Disposable Garments",
    "Examination Supplies",
    "Laboratory Supplies",
    "Orthopaedic Supplies",
    "Respiratory Supplies",
    "Surgical Instruments",
    "Surgical Supplies",
    "Syringes & Needles",
    "Wound Care",
    "Other",
  ];

  const unitOptions = [
    "Each",
    "Box",
    "Case",
    "Pack",
    "Pair",
    "Roll",
    "Set",
    "Kit",
    "Bottle",
    "Tube",
    "Bag",
    "Box of 10",
    "Box of 50",
    "Box of 100",
    "Box of 1000",
    "Other",
  ];

  const statusOptions = ["Active", "Inactive", "Discontinued"];

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {isEditing
                      ? "Edit Medical Supply"
                      : "Add New Medical Supply"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                    aria-label="Close dialog"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.category
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      >
                        <option value="">Select a category</option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className={cn(
                        "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                        errors.description
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      )}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Code */}
                    <div>
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Supply Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="code"
                        id="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.code
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      />
                      {errors.code && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.code}
                        </p>
                      )}
                    </div>

                    {/* Unit */}
                    <div>
                      <label
                        htmlFor="unit"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Unit of Measure <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="unit"
                        id="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.unit
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      >
                        <option value="">Select a unit</option>
                        {unitOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.unit && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.unit}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status */}
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.status
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.status}
                        </p>
                      )}
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center space-x-6 mt-4">
                      {/* Reusable */}
                      <div className="flex items-center">
                        <input
                          id="reusable"
                          name="reusable"
                          type="checkbox"
                          checked={formData.reusable}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor="reusable"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Reusable
                        </label>
                      </div>

                      {/* Sterile */}
                      <div className="flex items-center">
                        <input
                          id="sterile"
                          name="sterile"
                          type="checkbox"
                          checked={formData.sterile}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor="sterile"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Sterile
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Notes <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={2}
                      value={formData.notes || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isSaving ? "Saving..." : isEditing ? "Update" : "Add"}
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

export default MedicalSupplyFormModal;
