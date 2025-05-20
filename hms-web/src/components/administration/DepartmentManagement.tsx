import { useState, useMemo } from "react";
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
    {
      id: "dept3",
      name: "Human Resources Department",
      description: "Manages personnel and workforce operations",
      type: "Administrative",
      location: "Building C, Floor 3",
      extension: "3001",
      email: "hr@medihubcentral.org",
      establishedDate: "2009-09-01",
      headId: "staff4",
      status: "Active",
      staff: [
        {
          id: "staff4",
          name: "Andrea Collins",
          position: "HR Director",
          email: "andrea.collins@medihubcentral.org",
          phone: "(555) 234-5681",
          role: "Head",
          status: "Active",
        },
        {
          id: "staff5",
          name: "Thomas Brooks",
          position: "Recruitment Specialist",
          email: "thomas.brooks@medihubcentral.org",
          phone: "(555) 234-5682",
          role: "Staff",
          status: "Active",
        },
        {
          id: "staff6",
          name: "Maria Garcia",
          position: "Benefits Coordinator",
          email: "maria.garcia@medihubcentral.org",
          phone: "(555) 234-5683",
          role: "Staff",
          status: "Active",
        },
      ],
      resources: [
        {
          id: "res5",
          name: "HR Management Software",
          type: "Software",
          quantity: 1,
          status: "Available",
          lastUpdated: "2023-11-15",
        },
      ],
      workflows: [
        {
          id: "wf3",
          name: "New Employee Onboarding",
          description: "Process for onboarding new staff members",
          status: "Active",
          lastUpdated: "2023-10-10",
          steps: [
            {
              id: "step4",
              name: "Initial Documentation",
              description: "Collection of required documents",
              order: 1,
              assignedRole: "HR Specialist",
              estimatedDuration: 60,
              status: "Active",
            },
            {
              id: "step5",
              name: "System Access Setup",
              description: "Creation of user accounts",
              order: 2,
              assignedRole: "IT Support",
              estimatedDuration: 45,
              status: "Active",
            },
          ],
        },
      ],
      kpis: [
        {
          id: "kpi4",
          name: "Time to Fill Positions",
          description: "Average days to fill open positions",
          target: 30,
          unit: "days",
          frequency: "Monthly",
          status: "Active",
        },
      ],
    },
  ]);

  // Analytics data derived from departments
  const departmentAnalytics = useMemo(() => {
    // Count staff by department
    const staffByDepartment = departments
      .map((dept) => ({
        name: dept.name,
        count: dept.staff.length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 departments by staff count

    // Count departments by type
    const typeCount: Record<string, number> = {};
    departments.forEach((dept) => {
      typeCount[dept.type] = (typeCount[dept.type] || 0) + 1;
    });

    // Count departments by status
    const statusCount: Record<string, number> = {
      Active: 0,
      Inactive: 0,
      "Under Construction": 0,
    };
    departments.forEach((dept) => {
      statusCount[dept.status] = (statusCount[dept.status] || 0) + 1;
    });

    return {
      staffByDepartment,
      typeCount,
      statusCount,
    };
  }, [departments]);

  // Chart data
  const staffChartData = {
    labels: departmentAnalytics.staffByDepartment.map((d) => d.name),
    datasets: [
      {
        label: "Staff Count",
        data: departmentAnalytics.staffByDepartment.map((d) => d.count),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const typeChartData = {
    labels: Object.keys(departmentAnalytics.typeCount),
    datasets: [
      {
        label: "Department Types",
        data: Object.values(departmentAnalytics.typeCount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

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
    setSelectedDepartment(null);
  };

  // Update a department
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
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const staffId = `staff-${departmentId}-${Date.now()}`;
      const newStaffMember = { ...newStaff, id: staffId };

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        staff: [...updatedDepartments[departmentIndex].staff, newStaffMember],
      };

      // If this staff member is the head, update the headId
      if (newStaff.role === "Head") {
        updatedDepartments[departmentIndex].headId = staffId;
      }

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  // Remove a staff member from a department
  const removeStaffMember = (departmentId: string, staffId: string) => {
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const updatedStaff = updatedDepartments[departmentIndex].staff.filter(
        (staff) => staff.id !== staffId
      );

      // If we're removing the head, update the headId
      let updatedHeadId = updatedDepartments[departmentIndex].headId;
      if (updatedHeadId === staffId) {
        updatedHeadId = undefined;
      }

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        staff: updatedStaff,
        headId: updatedHeadId,
      };

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  // Add a resource to a department
  const addResource = (
    departmentId: string,
    newResource: NewDepartmentResource
  ) => {
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const resourceId = `res-${departmentId}-${Date.now()}`;
      const newDepartmentResource = { ...newResource, id: resourceId };

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        resources: [
          ...updatedDepartments[departmentIndex].resources,
          newDepartmentResource,
        ],
      };

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  // Remove a resource from a department
  const removeResource = (departmentId: string, resourceId: string) => {
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const updatedResources = updatedDepartments[
        departmentIndex
      ].resources.filter((resource) => resource.id !== resourceId);

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        resources: updatedResources,
      };

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  // Add a workflow to a department
  const addWorkflow = (departmentId: string, newWorkflow: NewWorkflow) => {
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const workflowId = `wf-${departmentId}-${Date.now()}`;
      const newDepartmentWorkflow = {
        ...newWorkflow,
        id: workflowId,
        steps: newWorkflow.steps.map((step, index) => ({
          ...step,
          id: `step-${workflowId}-${index}`,
        })),
      };

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        workflows: [
          ...updatedDepartments[departmentIndex].workflows,
          newDepartmentWorkflow,
        ],
      };

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  // Remove a workflow from a department
  const removeWorkflow = (departmentId: string, workflowId: string) => {
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const updatedWorkflows = updatedDepartments[
        departmentIndex
      ].workflows.filter((workflow) => workflow.id !== workflowId);

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        workflows: updatedWorkflows,
      };

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  // Add a KPI to a department
  const addKPI = (departmentId: string, newKPI: NewKeyPerformanceIndicator) => {
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const kpiId = `kpi-${departmentId}-${Date.now()}`;
      const newDepartmentKPI = { ...newKPI, id: kpiId };

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        kpis: [...updatedDepartments[departmentIndex].kpis, newDepartmentKPI],
      };

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  // Remove a KPI from a department
  const removeKPI = (departmentId: string, kpiId: string) => {
    const departmentIndex = departments.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      const updatedKPIs = updatedDepartments[departmentIndex].kpis.filter(
        (kpi) => kpi.id !== kpiId
      );

      updatedDepartments[departmentIndex] = {
        ...updatedDepartments[departmentIndex],
        kpis: updatedKPIs,
      };

      setDepartments(updatedDepartments);
      if (selectedDepartment && selectedDepartment.id === departmentId) {
        setSelectedDepartment(updatedDepartments[departmentIndex]);
      }
    }
  };

  return (
    <div>
      {/* Department Analytics Dashboard */}
      {!showAddDepartmentForm && !selectedDepartment && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Department Analytics
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Staff by Department Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Staff Distribution
              </h3>
              <div className="h-64">
                <Bar
                  data={staffChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Department Type Distribution */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Department Types
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Pie
                  data={typeChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Status Overview */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                Department Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {departmentAnalytics.statusCount["Active"]}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      departments
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Inactive
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {departmentAnalytics.statusCount["Inactive"]}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      departments
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Under Construction
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {departmentAnalytics.statusCount["Under Construction"]}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      departments
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Departments
                    </span>
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {departments.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Staff
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {departments.reduce(
                    (sum, dept) => sum + dept.staff.length,
                    0
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active KPIs
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {departments.reduce(
                    (sum, dept) =>
                      sum +
                      dept.kpis.filter((kpi) => kpi.status === "Active").length,
                    0
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Workflows
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {departments.reduce(
                    (sum, dept) =>
                      sum +
                      dept.workflows.filter((wf) => wf.status === "Active")
                        .length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department List, Add Form, or Details */}
      {showAddDepartmentForm ? (
        <AddDepartmentForm
          newDepartment={newDepartment}
          setNewDepartment={setNewDepartment}
          addDepartment={addDepartment}
          cancelAdd={() => setShowAddDepartmentForm(false)}
        />
      ) : selectedDepartment ? (
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
