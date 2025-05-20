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
import {
  DiagnosticCodesManager,
  ProcedureCodesManager,
  MedicationsManager,
  MedicalSuppliesManager,
} from "./master-data";

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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Master Data Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage diagnostic codes, procedure codes, medications, and medical
          supplies used across the system.
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          <Tab
            className={({ selected }) =>
              cn(
                "w-full py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 rounded-lg",
                "flex items-center justify-center",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                selected
                  ? "bg-white dark:bg-gray-700 shadow dark:text-white"
                  : "hover:bg-white/[0.12] hover:text-gray-700"
              )
            }
          >
            <DocumentMagnifyingGlassIcon
              className="w-5 h-5 mr-2"
              aria-hidden="true"
            />
            Diagnostic Codes
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "w-full py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 rounded-lg",
                "flex items-center justify-center",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                selected
                  ? "bg-white dark:bg-gray-700 shadow dark:text-white"
                  : "hover:bg-white/[0.12] hover:text-gray-700"
              )
            }
          >
            <ClipboardDocumentCheckIcon
              className="w-5 h-5 mr-2"
              aria-hidden="true"
            />
            Procedure Codes
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "w-full py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 rounded-lg",
                "flex items-center justify-center",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                selected
                  ? "bg-white dark:bg-gray-700 shadow dark:text-white"
                  : "hover:bg-white/[0.12] hover:text-gray-700"
              )
            }
          >
            <BeakerIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Medications
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "w-full py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 rounded-lg",
                "flex items-center justify-center",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                selected
                  ? "bg-white dark:bg-gray-700 shadow dark:text-white"
                  : "hover:bg-white/[0.12] hover:text-gray-700"
              )
            }
          >
            <ArchiveBoxIcon className="w-5 h-5 mr-2" aria-hidden="true" />
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
            <MedicationsManager
              medications={masterData.medications}
              updateMedications={updateMedications}
            />
          </Tab.Panel>

          {/* Medical Supplies Panel */}
          <Tab.Panel>
            <MedicalSuppliesManager
              medicalSupplies={masterData.medicalSupplies}
              updateMedicalSupplies={updateMedicalSupplies}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MasterDataManagement;
