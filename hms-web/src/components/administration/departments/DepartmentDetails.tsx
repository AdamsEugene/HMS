import { useState, Fragment } from "react";
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
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import BasicInformation from "./tabs/BasicInformation";
import StaffList from "./tabs/StaffList";
import ResourceList from "./tabs/ResourceList";
import WorkflowList from "./tabs/WorkflowList";
import KPIList from "./tabs/KPIList";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  departmentName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  departmentName,
  onClose,
  onConfirm,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center"
                  >
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
                    Delete Department
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                    aria-label="Close dialog"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete{" "}
                    <strong>{departmentName}</strong>? This action cannot be
                    undone and will remove all staff, resources, workflows, and
                    KPIs associated with this department.
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={onConfirm}
                  >
                    Delete Department
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

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

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    setIsDeleteModalOpen(true);
  };

  // Confirm department deletion
  const confirmDeleteDepartment = () => {
    removeDepartment(department.id);
    setIsDeleteModalOpen(false);
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        departmentName={department.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteDepartment}
      />
    </div>
  );
};

export default DepartmentDetails;
