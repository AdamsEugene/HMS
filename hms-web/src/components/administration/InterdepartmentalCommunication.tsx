import { useState, useReducer } from "react";
import { Tab } from "@headlessui/react";
import {
  ArrowPathRoundedSquareIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";

// Import types
import type {
  ReferralTemplate,
  MessageTemplate,
  SharedCalendar,
  InterdepartmentalIntegration,
  CommunicationPolicy,
  // Removing unused imports
  // NewReferralTemplate,
  // NewMessageTemplate,
  // NewSharedCalendar,
  // NewInterdepartmentalIntegration,
  // NewCommunicationPolicy,
} from "./types";

// Sample data for demonstration
const sampleReferralTemplates: ReferralTemplate[] = [
  {
    id: "ref1",
    name: "Cardiology Consultation",
    description: "Template for requesting cardiology consultation",
    sourceDepartment: "dept1",
    targetDepartment: "dept2",
    requiredFields: ["patientId", "reason", "urgency", "clinicalDetails"],
    optionalFields: ["attachments", "previousReports"],
    autoApprove: false,
    status: "Active",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-03-20T09:15:00Z",
  },
  {
    id: "ref2",
    name: "Radiology Request",
    description: "Template for requesting radiological examinations",
    sourceDepartment: "dept3",
    targetDepartment: "dept4",
    requiredFields: ["patientId", "examType", "clinicalIndication"],
    optionalFields: ["priority", "previousExams", "pregnancyStatus"],
    autoApprove: true,
    status: "Active",
    createdAt: "2023-02-10T14:30:00Z",
    updatedAt: "2023-02-10T14:30:00Z",
  },
];

const sampleMessageTemplates: MessageTemplate[] = [
  {
    id: "msg1",
    name: "Lab Results Notification",
    description:
      "Template for notifying departments about critical lab results",
    subject: "Critical Lab Results: {{patientName}}",
    body: "Critical lab results for patient {{patientName}} (ID: {{patientId}}) have been received. Please review immediately: {{resultSummary}}",
    availablePlaceholders: [
      "patientName",
      "patientId",
      "resultSummary",
      "labType",
    ],
    departmentAccess: ["dept1", "dept2", "dept5"],
    category: "Clinical",
    status: "Active",
    createdAt: "2023-01-20T08:45:00Z",
    updatedAt: "2023-01-20T08:45:00Z",
  },
  {
    id: "msg2",
    name: "Emergency Department Notification",
    description: "Alert template for incoming emergency patients",
    subject: "New ED Arrival: {{patientCondition}}",
    body: "Emergency Department is expecting a patient with {{patientCondition}}. ETA: {{estimatedArrival}}. Please prepare necessary resources.",
    availablePlaceholders: [
      "patientCondition",
      "estimatedArrival",
      "requiredResources",
    ],
    departmentAccess: ["dept2", "dept3", "dept6"],
    category: "Emergency",
    status: "Active",
    createdAt: "2023-03-05T18:20:00Z",
    updatedAt: "2023-03-15T11:30:00Z",
  },
];

const sampleSharedCalendars: SharedCalendar[] = [
  {
    id: "cal1",
    name: "Operating Rooms",
    description: "Shared calendar for operating room scheduling",
    departments: ["dept2", "dept7", "dept8"],
    resourceTypes: ["Rooms", "Equipment", "Staff"],
    permissions: [
      {
        departmentId: "dept2",
        canView: true,
        canSchedule: true,
        canModify: true,
        canApprove: true,
      },
      {
        departmentId: "dept7",
        canView: true,
        canSchedule: true,
        canModify: false,
        canApprove: false,
      },
      {
        departmentId: "dept8",
        canView: true,
        canSchedule: false,
        canModify: false,
        canApprove: false,
      },
    ],
    color: "#4f46e5",
    status: "Active",
    createdAt: "2022-12-01T10:00:00Z",
    updatedAt: "2023-01-05T16:45:00Z",
  },
  {
    id: "cal2",
    name: "Diagnostic Equipment",
    description: "Calendar for scheduling diagnostic equipment usage",
    departments: ["dept3", "dept4", "dept9"],
    resourceTypes: ["Equipment"],
    permissions: [
      {
        departmentId: "dept3",
        canView: true,
        canSchedule: true,
        canModify: true,
        canApprove: true,
      },
      {
        departmentId: "dept4",
        canView: true,
        canSchedule: true,
        canModify: true,
        canApprove: false,
      },
      {
        departmentId: "dept9",
        canView: true,
        canSchedule: true,
        canModify: false,
        canApprove: false,
      },
    ],
    color: "#0891b2",
    status: "Active",
    createdAt: "2023-02-15T09:30:00Z",
    updatedAt: "2023-02-15T09:30:00Z",
  },
];

// Sample integrations data
const sampleIntegrations: InterdepartmentalIntegration[] = [
  {
    id: "int-1",
    name: "Clinical Data Exchange",
    description: "Bidirectional exchange of patient data between departments",
    sourceSystem: "Electronic Health Record",
    targetSystem: "Laboratory Information System",
    dataDirection: "Bidirectional",
    integrationMethod: "API",
    departments: ["dept-1", "dept-2"],
    dataFields: [
      { name: "patientId", type: "String", required: true },
      { name: "testResults", type: "Object", required: true },
      { name: "timestamp", type: "Date", required: true },
    ],
    status: "Active",
    createdAt: "2023-01-15T09:00:00Z",
    updatedAt: "2023-01-15T09:00:00Z",
  },
  {
    id: "int-2",
    name: "Radiology Order Integration",
    description: "Send radiology orders from clinical departments",
    sourceSystem: "Order Entry System",
    targetSystem: "Radiology Information System",
    dataDirection: "Unidirectional",
    integrationMethod: "API",
    departments: ["dept-1", "dept-3"],
    dataFields: [
      { name: "orderId", type: "String", required: true },
      { name: "patientInfo", type: "Object", required: true },
      { name: "orderDetails", type: "Object", required: true },
      { name: "priority", type: "String", required: false },
    ],
    status: "Active",
    createdAt: "2023-02-10T14:30:00Z",
    updatedAt: "2023-02-10T14:30:00Z",
  },
  {
    id: "int-3",
    name: "Pharmacy Inventory Sync",
    description: "Synchronize pharmaceutical inventory data",
    sourceSystem: "Pharmacy Management System",
    targetSystem: "Inventory Management System",
    dataDirection: "Bidirectional",
    integrationMethod: "Database",
    departments: ["dept-2", "dept-4"],
    dataFields: [
      { name: "medicationId", type: "String", required: true },
      { name: "quantity", type: "Number", required: true },
      { name: "batchNumber", type: "String", required: true },
      { name: "expirationDate", type: "Date", required: true },
    ],
    status: "Testing",
    createdAt: "2023-03-05T11:15:00Z",
    updatedAt: "2023-03-05T11:15:00Z",
  },
];

// Sample communication policies data
const samplePolicies: CommunicationPolicy[] = [
  {
    id: "pol-1",
    name: "Patient Data Privacy Policy",
    description:
      "Guidelines for sharing patient information between departments",
    policyType: "Privacy",
    departments: ["dept-1", "dept-2", "dept-3"],
    effectiveDate: "2023-01-01",
    reviewFrequency: "Quarterly",
    affectedChannels: ["Email", "Chat", "Document"],
    policyText:
      "All patient data shared between departments must be de-identified...",
    status: "Active",
    createdAt: "2022-12-15T10:00:00Z",
    updatedAt: "2022-12-15T10:00:00Z",
  },
  {
    id: "pol-2",
    name: "Interdepartmental Communication Security",
    description:
      "Security requirements for all interdepartmental communications",
    policyType: "Security",
    departments: ["dept-1", "dept-2", "dept-3", "dept-4"],
    effectiveDate: "2023-02-01",
    reviewFrequency: "Quarterly",
    affectedChannels: ["Email", "Chat", "Video", "Phone"],
    policyText:
      "All communications containing sensitive information must be encrypted...",
    status: "Active",
    createdAt: "2023-01-20T14:30:00Z",
    updatedAt: "2023-01-20T14:30:00Z",
  },
  {
    id: "pol-3",
    name: "Emergency Department Consultation Protocol",
    description: "Protocol for requesting consultations from specialists",
    policyType: "Operational",
    departments: ["dept-1", "dept-3"],
    effectiveDate: "2023-03-15",
    expirationDate: "2024-03-15",
    reviewFrequency: "Biannually",
    affectedChannels: ["Phone", "Document"],
    policyText:
      "Emergency consultations must be initiated via direct phone call...",
    status: "Draft",
    createdAt: "2023-03-01T09:45:00Z",
    updatedAt: "2023-03-01T09:45:00Z",
  },
];

// Map department IDs to names (would come from API in real application)
const departmentNames: Record<string, string> = {
  dept1: "Internal Medicine",
  dept2: "Cardiology",
  dept3: "Emergency Department",
  dept4: "Radiology",
  dept5: "Laboratory",
  dept6: "Intensive Care Unit",
  dept7: "Surgery",
  dept8: "Anesthesiology",
  dept9: "Neurology",
  dept10: "Pharmacy",
};

// Main component
const InterdepartmentalCommunication = () => {
  // Add useReducer for forceUpdate functionality
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // State for all communication types
  const [referralTemplates, setReferralTemplates] = useState<
    ReferralTemplate[]
  >(sampleReferralTemplates);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(
    sampleMessageTemplates
  );
  const [sharedCalendars, setSharedCalendars] = useState<SharedCalendar[]>(
    sampleSharedCalendars
  );
  const [integrations, setIntegrations] =
    useState<InterdepartmentalIntegration[]>(sampleIntegrations);
  const [policies, setPolicies] =
    useState<CommunicationPolicy[]>(samplePolicies);

  // State for selected tab and items
  const [selectedReferral, setSelectedReferral] =
    useState<ReferralTemplate | null>(null);
  const [selectedMessage, setSelectedMessage] =
    useState<MessageTemplate | null>(null);
  const [selectedCalendar, setSelectedCalendar] =
    useState<SharedCalendar | null>(null);
  const [selectedIntegration, setSelectedIntegration] =
    useState<InterdepartmentalIntegration | null>(null);
  const [selectedPolicy, setSelectedPolicy] =
    useState<CommunicationPolicy | null>(null);

  // State for modal visibility
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // Category tabs
  const categories = [
    { name: "Referrals", icon: ArrowPathRoundedSquareIcon },
    { name: "Messaging", icon: EnvelopeIcon },
    { name: "Shared Calendars", icon: CalendarIcon },
    { name: "Integrations", icon: ArrowsRightLeftIcon },
    { name: "Policies", icon: DocumentTextIcon },
  ];

  // Function to handle form submissions
  const handleReferralSubmit = (data: Partial<ReferralTemplate>) => {
    if (selectedReferral) {
      // Update existing template
      setReferralTemplates((prev) =>
        prev.map((template) =>
          template.id === selectedReferral.id
            ? ({
                ...selectedReferral,
                ...data,
                updatedAt: new Date().toISOString(),
              } as ReferralTemplate)
            : template
        )
      );
    } else {
      // Create new template
      const newTemplate: ReferralTemplate = {
        id: `ref${referralTemplates.length + 1}`,
        ...(data as Omit<ReferralTemplate, "id">),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ReferralTemplate;

      setReferralTemplates((prev) => [...prev, newTemplate]);
    }
    setIsReferralModalOpen(false);
  };

  const handleMessageSubmit = (data: Partial<MessageTemplate>) => {
    if (selectedMessage) {
      // Update existing template
      setMessageTemplates((prev) =>
        prev.map((template) =>
          template.id === selectedMessage.id
            ? ({
                ...selectedMessage,
                ...data,
                updatedAt: new Date().toISOString(),
              } as MessageTemplate)
            : template
        )
      );
    } else {
      // Create new template
      const newTemplate: MessageTemplate = {
        id: `msg${messageTemplates.length + 1}`,
        ...(data as Omit<MessageTemplate, "id">),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as MessageTemplate;

      setMessageTemplates((prev) => [...prev, newTemplate]);
    }
    setIsMessageModalOpen(false);
  };

  const handleCalendarSubmit = (data: Partial<SharedCalendar>) => {
    if (selectedCalendar) {
      // Update existing calendar
      setSharedCalendars((prev) =>
        prev.map((calendar) =>
          calendar.id === selectedCalendar.id
            ? ({
                ...selectedCalendar,
                ...data,
                updatedAt: new Date().toISOString(),
              } as SharedCalendar)
            : calendar
        )
      );
    } else {
      // Create new calendar
      const newCalendar: SharedCalendar = {
        id: `cal${sharedCalendars.length + 1}`,
        ...(data as Omit<SharedCalendar, "id">),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as SharedCalendar;

      setSharedCalendars((prev) => [...prev, newCalendar]);
    }
    setIsCalendarModalOpen(false);
  };

  const handleIntegrationSubmit = (
    data: Partial<InterdepartmentalIntegration>
  ) => {
    if (selectedIntegration) {
      // Update existing integration
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === selectedIntegration.id
            ? ({
                ...selectedIntegration,
                ...data,
                updatedAt: new Date().toISOString(),
              } as InterdepartmentalIntegration)
            : integration
        )
      );
    } else {
      // Create new integration
      const newIntegration: InterdepartmentalIntegration = {
        id: `int${integrations.length + 1}`,
        ...(data as Omit<InterdepartmentalIntegration, "id">),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as InterdepartmentalIntegration;

      setIntegrations((prev) => [...prev, newIntegration]);
    }
    setIsIntegrationModalOpen(false);
  };

  const handlePolicySubmit = (data: Partial<CommunicationPolicy>) => {
    if (selectedPolicy) {
      // Update existing policy
      setPolicies((prev) =>
        prev.map((policy) =>
          policy.id === selectedPolicy.id
            ? ({
                ...selectedPolicy,
                ...data,
                updatedAt: new Date().toISOString(),
              } as CommunicationPolicy)
            : policy
        )
      );
    } else {
      // Create new policy
      const newPolicy: CommunicationPolicy = {
        id: `pol${policies.length + 1}`,
        ...(data as Omit<CommunicationPolicy, "id">),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CommunicationPolicy;

      setPolicies((prev) => [...prev, newPolicy]);
    }
    setIsPolicyModalOpen(false);
  };

  // Function to handle deletion
  const handleDeleteReferral = (id: string) => {
    setReferralTemplates((prev) =>
      prev.filter((template) => template.id !== id)
    );
  };

  const handleDeleteMessage = (id: string) => {
    setMessageTemplates((prev) =>
      prev.filter((template) => template.id !== id)
    );
  };

  const handleDeleteCalendar = (id: string) => {
    setSharedCalendars((prev) => prev.filter((calendar) => calendar.id !== id));
  };

  const handleDeleteIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.filter((integration) => integration.id !== id)
    );
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies((prev) => prev.filter((policy) => policy.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-50 dark:bg-gray-700 rounded-t-lg">
          {categories.map((category) => (
            <Tab
              key={category.name}
              className={({ selected }) =>
                cn(
                  "w-full py-2.5 text-sm font-medium leading-5 rounded-lg flex items-center justify-center",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-blue-500 ring-opacity-60",
                  selected
                    ? "bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] dark:hover:bg-gray-800/[0.12]"
                )
              }
            >
              <category.icon className="w-5 h-5 mr-2" />
              {category.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="p-4">
          {/* Referral Templates Panel */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Referral Templates
              </h3>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => {
                  setSelectedReferral(null);
                  setIsReferralModalOpen(true);
                }}
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                Add Template
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Source Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Target Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Auto Approve
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {referralTemplates.map((template) => (
                    <tr
                      key={template.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {departmentNames[template.sourceDepartment] ||
                          template.sourceDepartment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {departmentNames[template.targetDepartment] ||
                          template.targetDepartment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {template.autoApprove ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            template.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                              : template.status === "Draft"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                                : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                          )}
                        >
                          {template.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          onClick={() => {
                            setSelectedReferral(template);
                            setIsReferralModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDeleteReferral(template.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>

          {/* Message Templates Panel */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Message Templates
              </h3>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => {
                  setSelectedMessage(null);
                  setIsMessageModalOpen(true);
                }}
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                Add Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messageTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedMessage(template);
                    setIsMessageModalOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h4>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs leading-4 font-semibold rounded-full",
                        template.category === "Clinical"
                          ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                          : template.category === "Emergency"
                            ? "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                            : template.category === "Administrative"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900"
                      )}
                    >
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.subject}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Available to:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.departmentAccess
                        .map((deptId) => departmentNames[deptId] || deptId)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(template.id);
                      }}
                    >
                      Delete
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* Shared Calendars Panel */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Shared Calendars
              </h3>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => {
                  setSelectedCalendar(null);
                  setIsCalendarModalOpen(true);
                }}
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                Add Calendar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedCalendars.map((calendar) => (
                <div
                  key={calendar.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600"
                >
                  <div
                    className="p-1"
                    style={{ backgroundColor: calendar.color }}
                  ></div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        {calendar.name}
                      </h4>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs leading-4 font-semibold rounded-full",
                          calendar.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                            : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                        )}
                      >
                        {calendar.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {calendar.description}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Departments:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {calendar.departments
                          .map((deptId) => departmentNames[deptId] || deptId)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resource Types:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {calendar.resourceTypes.join(", ")}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm mr-3"
                        onClick={() => {
                          setSelectedCalendar(calendar);
                          setIsCalendarModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        onClick={() => handleDeleteCalendar(calendar.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* Integrations Panel */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Integrations
              </h3>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => {
                  setSelectedIntegration(null);
                  setIsIntegrationModalOpen(true);
                }}
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                Add Integration
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Integration Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Source → Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {integrations.map((integration) => (
                    <tr
                      key={integration.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {integration.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {integration.sourceSystem} → {integration.targetSystem}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {integration.integrationMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            integration.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                              : integration.status === "Testing"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                                : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                          )}
                        >
                          {integration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          onClick={() => {
                            setSelectedIntegration(integration);
                            setIsIntegrationModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() =>
                            handleDeleteIntegration(integration.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>

          {/* Policies Panel */}
          <Tab.Panel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Communication Policies
              </h3>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => {
                  setSelectedPolicy(null);
                  setIsPolicyModalOpen(true);
                }}
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                Add Policy
              </button>
            </div>

            <div className="space-y-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 border-l-4"
                  style={{
                    borderLeftColor:
                      policy.policyType === "Privacy"
                        ? "#3B82F6"
                        : policy.policyType === "Security"
                          ? "#EF4444"
                          : policy.policyType === "Operational"
                            ? "#F59E0B"
                            : "#6366F1",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        {policy.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {policy.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs leading-4 font-semibold rounded-full",
                        policy.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                          : policy.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                            : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                      )}
                    >
                      {policy.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Policy Type:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {policy.policyType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Departments:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {policy.departments
                          .map((deptId) => departmentNames[deptId] || deptId)
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Effective Date:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(policy.effectiveDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Review Frequency:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {policy.reviewFrequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Updated:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(policy.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Affected Channels:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {policy.affectedChannels.join(", ")}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm mr-3"
                      onClick={() => {
                        setSelectedPolicy(policy);
                        setIsPolicyModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                      onClick={() => handleDeletePolicy(policy.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Modal for Referral Templates */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedReferral
                ? "Edit Referral Template"
                : "Create Referral Template"}
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                handleReferralSubmit({
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  sourceDepartment: formData.get("sourceDepartment") as string,
                  targetDepartment: formData.get("targetDepartment") as string,
                  requiredFields: (formData.get("requiredFields") as string)
                    .split(",")
                    .map((f) => f.trim()),
                  optionalFields: (formData.get("optionalFields") as string)
                    .split(",")
                    .map((f) => f.trim()),
                  autoApprove: formData.get("autoApprove") === "true",
                  status: formData.get("status") as
                    | "Active"
                    | "Draft"
                    | "Archived",
                });
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedReferral?.name || ""}
                    required
                    title="Template Name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedReferral?.description || ""}
                    required
                    title="Template Description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Source Department
                  </label>
                  <select
                    name="sourceDepartment"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedReferral?.sourceDepartment || ""}
                    required
                    aria-label="Source Department"
                  >
                    <option value="">Select Department</option>
                    {Object.entries(departmentNames).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Department
                  </label>
                  <select
                    name="targetDepartment"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedReferral?.targetDepartment || ""}
                    required
                    aria-label="Target Department"
                  >
                    <option value="">Select Department</option>
                    {Object.entries(departmentNames).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Required Fields
                  </label>
                  <input
                    type="text"
                    name="requiredFields"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={
                      selectedReferral?.requiredFields.join(", ") || ""
                    }
                    placeholder="patientId, reason, ..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Optional Fields
                  </label>
                  <input
                    type="text"
                    name="optionalFields"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={
                      selectedReferral?.optionalFields.join(", ") || ""
                    }
                    placeholder="attachments, notes, ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Approve
                  </label>
                  <select
                    name="autoApprove"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={
                      selectedReferral?.autoApprove ? "true" : "false"
                    }
                    required
                    aria-label="Auto Approve"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedReferral?.status || "Draft"}
                    required
                    aria-label="Status"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={() => setIsReferralModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {selectedReferral ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Message Templates */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedMessage
                ? "Edit Message Template"
                : "Create Message Template"}
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                handleMessageSubmit({
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  subject: formData.get("subject") as string,
                  body: formData.get("body") as string,
                  availablePlaceholders: (
                    formData.get("availablePlaceholders") as string
                  )
                    .split(",")
                    .map((p) => p.trim()),
                  departmentAccess: Array.from(
                    formData.getAll("departmentAccess") as string[]
                  ),
                  category: formData.get("category") as
                    | "Clinical"
                    | "Administrative"
                    | "Emergency"
                    | "General",
                  status: formData.get("status") as
                    | "Active"
                    | "Draft"
                    | "Archived",
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedMessage?.name || ""}
                    required
                    title="Template Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedMessage?.description || ""}
                    required
                    title="Template Description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedMessage?.subject || ""}
                    required
                    title="Message Subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Body
                  </label>
                  <textarea
                    name="body"
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedMessage?.body || ""}
                    required
                    title="Message Body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available Placeholders
                  </label>
                  <input
                    type="text"
                    name="availablePlaceholders"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={
                      selectedMessage?.availablePlaceholders.join(", ") || ""
                    }
                    placeholder="patientName, patientId, ..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="category"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedMessage?.category || "General"}
                    required
                    aria-label="Category"
                  >
                    <option value="Clinical">Clinical</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Emergency">Emergency</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department Access
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {Object.entries(departmentNames).map(([id, name]) => (
                      <div key={id} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`dept-${id}`}
                          name="departmentAccess"
                          value={id}
                          defaultChecked={selectedMessage?.departmentAccess.includes(
                            id
                          )}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          aria-label={`Department ${name} access`}
                        />
                        <label
                          htmlFor={`dept-${id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedMessage?.status || "Draft"}
                    required
                    aria-label="Status"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={() => setIsMessageModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {selectedMessage ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Shared Calendars */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCalendar
                ? "Edit Shared Calendar"
                : "Create Shared Calendar"}
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                // Convert selected departments and resource types
                const selectedDepartments = Array.from(
                  formData.getAll("departments") as string[]
                );
                const selectedResourceTypes = Array.from(
                  formData.getAll("resourceTypes") as string[]
                );

                // Build permissions array from department checkboxes
                const permissions = selectedDepartments.map((deptId) => {
                  return {
                    departmentId: deptId,
                    canView: formData.get(`${deptId}_view`) === "on",
                    canSchedule: formData.get(`${deptId}_schedule`) === "on",
                    canModify: formData.get(`${deptId}_modify`) === "on",
                    canApprove: formData.get(`${deptId}_approve`) === "on",
                  };
                });

                handleCalendarSubmit({
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  departments: selectedDepartments,
                  resourceTypes: selectedResourceTypes as (
                    | "Rooms"
                    | "Equipment"
                    | "Staff"
                    | "Other"
                  )[],
                  permissions: permissions,
                  color: formData.get("color") as string,
                  status: formData.get("status") as "Active" | "Inactive",
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Calendar Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedCalendar?.name || ""}
                    required
                    title="Calendar Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedCalendar?.description || ""}
                    required
                    title="Calendar Description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Departments
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {Object.entries(departmentNames).map(([id, name]) => (
                      <div key={id} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`dept-cal-${id}`}
                          name="departments"
                          value={id}
                          defaultChecked={selectedCalendar?.departments.includes(
                            id
                          )}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          aria-label={`Department ${name}`}
                        />
                        <label
                          htmlFor={`dept-cal-${id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resource Types
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["Rooms", "Equipment", "Staff", "Other"].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`resource-${type}`}
                          name="resourceTypes"
                          value={type}
                          defaultChecked={selectedCalendar?.resourceTypes.includes(
                            type as "Rooms" | "Equipment" | "Staff" | "Other"
                          )}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          aria-label={`Resource type ${type}`}
                        />
                        <label
                          htmlFor={`resource-${type}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Calendar Color
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      type="color"
                      name="color"
                      className="h-8 w-12 border-gray-300 rounded"
                      defaultValue={selectedCalendar?.color || "#4f46e5"}
                      required
                      title="Calendar Color"
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      Pick a color for the calendar display
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedCalendar?.status || "Active"}
                    required
                    aria-label="Status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Department Permissions
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Set permissions for each department. Departments not
                    selected above will not be included.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            View
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Schedule
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Modify
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Approve
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.entries(departmentNames).map(([id, name]) => {
                          const deptPermissions =
                            selectedCalendar?.permissions.find(
                              (p) => p.departmentId === id
                            );

                          return (
                            <tr key={id}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  name={`${id}_view`}
                                  defaultChecked={
                                    deptPermissions?.canView ?? true
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                  aria-label={`${name} view permission`}
                                />
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  name={`${id}_schedule`}
                                  defaultChecked={
                                    deptPermissions?.canSchedule ?? false
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                  aria-label={`${name} schedule permission`}
                                />
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  name={`${id}_modify`}
                                  defaultChecked={
                                    deptPermissions?.canModify ?? false
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                  aria-label={`${name} modify permission`}
                                />
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  name={`${id}_approve`}
                                  defaultChecked={
                                    deptPermissions?.canApprove ?? false
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                  aria-label={`${name} approve permission`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={() => setIsCalendarModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {selectedCalendar ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Integrations */}
      {isIntegrationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedIntegration ? "Edit Integration" : "Create Integration"}
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                // Get the selected departments
                const selectedDepartments = Array.from(
                  formData.getAll("departments") as string[]
                );

                // Create dataFields from the dynamically added fields
                const dataFieldsCount = parseInt(
                  formData.get("dataFieldsCount") as string,
                  10
                );
                const dataFields = [];

                for (let i = 0; i < dataFieldsCount; i++) {
                  const fieldName = formData.get(`field_name_${i}`) as string;
                  const fieldType = formData.get(`field_type_${i}`) as string;
                  const fieldRequired =
                    formData.get(`field_required_${i}`) === "on";

                  if (fieldName && fieldType) {
                    dataFields.push({
                      name: fieldName,
                      type: fieldType,
                      required: fieldRequired,
                    });
                  }
                }

                handleIntegrationSubmit({
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  sourceSystem: formData.get("sourceSystem") as string,
                  targetSystem: formData.get("targetSystem") as string,
                  dataDirection: formData.get("dataDirection") as
                    | "Unidirectional"
                    | "Bidirectional",
                  integrationMethod: formData.get("integrationMethod") as
                    | "API"
                    | "File"
                    | "Database"
                    | "Custom",
                  departments: selectedDepartments,
                  status: formData.get("status") as
                    | "Active"
                    | "Inactive"
                    | "Testing",
                  dataFields: dataFields,
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Integration Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedIntegration?.name || ""}
                    required
                    title="Integration Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedIntegration?.description || ""}
                    required
                    title="Integration Description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Source System
                    </label>
                    <input
                      type="text"
                      name="sourceSystem"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={selectedIntegration?.sourceSystem || ""}
                      required
                      title="Source System"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Target System
                    </label>
                    <input
                      type="text"
                      name="targetSystem"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={selectedIntegration?.targetSystem || ""}
                      required
                      title="Target System"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data Direction
                    </label>
                    <select
                      name="dataDirection"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={
                        selectedIntegration?.dataDirection || "Unidirectional"
                      }
                      required
                      aria-label="Data Direction"
                    >
                      <option value="Unidirectional">Unidirectional</option>
                      <option value="Bidirectional">Bidirectional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Integration Method
                    </label>
                    <select
                      name="integrationMethod"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={
                        selectedIntegration?.integrationMethod || "API"
                      }
                      required
                      aria-label="Integration Method"
                    >
                      <option value="API">API</option>
                      <option value="File">File Transfer</option>
                      <option value="Database">Database Connection</option>
                      <option value="Custom">Custom Method</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Departments
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {Object.entries(departmentNames).map(([id, name]) => (
                      <div key={id} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`dept-int-${id}`}
                          name="departments"
                          value={id}
                          defaultChecked={selectedIntegration?.departments.includes(
                            id
                          )}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          aria-label={`Department ${name}`}
                        />
                        <label
                          htmlFor={`dept-int-${id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedIntegration?.status || "Inactive"}
                    required
                    aria-label="Status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">
                      Data Fields
                    </h3>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        const countField = document.querySelector(
                          '[name="dataFieldsCount"]'
                        ) as HTMLInputElement;
                        const currentCount = parseInt(countField.value, 10);
                        countField.value = (currentCount + 1).toString();

                        // Force re-render to show new field
                        forceUpdate();
                      }}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" /> Add Field
                    </button>
                  </div>

                  <input
                    type="hidden"
                    name="dataFieldsCount"
                    defaultValue={selectedIntegration?.dataFields.length || 1}
                  />

                  <div className="space-y-3">
                    {/* Dynamic fields will go here based on the count */}
                    {Array.from({
                      length: selectedIntegration?.dataFields.length || 1,
                    }).map((_, index) => {
                      const field = selectedIntegration?.dataFields[index] || {
                        name: "",
                        type: "String",
                        required: false,
                      };

                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2 items-center border border-gray-200 dark:border-gray-700 p-2 rounded-md"
                        >
                          <div className="col-span-5">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Field Name
                            </label>
                            <input
                              type="text"
                              name={`field_name_${index}`}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                              defaultValue={field.name}
                              required
                              title="Field Name"
                            />
                          </div>
                          <div className="col-span-5">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Data Type
                            </label>
                            <select
                              name={`field_type_${index}`}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                              defaultValue={field.type}
                              required
                              aria-label="Data Type"
                            >
                              <option value="String">String</option>
                              <option value="Number">Number</option>
                              <option value="Boolean">Boolean</option>
                              <option value="Date">Date</option>
                              <option value="Object">Object</option>
                              <option value="Array">Array</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Required
                            </label>
                            <div className="flex items-center h-8">
                              <input
                                type="checkbox"
                                name={`field_required_${index}`}
                                defaultChecked={field.required}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                aria-label="Required field"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={() => setIsIntegrationModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {selectedIntegration ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Policies */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedPolicy
                ? "Edit Communication Policy"
                : "Create Communication Policy"}
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                // Get selected departments
                const selectedDepartments = Array.from(
                  formData.getAll("departments") as string[]
                );

                // Get affected channels
                const affectedChannels = [];
                if (formData.get("channel_email") === "on")
                  affectedChannels.push("Email");
                if (formData.get("channel_chat") === "on")
                  affectedChannels.push("Chat");
                if (formData.get("channel_video") === "on")
                  affectedChannels.push("Video");
                if (formData.get("channel_phone") === "on")
                  affectedChannels.push("Phone");
                if (formData.get("channel_document") === "on")
                  affectedChannels.push("Document");

                handlePolicySubmit({
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  policyType: formData.get("policyType") as
                    | "Privacy"
                    | "Security"
                    | "Operational"
                    | "Compliance",
                  departments: selectedDepartments,
                  effectiveDate: formData.get("effectiveDate") as string,
                  expirationDate:
                    (formData.get("expirationDate") as string) || undefined,
                  affectedChannels: affectedChannels as (
                    | "Email"
                    | "Chat"
                    | "Video"
                    | "Phone"
                    | "Document"
                  )[],
                  status: formData.get("status") as
                    | "Active"
                    | "Draft"
                    | "Archived",
                  reviewFrequency: formData.get("reviewFrequency") as
                    | "Monthly"
                    | "Quarterly"
                    | "Annually"
                    | "Biannually",
                  policyText: formData.get("policyText") as string,
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Policy Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedPolicy?.name || ""}
                    required
                    title="Policy Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedPolicy?.description || ""}
                    required
                    title="Policy Description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Policy Type
                    </label>
                    <select
                      name="policyType"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={selectedPolicy?.policyType || "Operational"}
                      required
                      aria-label="Policy Type"
                    >
                      <option value="Privacy">Privacy</option>
                      <option value="Security">Security</option>
                      <option value="Operational">Operational</option>
                      <option value="Compliance">Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      name="status"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={selectedPolicy?.status || "Draft"}
                      required
                      aria-label="Status"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      name="effectiveDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={
                        selectedPolicy?.effectiveDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
                      title="Effective Date"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expiration Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="expirationDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={selectedPolicy?.expirationDate || ""}
                      title="Expiration Date"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Review Frequency
                  </label>
                  <select
                    name="reviewFrequency"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={
                      selectedPolicy?.reviewFrequency || "Quarterly"
                    }
                    required
                    aria-label="Review Frequency"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Biannually">Biannually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Departments
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {Object.entries(departmentNames).map(([id, name]) => (
                      <div key={id} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`dept-pol-${id}`}
                          name="departments"
                          value={id}
                          defaultChecked={selectedPolicy?.departments.includes(
                            id
                          )}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          aria-label={`Department ${name}`}
                        />
                        <label
                          htmlFor={`dept-pol-${id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Affected Communication Channels
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["Email", "Chat", "Video", "Phone", "Document"].map(
                      (channel) => (
                        <div key={channel} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`channel-${channel.toLowerCase()}`}
                            name={`channel_${channel.toLowerCase()}`}
                            defaultChecked={selectedPolicy?.affectedChannels.includes(
                              channel as
                                | "Email"
                                | "Chat"
                                | "Video"
                                | "Phone"
                                | "Document"
                            )}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            aria-label={`Channel ${channel}`}
                          />
                          <label
                            htmlFor={`channel-${channel.toLowerCase()}`}
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {channel}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Policy Text
                  </label>
                  <textarea
                    name="policyText"
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    defaultValue={selectedPolicy?.policyText || ""}
                    required
                    title="Policy Text"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={() => setIsPolicyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {selectedPolicy ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterdepartmentalCommunication;
