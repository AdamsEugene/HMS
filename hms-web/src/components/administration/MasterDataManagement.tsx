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
  // Will be used in future implementations
  // Medication,
  // MedicalSupply,
} from "./types";
import { DiagnosticCodesManager, ProcedureCodesManager } from "./master-data";

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
      description: "Office/outpatient visit, established patient, Level 3",
      category: "Evaluation & Management",
      version: "CPT",
      status: "Active",
      requiresConsent: false,
      validFrom: "2022-01-01",
    },
    {
      id: "proc2",
      code: "93000",
      description: "Electrocardiogram, complete",
      category: "Diagnostic",
      version: "CPT",
      status: "Active",
      requiresConsent: false,
      validFrom: "2022-01-01",
    },
    {
      id: "proc3",
      code: "43239",
      description: "Upper GI endoscopy, biopsy",
      category: "Procedures",
      version: "CPT",
      status: "Active",
      requiresConsent: true,
      validFrom: "2022-01-01",
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
      code: "00603-5164-21",
      status: "Active",
      controlled: false,
      requiresPriorAuth: false,
      special: false,
    },
    {
      id: "med2",
      name: "Metformin",
      genericName: "Metformin Hydrochloride",
      brandNames: ["Glucophage", "Fortamet"],
      drugClass: "Antidiabetic",
      formulation: "Tablet",
      strength: "500mg",
      route: "Oral",
      code: "00093-1043-01",
      status: "Active",
      controlled: false,
      requiresPriorAuth: false,
      special: false,
    },
    {
      id: "med3",
      name: "Albuterol",
      genericName: "Albuterol Sulfate",
      brandNames: ["ProAir HFA", "Ventolin HFA", "Proventil HFA"],
      drugClass: "Bronchodilator",
      formulation: "Inhaler",
      strength: "90mcg/actuation",
      route: "Inhalation",
      code: "00085-1132-01",
      status: "Active",
      controlled: false,
      requiresPriorAuth: false,
      special: false,
    },
  ],
  medicalSupplies: [
    {
      id: "supply1",
      name: "Gauze Pads",
      category: "Wound Care",
      description: "Sterile gauze pads, 4x4, 10 count",
      code: "S-GP-4x4-10",
      unit: "Box",
      reusable: false,
      sterile: true,
      status: "Active",
    },
    {
      id: "supply2",
      name: "Blood Pressure Cuff",
      category: "Diagnostic Supplies",
      description: "Adult blood pressure cuff, standard size",
      code: "S-BP-CUFF-A",
      unit: "Each",
      reusable: true,
      sterile: false,
      status: "Active",
    },
    {
      id: "supply3",
      name: "Syringes",
      category: "Syringes & Needles",
      description: "Disposable syringes, 3cc, 100 count",
      code: "S-SYR-3CC-100",
      unit: "Box",
      reusable: false,
      sterile: true,
      status: "Active",
    },
  ],
};

const MasterDataManagement: React.FC = () => {
  const [masterData, setMasterData] = useState<MasterData>(defaultMasterData);

  // Update diagnostic codes
  const updateDiagnosticCodes = (diagnosticCodes: DiagnosticCode[]) => {
    setMasterData({
      ...masterData,
      diagnosticCodes,
    });
  };

  // Update procedure codes
  const updateProcedureCodes = (procedureCodes: ProcedureCode[]) => {
    setMasterData({
      ...masterData,
      procedureCodes,
    });
  };

  // These will be used when we implement the medication and medical supply managers
  // Keeping them as placeholders for future implementation
  /* 
  // Update medications
  const updateMedications = (medications: Medication[]) => {
    setMasterData({
      ...masterData,
      medications,
    });
  };

  // Update medical supplies
  const updateMedicalSupplies = (medicalSupplies: MedicalSupply[]) => {
    setMasterData({
      ...masterData,
      medicalSupplies,
    });
  };
  */

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Master Data Management
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Manage hospital-wide reference data including diagnostic codes,
        procedure codes, medications, and medical supplies.
      </p>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-primary-50 dark:bg-gray-800 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              cn(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center",
                "ring-white ring-opacity-60 ring-offset-2 focus:outline-none",
                selected
                  ? "bg-white dark:bg-gray-700 shadow text-primary dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
              )
            }
          >
            <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Diagnostic Codes
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center",
                "ring-white ring-opacity-60 ring-offset-2 focus:outline-none",
                selected
                  ? "bg-white dark:bg-gray-700 shadow text-primary dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
              )
            }
          >
            <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
            Procedure Codes
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center",
                "ring-white ring-opacity-60 ring-offset-2 focus:outline-none",
                selected
                  ? "bg-white dark:bg-gray-700 shadow text-primary dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
              )
            }
          >
            <BeakerIcon className="h-5 w-5 mr-2" />
            Medications
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center",
                "ring-white ring-opacity-60 ring-offset-2 focus:outline-none",
                selected
                  ? "bg-white dark:bg-gray-700 shadow text-primary dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary"
              )
            }
          >
            <ArchiveBoxIcon className="h-5 w-5 mr-2" />
            Medical Supplies
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-2">
          {/* Diagnostic Codes Panel */}
          <Tab.Panel>
            <DiagnosticCodesManager
              diagnosticCodes={masterData.diagnosticCodes}
              updateDiagnosticCodes={updateDiagnosticCodes}
            />
          </Tab.Panel>

          {/* Procedure Codes Panel */}
          <Tab.Panel>
            <ProcedureCodesManager
              procedureCodes={masterData.procedureCodes}
              updateProcedureCodes={updateProcedureCodes}
            />
          </Tab.Panel>

          {/* Medications Panel */}
          <Tab.Panel>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Medication manager implementation in progress...
              </p>
            </div>
          </Tab.Panel>

          {/* Medical Supplies Panel */}
          <Tab.Panel>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Medical supplies manager implementation in progress...
              </p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MasterDataManagement;
