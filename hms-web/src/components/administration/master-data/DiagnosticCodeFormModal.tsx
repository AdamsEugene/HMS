import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { DiagnosticCode, NewDiagnosticCode } from "../types";
import { cn } from "../../../utils/cn";

interface DiagnosticCodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (code: NewDiagnosticCode) => void;
  initialCode?: DiagnosticCode;
  isEditing?: boolean;
}

const defaultCode: NewDiagnosticCode = {
  code: "",
  description: "",
  category: "",
  version: "ICD-10",
  status: "Active",
  validFrom: new Date().toISOString().split("T")[0],
};

const DiagnosticCodeFormModal: React.FC<DiagnosticCodeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCode,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<NewDiagnosticCode>(defaultCode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setFormData(initialCode);
    } else {
      setFormData(defaultCode);
    }
    setErrors({});
  }, [initialCode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

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

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.version.trim()) {
      newErrors.version = "Version is required";
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "Valid from date is required";
    }

    if (
      formData.validTo &&
      new Date(formData.validTo) <= new Date(formData.validFrom)
    ) {
      newErrors.validTo = "End date must be after start date";
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
        console.error("Error saving diagnostic code:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const versionOptions = ["ICD-10", "ICD-11", "SNOMED CT", "DSM-5"];
  const statusOptions = ["Active", "Inactive", "Deprecated"];
  const categoryOptions = [
    "Circulatory System",
    "Respiratory System",
    "Digestive System",
    "Endocrine System",
    "Nervous System",
    "Musculoskeletal System",
    "Genitourinary System",
    "Mental Health",
    "Infectious Diseases",
    "Neoplasms",
    "Other",
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
                      ? "Edit Diagnostic Code"
                      : "Add New Diagnostic Code"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Code */}
                    <div>
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Code <span className="text-red-500">*</span>
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

                    {/* Version */}
                    <div>
                      <label
                        htmlFor="version"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Version <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="version"
                        id="version"
                        value={formData.version}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.version
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      >
                        {versionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.version && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.version}
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

                    {/* Sub Category */}
                    <div>
                      <label
                        htmlFor="subCategory"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Sub Category
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        id="subCategory"
                        value={formData.subCategory || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
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

                    {/* Valid From */}
                    <div>
                      <label
                        htmlFor="validFrom"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Valid From <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="validFrom"
                        id="validFrom"
                        value={formData.validFrom}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.validFrom
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      />
                      {errors.validFrom && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.validFrom}
                        </p>
                      )}
                    </div>

                    {/* Valid To */}
                    <div>
                      <label
                        htmlFor="validTo"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Valid To{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="date"
                        name="validTo"
                        id="validTo"
                        value={formData.validTo || ""}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.validTo
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      />
                      {errors.validTo && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.validTo}
                        </p>
                      )}
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

export default DiagnosticCodeFormModal;
