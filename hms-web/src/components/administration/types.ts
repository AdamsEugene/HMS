// Hospital profile related types
export interface Accreditation {
  id: string;
  name: string;
  issuedBy: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Pending";
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Pending";
}

export interface HospitalProfile {
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  establishedYear: string;
  capacity: {
    beds: number;
    operatingRooms: number;
    emergencyRooms: number;
  };
  accreditations: Accreditation[];
  certifications: Certification[];
}

// New accreditation/certification form types
export type NewAccreditation = Omit<Accreditation, "id">;
export type NewCertification = Omit<Certification, "id">;

// Department management related types
export interface StaffMember {
  id: string;
  name: string;
  position: string;
  specialization?: string;
  email: string;
  phone: string;
  role: "Head" | "Staff" | "Admin";
  status: "Active" | "On Leave" | "Inactive";
}

export interface DepartmentResource {
  id: string;
  name: string;
  type: "Equipment" | "Facility" | "Software" | "Service";
  quantity: number;
  status: "Available" | "Limited" | "Unavailable";
  lastUpdated: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  assignedRole: string;
  estimatedDuration: number; // In minutes
  status: "Active" | "In Review" | "Deprecated";
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: "Active" | "Draft" | "Archived";
  lastUpdated: string;
}

export interface KeyPerformanceIndicator {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annually";
  status: "Active" | "Under Review" | "Inactive";
}

export interface Department {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  extension: string;
  email: string;
  establishedDate: string;
  headId?: string;
  status: "Active" | "Inactive" | "Under Construction";
  staff: StaffMember[];
  resources: DepartmentResource[];
  workflows: Workflow[];
  kpis: KeyPerformanceIndicator[];
}

// New department form type
export type NewDepartment = Omit<
  Department,
  "id" | "staff" | "resources" | "workflows" | "kpis"
> & {
  staff: Omit<StaffMember, "id">[];
  resources: Omit<DepartmentResource, "id">[];
  workflows: Omit<Workflow, "id" | "steps"> &
    { steps: Omit<WorkflowStep, "id">[] }[];
  kpis: Omit<KeyPerformanceIndicator, "id">[];
};

// New form types for adding items to departments
export type NewStaffMember = Omit<StaffMember, "id">;
export type NewDepartmentResource = Omit<DepartmentResource, "id">;
export type NewWorkflowStep = Omit<WorkflowStep, "id">;
export type NewWorkflow = Omit<Workflow, "id" | "steps"> & {
  steps: NewWorkflowStep[];
};
export type NewKeyPerformanceIndicator = Omit<KeyPerformanceIndicator, "id">;

// System Configuration types
export interface GeneralSettings {
  systemName: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  enableNotifications: boolean;
  enableAuditLogs: boolean;
  sessionTimeout: number; // In minutes
  passwordExpiryDays: number;
  minimumPasswordLength: number;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface TimeSlot {
  from: string; // Format: "HH:MM"
  to: string; // Format: "HH:MM"
}

export interface OperationalHours {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

export interface PricingModel {
  id: string;
  name: string;
  description: string;
  type: "Standard" | "Insurance" | "Discounted" | "Special";
  active: boolean;
  defaultModel: boolean;
  appliesTo: ("Inpatient" | "Outpatient" | "Emergency" | "Procedures")[];
  markupPercentage?: number;
  discountPercentage?: number;
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string, optional for indefinite models
  notes?: string;
}

// Combined system configuration type
export interface SystemConfiguration {
  generalSettings: GeneralSettings;
  operationalHours: OperationalHours[];
  pricingModels: PricingModel[];
}

// New model form types
export type NewPricingModel = Omit<PricingModel, "id">;

// Master Data Management types
export interface DiagnosticCode {
  id: string;
  code: string;
  description: string;
  category: string;
  subCategory?: string;
  version: string; // e.g., "ICD-10", "ICD-11", "SNOMED CT"
  status: "Active" | "Inactive" | "Deprecated";
  validFrom: string; // ISO date string
  validTo?: string; // ISO date string, optional for codes without expiration
  notes?: string;
}

export interface ProcedureCode {
  id: string;
  code: string;
  description: string;
  category: string;
  subCategory?: string;
  version: string; // e.g., "CPT", "HCPCS", "ICD-10-PCS"
  status: "Active" | "Inactive" | "Deprecated";
  validFrom: string; // ISO date string
  validTo?: string; // ISO date string, optional for codes without expiration
  defaultDuration?: number; // In minutes
  requiresConsent: boolean;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  formulation: string; // e.g., "Tablet", "Injection", "Syrup"
  strength: string; // e.g., "10mg", "250mg/5ml"
  route: string; // e.g., "Oral", "Intravenous", "Topical"
  code: string; // NDC (National Drug Code) or other code
  status: "Active" | "Inactive" | "Recalled";
  controlled: boolean;
  controlledClass?: string; // e.g., "Schedule II", "Schedule IV"
  requiresPriorAuth: boolean;
  special: boolean; // Special medication requiring additional monitoring
  notes?: string;
}

export interface MedicalSupply {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string; // Supply code
  unit: string; // Unit of measure
  reusable: boolean;
  sterile: boolean;
  status: "Active" | "Inactive" | "Discontinued";
  notes?: string;
}

// Combined master data management type
export interface MasterData {
  diagnosticCodes: DiagnosticCode[];
  procedureCodes: ProcedureCode[];
  medications: Medication[];
  medicalSupplies: MedicalSupply[];
}

// New master data form types
export type NewDiagnosticCode = Omit<DiagnosticCode, "id">;
export type NewProcedureCode = Omit<ProcedureCode, "id">;
export type NewMedication = Omit<Medication, "id">;
export type NewMedicalSupply = Omit<MedicalSupply, "id">;
