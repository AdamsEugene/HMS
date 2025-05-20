import { useState } from "react";
import type {
  Department,
  NewStaffMember,
  NewDepartmentResource,
  NewWorkflow,
  NewKeyPerformanceIndicator,
} from "../types";
import {
  UserGroupIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import BasicInformation from "./tabs/BasicInformation";
import StaffList from "./tabs/StaffList";
import ResourceList from "./tabs/ResourceList";
import WorkflowList from "./tabs/WorkflowList";
import KPIList from "../../../../../src/components/administration/departments/tabs/KPIList";

interface DepartmentDetailsProps {
  department: Department;
  updateDepartment: (department: Department) => void;
  removeDepartment: (id: string) => void;
  addStaffMember: (departmentId: string, staff: NewStaffMember) => void;
  removeStaffMember: (departmentId: string, staffId: string) => void;
  addResource: (departmentId: string, resource: NewDepartmentResource) => void;
  removeResource: (departmentId: string, resourceId: string) => void;
  addWorkflow: (departmentId: string, workflow: NewWorkflow) => void;
  removeWorkflow: (departmentId: string, workflowId: string) => void;
  addKPI: (departmentId: string, kpi: NewKeyPerformanceIndicator) => void;
  removeKPI: (departmentId: string, kpiId: string) => void;
  backToDepartmentList: () => void;
}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({
  department,
  updateDepartment,
  removeDepartment,
  addStaffMember,
  removeStaffMember,
  addResource,
  removeResource,
  addWorkflow,
  removeWorkflow,
  addKPI,
  removeKPI,
  backToDepartmentList,
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("basic");

  // Function to update basic department fields
  const updateField = <K extends keyof Department>(
    field: K,
    value: Department[K]
  ) => {
    updateDepartment({
      ...department,
      [field]: value,
    });
  };

  // Handle department deletion
  const handleDeleteDepartment = () => {
    if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
      removeDepartment(department.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-primary" />
          {department.name}
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            className="btn-secondary flex items-center"
            onClick={backToDepartmentList}
          >
            <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
            Back to List
          </button>
          <button
            type="button"
            className="btn-danger flex items-center"
            onClick={handleDeleteDepartment}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px px-6">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "basic"
                ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </button>
          <button
            className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "staff"
                ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("staff")}
          >
            Staff ({department.staff.length})
          </button>
          <button
            className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "resources"
                ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources ({department.resources.length})
          </button>
          <button
            className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "workflows"
                ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("workflows")}
          >
            Workflows ({department.workflows.length})
          </button>
          <button
            className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "kpis"
                ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("kpis")}
          >
            KPIs ({department.kpis.length})
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "basic" && (
          <BasicInformation department={department} updateField={updateField} />
        )}
        {activeTab === "staff" && (
          <StaffList
            departmentId={department.id}
            staff={department.staff}
            headId={department.headId}
            addStaffMember={addStaffMember}
            removeStaffMember={removeStaffMember}
          />
        )}
        {activeTab === "resources" && (
          <ResourceList
            departmentId={department.id}
            resources={department.resources}
            addResource={addResource}
            removeResource={removeResource}
          />
        )}
        {activeTab === "workflows" && (
          <WorkflowList
            departmentId={department.id}
            workflows={department.workflows}
            addWorkflow={addWorkflow}
            removeWorkflow={removeWorkflow}
          />
        )}
        {activeTab === "kpis" && (
          <KPIList
            departmentId={department.id}
            kpis={department.kpis}
            addKPI={addKPI}
            removeKPI={removeKPI}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentDetails;
