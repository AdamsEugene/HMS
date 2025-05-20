import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Medication, NewMedication } from "../types";
import { cn } from "../../../utils/cn";

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: NewMedication) => void;
  initialMedication?: Medication;
  isEditing?: boolean;
}

const defaultMedication: NewMedication = {
  name: "",
  genericName: "",
  brandNames: [],
  drugClass: "",
  formulation: "",
  strength: "",
  route: "",
  code: "",
  status: "Active",
  controlled: false,
  requiresPriorAuth: false,
  special: false,
};

const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMedication,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<NewMedication>(defaultMedication);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [brandNamesInput, setBrandNamesInput] = useState("");

  useEffect(() => {
    if (initialMedication) {
      setFormData(initialMedication);
      setBrandNamesInput(initialMedication.brandNames.join(", "));
    } else {
      setFormData(defaultMedication);
      setBrandNamesInput("");
    }
    setErrors({});
  }, [initialMedication, isOpen]);

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

      // Show/hide controlled class field based on controlled checkbox
      if (name === "controlled" && !target.checked) {
        setFormData({
          ...formData,
          [name]: target.checked,
          controlledClass: undefined,
        });
      }
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

  const handleBrandNamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandNamesInput(e.target.value);
    // Split by comma and trim whitespace
    const brandNames = e.target.value
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    setFormData({
      ...formData,
      brandNames,
    });

    // Clear error when field is edited
    if (errors.brandNames) {
      setErrors({
        ...errors,
        brandNames: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.genericName.trim()) {
      newErrors.genericName = "Generic name is required";
    }

    if (!formData.drugClass.trim()) {
      newErrors.drugClass = "Drug class is required";
    }

    if (!formData.formulation.trim()) {
      newErrors.formulation = "Formulation is required";
    }

    if (!formData.strength.trim()) {
      newErrors.strength = "Strength is required";
    }

    if (!formData.route.trim()) {
      newErrors.route = "Route is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (formData.controlled && !formData.controlledClass?.trim()) {
      newErrors.controlledClass =
        "Controlled class is required when medication is controlled";
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
        console.error("Error saving medication:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const formulationOptions = [
    "Tablet",
    "Capsule",
    "Liquid",
    "Injection",
    "Cream",
    "Ointment",
    "Gel",
    "Patch",
    "Inhaler",
    "Powder",
    "Drops",
    "Spray",
    "Suppository",
    "Other",
  ];

  const routeOptions = [
    "Oral",
    "Intravenous",
    "Intramuscular",
    "Subcutaneous",
    "Topical",
    "Inhalation",
    "Rectal",
    "Ophthalmic",
    "Otic",
    "Nasal",
    "Sublingual",
    "Transdermal",
    "Other",
  ];

  const statusOptions = ["Active", "Inactive", "Recalled"];

  const controlledClassOptions = [
    "Schedule I",
    "Schedule II",
    "Schedule III",
    "Schedule IV",
    "Schedule V",
  ];

  const drugClassOptions = [
    "Analgesic",
    "Anesthetic",
    "Antibiotic",
    "Anticoagulant",
    "Anticonvulsant",
    "Antidepressant",
    "Antidiabetic",
    "Antifungal",
    "Antihistamine",
    "Antihypertensive",
    "Anti-inflammatory",
    "Antimalarial",
    "Antipsychotic",
    "Antiviral",
    "Bronchodilator",
    "Cardiovascular",
    "Diuretic",
    "Gastrointestinal",
    "Hormone",
    "Immunosuppressant",
    "Muscle Relaxant",
    "Sedative",
    "Stimulant",
    "Vaccine",
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
                    {isEditing ? "Edit Medication" : "Add New Medication"}
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

                    {/* Generic Name */}
                    <div>
                      <label
                        htmlFor="genericName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Generic Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="genericName"
                        id="genericName"
                        value={formData.genericName}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.genericName
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      />
                      {errors.genericName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.genericName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Brand Names */}
                  <div>
                    <label
                      htmlFor="brandNames"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Brand Names{" "}
                      <span className="text-gray-400">(Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      name="brandNames"
                      id="brandNames"
                      value={brandNamesInput}
                      onChange={handleBrandNamesChange}
                      placeholder="Brand 1, Brand 2, Brand 3"
                      className={cn(
                        "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                        errors.brandNames
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      )}
                    />
                    {errors.brandNames && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.brandNames}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Drug Class */}
                    <div>
                      <label
                        htmlFor="drugClass"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Drug Class <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="drugClass"
                        id="drugClass"
                        value={formData.drugClass}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.drugClass
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      >
                        <option value="">Select a drug class</option>
                        {drugClassOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.drugClass && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.drugClass}
                        </p>
                      )}
                    </div>

                    {/* Code */}
                    <div>
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        NDC Code <span className="text-red-500">*</span>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Formulation */}
                    <div>
                      <label
                        htmlFor="formulation"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Formulation <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="formulation"
                        id="formulation"
                        value={formData.formulation}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.formulation
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      >
                        <option value="">Select a formulation</option>
                        {formulationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.formulation && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.formulation}
                        </p>
                      )}
                    </div>

                    {/* Strength */}
                    <div>
                      <label
                        htmlFor="strength"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Strength <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="strength"
                        id="strength"
                        value={formData.strength}
                        onChange={handleInputChange}
                        placeholder="e.g., 10mg, 250mg/5ml"
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.strength
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      />
                      {errors.strength && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.strength}
                        </p>
                      )}
                    </div>

                    {/* Route */}
                    <div>
                      <label
                        htmlFor="route"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Route <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="route"
                        id="route"
                        value={formData.route}
                        onChange={handleInputChange}
                        className={cn(
                          "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                          errors.route
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        )}
                      >
                        <option value="">Select a route</option>
                        {routeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.route && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.route}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {/* Controlled Class (conditionally shown) */}
                    {formData.controlled && (
                      <div>
                        <label
                          htmlFor="controlledClass"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Controlled Class{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="controlledClass"
                          id="controlledClass"
                          value={formData.controlledClass || ""}
                          onChange={handleInputChange}
                          className={cn(
                            "mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                            errors.controlledClass
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                          )}
                        >
                          <option value="">Select a controlled class</option>
                          {controlledClassOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors.controlledClass && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.controlledClass}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Controlled Substance */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="controlled"
                          name="controlled"
                          type="checkbox"
                          checked={formData.controlled}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="controlled"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Controlled Substance
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Medication is a controlled substance
                        </p>
                      </div>
                    </div>

                    {/* Requires Prior Authorization */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="requiresPriorAuth"
                          name="requiresPriorAuth"
                          type="checkbox"
                          checked={formData.requiresPriorAuth}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="requiresPriorAuth"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Prior Authorization
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Requires authorization before dispensing
                        </p>
                      </div>
                    </div>

                    {/* Special Medication */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="special"
                          name="special"
                          type="checkbox"
                          checked={formData.special}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="special"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Special Medication
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Requires additional monitoring
                        </p>
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

export default MedicationFormModal;
