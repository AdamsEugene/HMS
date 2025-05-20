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
