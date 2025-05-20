import { useState } from "react";
import type {
  Department,
  NewDepartment,
  NewStaffMember,
  NewDepartmentResource,
  NewWorkflow,
  NewKeyPerformanceIndicator,
} from "./types";
import DepartmentList from "./departments/DepartmentList";
import DepartmentDetails from "./departments/DepartmentDetails";
import AddDepartmentForm from "./departments/AddDepartmentForm";

const DepartmentManagement = () => {
  // State for departments list
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "dept1",
      name: "Emergency Department",
      description: "Handles emergency and trauma care for acute patients",
      type: "Clinical",
      location: "Building A, Floor 1",
      extension: "1001",
      email: "emergency@medihubcentral.org",
      establishedDate: "2010-05-15",
      headId: "staff1",
      status: "Active",
      staff: [
        {
          id: "staff1",
          name: "Dr. Emily Richards",
          position: "Emergency Medicine Physician",
          specialization: "Trauma",
          email: "emily.richards@medihubcentral.org",
          phone: "(555) 234-5678",
          role: "Head",
          status: "Active",
        },
        {
          id: "staff2",
          name: "Robert Chen",
          position: "Emergency Nurse",
          email: "robert.chen@medihubcentral.org",
          phone: "(555) 234-5679",
          role: "Staff",
          status: "Active",
        },
      ],
      resources: [
        {
          id: "res1",
          name: "Trauma Bays",
          type: "Facility",
          quantity: 5,
          status: "Available",
          lastUpdated: "2023-12-01",
        },
        {
          id: "res2",
          name: "Portable X-Ray Units",
          type: "Equipment",
          quantity: 3,
          status: "Available",
          lastUpdated: "2023-12-01",
        },
      ],
      workflows: [
        {
          id: "wf1",
          name: "Trauma Assessment",
          description: "Standard protocol for trauma patient assessment",
          status: "Active",
          lastUpdated: "2023-11-15",
          steps: [
            {
              id: "step1",
              name: "Primary Survey",
              description: "ABCDE assessment",
              order: 1,
              assignedRole: "Emergency Physician",
              estimatedDuration: 10,
              status: "Active",
            },
            {
              id: "step2",
              name: "Secondary Survey",
              description: "Detailed examination",
              order: 2,
              assignedRole: "Emergency Physician",
              estimatedDuration: 20,
              status: "Active",
            },
          ],
        },
      ],
      kpis: [
        {
          id: "kpi1",
          name: "Door-to-Doctor Time",
          description: "Time from patient arrival to physician evaluation",
          target: 15,
          unit: "minutes",
          frequency: "Monthly",
          status: "Active",
        },
        {
          id: "kpi2",
          name: "Left Without Being Seen",
          description: "Percentage of patients who left before treatment",
          target: 2,
          unit: "percent",
          frequency: "Monthly",
          status: "Active",
        },
      ],
    },
    {
      id: "dept2",
      name: "Radiology Department",
      description: "Provides diagnostic imaging services",
      type: "Clinical Support",
      location: "Building B, Floor 2",
      extension: "2001",
      email: "radiology@medihubcentral.org",
      establishedDate: "2012-03-20",
      headId: "staff3",
      status: "Active",
      staff: [
        {
          id: "staff3",
          name: "Dr. Sarah Johnson",
          position: "Chief Radiologist",
          specialization: "Neuroradiology",
          email: "sarah.johnson@medihubcentral.org",
          phone: "(555) 234-5680",
          role: "Head",
          status: "Active",
        },
      ],
      resources: [
        {
          id: "res3",
          name: "MRI Machine",
          type: "Equipment",
          quantity: 2,
          status: "Available",
          lastUpdated: "2023-12-01",
        },
        {
          id: "res4",
          name: "CT Scanner",
          type: "Equipment",
          quantity: 3,
          status: "Available",
          lastUpdated: "2023-12-01",
        },
      ],
      workflows: [
        {
          id: "wf2",
          name: "Inpatient Imaging Request",
          description: "Process for handling inpatient radiology requests",
          status: "Active",
          lastUpdated: "2023-10-05",
          steps: [
            {
              id: "step3",
              name: "Request Validation",
              description: "Validation of imaging request",
              order: 1,
              assignedRole: "Radiology Technician",
              estimatedDuration: 15,
              status: "Active",
            },
          ],
        },
      ],
      kpis: [
        {
          id: "kpi3",
          name: "Report Turnaround Time",
          description: "Time from scan completion to report availability",
          target: 60,
          unit: "minutes",
          frequency: "Weekly",
          status: "Active",
        },
      ],
    },
  ]);

  // State for showing add/edit forms
  const [showAddDepartmentForm, setShowAddDepartmentForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // New department template
  const [newDepartment, setNewDepartment] = useState<NewDepartment>({
    name: "",
    description: "",
    type: "Clinical",
    location: "",
    extension: "",
    email: "",
    establishedDate: "",
    status: "Active",
    staff: [],
    resources: [],
    workflows: [],
    kpis: [],
  });

  // Add a new department
  const addDepartment = () => {
    if (newDepartment.name && newDepartment.description) {
      const id = `dept${Date.now()}`;
      const newDeptWithId: Department = {
        ...newDepartment,
        id,
        staff: newDepartment.staff.map((staff, index) => ({
          ...staff,
          id: `staff-${id}-${index}`,
        })),
        resources: newDepartment.resources.map((resource, index) => ({
          ...resource,
          id: `res-${id}-${index}`,
        })),
        workflows: newDepartment.workflows.map((workflow, index) => {
          const workflowId = `wf-${id}-${index}`;
          return {
            ...workflow,
            id: workflowId,
            steps: workflow.steps.map((step, stepIndex) => ({
              ...step,
              id: `step-${workflowId}-${stepIndex}`,
            })),
          };
        }),
        kpis: newDepartment.kpis.map((kpi, index) => ({
          ...kpi,
          id: `kpi-${id}-${index}`,
        })),
      };

      setDepartments([...departments, newDeptWithId]);
      setNewDepartment({
        name: "",
        description: "",
        type: "Clinical",
        location: "",
        extension: "",
        email: "",
        establishedDate: "",
        status: "Active",
        staff: [],
        resources: [],
        workflows: [],
        kpis: [],
      });
      setShowAddDepartmentForm(false);
    }
  };

  // Remove a department
  const removeDepartment = (id: string) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
    if (selectedDepartment?.id === id) {
      setSelectedDepartment(null);
    }
  };

  // Update a department's basic information
  const updateDepartment = (updatedDepartment: Department) => {
    setDepartments(
      departments.map((dept) =>
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    );
    setSelectedDepartment(updatedDepartment);
  };

  // Add a staff member to a department
  const addStaffMember = (departmentId: string, newStaff: NewStaffMember) => {
    const staffId = `staff-${departmentId}-${Date.now()}`;
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          const updatedDept = {
            ...dept,
            staff: [...dept.staff, { ...newStaff, id: staffId }],
          };

          // If this is a head position, update the headId
          if (newStaff.role === "Head") {
            updatedDept.headId = staffId;
          }

          return updatedDept;
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  // Remove a staff member from a department
  const removeStaffMember = (departmentId: string, staffId: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          const updatedDept = {
            ...dept,
            staff: dept.staff.filter((s) => s.id !== staffId),
          };

          // If the head was removed, clear the headId
          if (dept.headId === staffId) {
            updatedDept.headId = undefined;
          }

          return updatedDept;
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  // Add a resource to a department
  const addResource = (
    departmentId: string,
    newResource: NewDepartmentResource
  ) => {
    const resourceId = `res-${departmentId}-${Date.now()}`;
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            resources: [...dept.resources, { ...newResource, id: resourceId }],
          };
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  // Remove a resource from a department
  const removeResource = (departmentId: string, resourceId: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            resources: dept.resources.filter((r) => r.id !== resourceId),
          };
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  // Add a workflow to a department
  const addWorkflow = (departmentId: string, newWorkflow: NewWorkflow) => {
    const workflowId = `wf-${departmentId}-${Date.now()}`;
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            workflows: [
              ...dept.workflows,
              {
                ...newWorkflow,
                id: workflowId,
                steps: newWorkflow.steps.map((step, index) => ({
                  ...step,
                  id: `step-${workflowId}-${index}`,
                })),
              },
            ],
          };
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  // Remove a workflow from a department
  const removeWorkflow = (departmentId: string, workflowId: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            workflows: dept.workflows.filter((w) => w.id !== workflowId),
          };
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  // Add a KPI to a department
  const addKPI = (departmentId: string, newKPI: NewKeyPerformanceIndicator) => {
    const kpiId = `kpi-${departmentId}-${Date.now()}`;
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            kpis: [...dept.kpis, { ...newKPI, id: kpiId }],
          };
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  // Remove a KPI from a department
  const removeKPI = (departmentId: string, kpiId: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            kpis: dept.kpis.filter((k) => k.id !== kpiId),
          };
        }
        return dept;
      })
    );

    // Update selected department if it's the current one
    if (selectedDepartment?.id === departmentId) {
      setSelectedDepartment(
        departments.find((dept) => dept.id === departmentId) || null
      );
    }
  };

  return (
    <div className="space-y-6">
      {selectedDepartment ? (
        <DepartmentDetails
          department={selectedDepartment}
          updateDepartment={updateDepartment}
          removeDepartment={removeDepartment}
          addStaffMember={addStaffMember}
          removeStaffMember={removeStaffMember}
          addResource={addResource}
          removeResource={removeResource}
          addWorkflow={addWorkflow}
          removeWorkflow={removeWorkflow}
          addKPI={addKPI}
          removeKPI={removeKPI}
          backToDepartmentList={() => setSelectedDepartment(null)}
        />
      ) : showAddDepartmentForm ? (
        <AddDepartmentForm
          newDepartment={newDepartment}
          setNewDepartment={setNewDepartment}
          addDepartment={addDepartment}
          cancelAdd={() => setShowAddDepartmentForm(false)}
        />
      ) : (
        <DepartmentList
          departments={departments}
          selectDepartment={setSelectedDepartment}
          showAddForm={() => setShowAddDepartmentForm(true)}
        />
      )}
    </div>
  );
};

export default DepartmentManagement;
