import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";
import type {
  MasterData,
  DiagnosticCode,
  ProcedureCode,
  Medication,
  MedicalSupply,
} from "./types";

// Default master data for demonstration
const defaultMasterData: MasterData = {
  diagnosticCodes: [
    {
      id: "diag1",
      code: "I10",
      description: "Essential (primary) hypertension",
      category: "Circulatory System",
      version: "ICD-10",
      status: "Active",
      validFrom: "2022-01-01",
    },
    {
      id: "diag2",
      code: "E11.9",
      description: "Type 2 diabetes mellitus without complications",
      category: "Endocrine System",
      version: "ICD-10",
      status: "Active",
      validFrom: "2022-01-01",
    },
    {
      id: "diag3",
      code: "J45.909",
      description: "Unspecified asthma, uncomplicated",
      category: "Respiratory System",
      version: "ICD-10",
      status: "Active",
      validFrom: "2022-01-01",
    },
  ],
  procedureCodes: [
    {
      id: "proc1",
      code: "99213",
      description: "Office or other outpatient visit for established patient",
      category: "Evaluation & Management",
      version: "CPT",
      status: "Active",
      validFrom: "2022-01-01",
      defaultDuration: 15,
      requiresConsent: false,
    },
    {
      id: "proc2",
      code: "43239",
      description: "Upper GI endoscopy with biopsy",
      category: "Surgery",
      subCategory: "Digestive System",
      version: "CPT",
      status: "Active",
      validFrom: "2022-01-01",
      defaultDuration: 45,
      requiresConsent: true,
    },
    {
      id: "proc3",
      code: "71045",
      description: "X-ray exam of chest, single view",
      category: "Radiology",
      version: "CPT",
      status: "Active",
      validFrom: "2022-01-01",
      defaultDuration: 10,
      requiresConsent: true,
    },
  ],
  medications: [
    {
      id: "med1",
      name: "Lisinopril",
      genericName: "Lisinopril",
      brandNames: ["Prinivil", "Zestril"],
      drugClass: "ACE Inhibitor",
      formulation: "Tablet",
      strength: "10mg",
      route: "Oral",
      code: "68180-0513-01",
      status: "Active",
      controlled: false,
      requiresPriorAuth: false,
      special: false,
    },
    {
      id: "med2",
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      brandNames: ["Amoxil", "Trimox"],
      drugClass: "Penicillin Antibiotic",
      formulation: "Capsule",
      strength: "500mg",
      route: "Oral",
      code: "53746-272-05",
      status: "Active",
      controlled: false,
      requiresPriorAuth: false,
      special: false,
    },
    {
      id: "med3",
      name: "Oxycodone",
      genericName: "Oxycodone",
      brandNames: ["OxyContin", "Roxicodone"],
      drugClass: "Opioid Analgesic",
      formulation: "Tablet",
      strength: "5mg",
      route: "Oral",
      code: "59011-0100-10",
      status: "Active",
      controlled: true,
      controlledClass: "Schedule II",
      requiresPriorAuth: true,
      special: true,
    },
  ],
  medicalSupplies: [
    {
      id: "sup1",
      name: "Sterile Gauze Pads",
      category: "Wound Care",
      description: '4"x4" sterile gauze pads, 10 per package',
      code: "S-WC-001",
      unit: "Package",
      reusable: false,
      sterile: true,
      status: "Active",
    },
    {
      id: "sup2",
      name: "Digital Thermometer",
      category: "Diagnostic Equipment",
      description: "Digital oral thermometer with LCD display",
      code: "S-DE-101",
      unit: "Each",
      reusable: true,
      sterile: false,
      status: "Active",
    },
    {
      id: "sup3",
      name: "Insulin Syringes",
      category: "Injection Supplies",
      description: "1ml insulin syringes with 30G needle, 100 per box",
      code: "S-IS-030",
      unit: "Box",
      reusable: false,
      sterile: true,
      status: "Active",
    },
  ],
};

const MasterDataManagement = () => {
  // State for master data
  const [masterData, setMasterData] = useState<MasterData>(defaultMasterData);

  // Update handlers for each section
  const updateDiagnosticCodes = (codes: DiagnosticCode[]) => {
    setMasterData({
      ...masterData,
      diagnosticCodes: codes,
    });
  };

  const updateProcedureCodes = (codes: ProcedureCode[]) => {
    setMasterData({
      ...masterData,
      procedureCodes: codes,
    });
  };

  const updateMedications = (medications: Medication[]) => {
    setMasterData({
      ...masterData,
      medications,
    });
  };

  const updateMedicalSupplies = (supplies: MedicalSupply[]) => {
    setMasterData({
      ...masterData,
      medicalSupplies: supplies,
    });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Master Data Management
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage standardized codes, medications, and supplies used throughout
          the system.
        </p>
      </div>

      <div className="mt-6">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 dark:bg-gray-800 p-1">
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              <div className="flex items-center justify-center">
                <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Diagnostic Codes
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              <div className="flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                Procedure Codes
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              <div className="flex items-center justify-center">
                <BeakerIcon className="w-5 h-5 mr-2" />
                Medications
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:bg-gray-700 text-primary shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
                )
              }
            >
              <div className="flex items-center justify-center">
                <ArchiveBoxIcon className="w-5 h-5 mr-2" />
                Medical Supplies
              </div>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <DiagnosticCodesManager
                diagnosticCodes={masterData.diagnosticCodes}
                updateDiagnosticCodes={updateDiagnosticCodes}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <ProcedureCodesManager
                procedureCodes={masterData.procedureCodes}
                updateProcedureCodes={updateProcedureCodes}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <MedicationsManager
                medications={masterData.medications}
                updateMedications={updateMedications}
              />
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <MedicalSuppliesManager
                medicalSupplies={masterData.medicalSupplies}
                updateMedicalSupplies={updateMedicalSupplies}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

// Placeholder components for each tab
// These will be replaced with actual implementations in dedicated files later

const DiagnosticCodesManager: React.FC<{
  diagnosticCodes: DiagnosticCode[];
  updateDiagnosticCodes: (codes: DiagnosticCode[]) => void;
}> = ({ diagnosticCodes }) => {
  return (
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
              Valid From
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {diagnosticCodes.map((code) => (
            <tr
              key={code.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {code.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.version}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    code.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : code.status === "Inactive"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  )}
                >
                  {code.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(code.validFrom).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-primary hover:text-primary-dark">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Add New Code
        </button>
      </div>
    </div>
  );
};

const ProcedureCodesManager: React.FC<{
  procedureCodes: ProcedureCode[];
  updateProcedureCodes: (codes: ProcedureCode[]) => void;
}> = ({ procedureCodes }) => {
  return (
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
              Duration
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Consent
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {procedureCodes.map((code) => (
            <tr
              key={code.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {code.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.version}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.defaultDuration ? `${code.defaultDuration} mins` : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {code.requiresConsent ? "Required" : "Not Required"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    code.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : code.status === "Inactive"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  )}
                >
                  {code.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-primary hover:text-primary-dark">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Add New Code
        </button>
      </div>
    </div>
  );
};

const MedicationsManager: React.FC<{
  medications: Medication[];
  updateMedications: (medications: Medication[]) => void;
}> = ({ medications }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
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
              Controlled
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {medications.map((medication) => (
            <tr
              key={medication.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {medication.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {medication.genericName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {medication.drugClass}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {medication.formulation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {medication.strength}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {medication.controlled ? (
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    {medication.controlledClass || "Yes"}
                  </span>
                ) : (
                  "No"
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    medication.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : medication.status === "Inactive"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  )}
                >
                  {medication.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-primary hover:text-primary-dark">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Add New Medication
        </button>
      </div>
    </div>
  );
};

const MedicalSuppliesManager: React.FC<{
  medicalSupplies: MedicalSupply[];
  updateMedicalSupplies: (supplies: MedicalSupply[]) => void;
}> = ({ medicalSupplies }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
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
              Reusable
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Sterile
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {medicalSupplies.map((supply) => (
            <tr
              key={supply.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {supply.reusable ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {supply.sterile ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    supply.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : supply.status === "Inactive"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  )}
                >
                  {supply.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-primary hover:text-primary-dark">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Add New Supply
        </button>
      </div>
    </div>
  );
};

export default MasterDataManagement;
