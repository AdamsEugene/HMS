import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  BuildingOffice2Icon,
  UsersIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  BookmarkIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../utils/cn";
import DecorativePattern from "../components/dashboard/DecorativePattern";
import DashboardBanner from "../components/dashboard/DashboardBanner";
import StatsOverviewCard from "../components/dashboard/StatsOverviewCard";
// Import all styles
import "../styles/dashboard.css";
import "../styles/customization.css";
import { useTheme } from "../contexts/ThemeContext";

// Main modules in the Administration section
const administrationModules = [
  {
    id: "hospital-profile",
    name: "Hospital Profile",
    description: "Manage hospital details, accreditations, and certifications",
    icon: BuildingOffice2Icon,
  },
  {
    id: "department-management",
    name: "Department Management",
    description:
      "Define structures, workflows, resources, and KPIs for departments",
    icon: UserGroupIcon,
  },
  {
    id: "system-configuration",
    name: "System Configuration",
    description:
      "Configure department setup, pricing models, and operational hours",
    icon: Cog6ToothIcon,
  },
  {
    id: "master-data",
    name: "Master Data Management",
    description: "Manage diagnostic codes, procedure codes, and formularies",
    icon: DocumentDuplicateIcon,
  },
  {
    id: "user-role-management",
    name: "User Role Management",
    description: "Define user roles, permissions, and access controls",
    icon: UsersIcon,
  },
  {
    id: "interdepartmental",
    name: "Interdepartmental Communication",
    description: "Configure referrals, messaging systems, and shared calendars",
    icon: ArrowsRightLeftIcon,
  },
];

// Hospital profile data
interface Accreditation {
  id: string;
  name: string;
  issuedBy: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Pending";
}

interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Pending";
}

interface HospitalProfile {
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

const Administration = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { getCardStyle, currentTheme, getGradientBackground } = useTheme();
  const cardStyle = getCardStyle();
  const gradients = getGradientBackground(currentTheme);

  // Hospital profile state
  const [hospitalProfile, setHospitalProfile] = useState<HospitalProfile>({
    name: "MediHub Central Hospital",
    type: "General Hospital",
    address: "123 Healthcare Avenue, Medical District, MD 12345",
    phone: "(555) 123-4567",
    email: "contact@medihubcentral.org",
    website: "www.medihubcentral.org",
    establishedYear: "1985",
    capacity: {
      beds: 500,
      operatingRooms: 15,
      emergencyRooms: 25,
    },
    accreditations: [
      {
        id: "acc1",
        name: "Joint Commission International (JCI)",
        issuedBy: "Joint Commission International",
        expirationDate: "2025-12-31",
        status: "Active",
      },
      {
        id: "acc2",
        name: "Healthcare Facilities Accreditation Program (HFAP)",
        issuedBy: "Accreditation Association for Hospitals",
        expirationDate: "2024-06-30",
        status: "Active",
      },
    ],
    certifications: [
      {
        id: "cert1",
        name: "Center of Excellence - Oncology",
        issuedBy: "National Oncology Board",
        expirationDate: "2026-03-15",
        status: "Active",
      },
      {
        id: "cert2",
        name: "Stroke Center Certification",
        issuedBy: "Stroke Care Alliance",
        expirationDate: "2024-08-22",
        status: "Active",
      },
    ],
  });

  // State for new accreditation/certification dialogs
  const [showAccreditationForm, setShowAccreditationForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [newAccreditation, setNewAccreditation] = useState<
    Omit<Accreditation, "id">
  >({
    name: "",
    issuedBy: "",
    expirationDate: "",
    status: "Active",
  });
  const [newCertification, setNewCertification] = useState<
    Omit<Certification, "id">
  >({
    name: "",
    issuedBy: "",
    expirationDate: "",
    status: "Active",
  });

  // Functions for managing hospital profile data
  const updateProfileField = <K extends keyof HospitalProfile>(
    field: K,
    value: HospitalProfile[K]
  ) => {
    setHospitalProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCapacityField = (
    field: keyof HospitalProfile["capacity"],
    value: number
  ) => {
    setHospitalProfile((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [field]: value,
      },
    }));
  };

  const addAccreditation = () => {
    if (newAccreditation.name && newAccreditation.issuedBy) {
      const id = `acc${Date.now()}`;
      setHospitalProfile((prev) => ({
        ...prev,
        accreditations: [...prev.accreditations, { ...newAccreditation, id }],
      }));
      setNewAccreditation({
        name: "",
        issuedBy: "",
        expirationDate: "",
        status: "Active",
      });
      setShowAccreditationForm(false);
    }
  };

  const removeAccreditation = (id: string) => {
    setHospitalProfile((prev) => ({
      ...prev,
      accreditations: prev.accreditations.filter((acc) => acc.id !== id),
    }));
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.issuedBy) {
      const id = `cert${Date.now()}`;
      setHospitalProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, { ...newCertification, id }],
      }));
      setNewCertification({
        name: "",
        issuedBy: "",
        expirationDate: "",
        status: "Active",
      });
      setShowCertificationForm(false);
    }
  };

  const removeCertification = (id: string) => {
    setHospitalProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  // Administrative theme color - using CSS variable instead of hardcoded color
  const adminThemeColor = "var(--color-primary)";

  return (
    <div className="relative container-administrative">
      {/* Background decorative pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DecorativePattern
          type="circles"
          color={adminThemeColor}
          opacity={0.05}
          density="low"
          animate={true}
        />
      </div>

      {/* Set z-index to ensure header dropdowns appear above the content */}
      <div className="relative">
        {/* Use DashboardBanner for consistency */}
        <DashboardBanner
          userName="Administrator"
          hospitalName="Hospital Administration"
        />

        {/* Content with lower z-index than header dropdowns */}
        <div className="relative">
          {/* Key Stats for Administration */}
          <StatsOverviewCard
            title="Administration Overview"
            patternType="waves"
            className="mb-6"
            stats={[
              {
                label: "Total Departments",
                value: "24",
                change: {
                  value: "2",
                  isIncrease: true,
                },
                icon: <UserGroupIcon className="h-5 w-5" />,
              },
              {
                label: "Active Users",
                value: "512",
                change: {
                  value: "5%",
                  isIncrease: true,
                },
                icon: <UsersIcon className="h-5 w-5" />,
              },
              {
                label: "System Updates",
                value: "3",
                change: {
                  value: "",
                  isIncrease: false,
                },
                icon: <Cog6ToothIcon className="h-5 w-5" />,
              },
              {
                label: "Configuration Changes",
                value: "128",
                change: {
                  value: "12%",
                  isIncrease: true,
                },
                icon: <DocumentDuplicateIcon className="h-5 w-5" />,
              },
            ]}
          />

          {/* Administration Modules */}
          <div
            className="card backdrop-filter backdrop-blur-md mb-6 overflow-hidden shadow-lg"
            style={{
              ...cardStyle,
              background: gradients.content,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
              <div className="bg-gradient-primary p-4">
                <Tab.List className="flex flex-wrap gap-2">
                  {administrationModules.map((module) => (
                    <Tab
                      key={module.id}
                      className={({ selected }) =>
                        cn(
                          "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-all",
                          "focus:outline-none whitespace-nowrap",
                          selected
                            ? "bg-gradient-button text-white shadow-md"
                            : "bg-white bg-opacity-10 text-white hover:bg-opacity-20 hover:text-white"
                        )
                      }
                    >
                      <module.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{module.name}</span>
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="bg-white dark:bg-gray-800 custom-scrollbar">
                {administrationModules.map((module) => (
                  <Tab.Panel key={module.id} className="p-6 animate-fade-in-up">
                    <div className="p-4 mb-6 rounded-lg bg-gradient-card backdrop-filter backdrop-blur-md">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                        <module.icon className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                        {module.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {module.description}
                      </p>
                    </div>

                    {module.id === "hospital-profile" ? (
                      <div className="space-y-6">
                        {/* Hospital Basic Information */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 flex items-center">
                            <BuildingOffice2Icon className="h-5 w-5 text-primary mr-2" />
                            Basic Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label
                                htmlFor="hospital-name"
                                className="form-label"
                              >
                                Hospital Name
                              </label>
                              <input
                                id="hospital-name"
                                type="text"
                                className="form-input"
                                value={hospitalProfile.name}
                                onChange={(e) =>
                                  updateProfileField("name", e.target.value)
                                }
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="hospital-type"
                                className="form-label"
                              >
                                Hospital Type
                              </label>
                              <select
                                id="hospital-type"
                                className="form-select"
                                value={hospitalProfile.type}
                                onChange={(e) =>
                                  updateProfileField("type", e.target.value)
                                }
                              >
                                <option value="General Hospital">
                                  General Hospital
                                </option>
                                <option value="Specialty Hospital">
                                  Specialty Hospital
                                </option>
                                <option value="Teaching Hospital">
                                  Teaching Hospital
                                </option>
                                <option value="Rehabilitation Center">
                                  Rehabilitation Center
                                </option>
                                <option value="Children's Hospital">
                                  Children's Hospital
                                </option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label
                                htmlFor="hospital-address"
                                className="form-label"
                              >
                                Address
                              </label>
                              <input
                                id="hospital-address"
                                type="text"
                                className="form-input"
                                value={hospitalProfile.address}
                                onChange={(e) =>
                                  updateProfileField("address", e.target.value)
                                }
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="hospital-phone"
                                className="form-label"
                              >
                                Phone Number
                              </label>
                              <div className="flex items-center">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <input
                                  id="hospital-phone"
                                  type="tel"
                                  className="form-input flex-1"
                                  value={hospitalProfile.phone}
                                  onChange={(e) =>
                                    updateProfileField("phone", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="hospital-email"
                                className="form-label"
                              >
                                Email Address
                              </label>
                              <div className="flex items-center">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <input
                                  id="hospital-email"
                                  type="email"
                                  className="form-input flex-1"
                                  value={hospitalProfile.email}
                                  onChange={(e) =>
                                    updateProfileField("email", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="hospital-website"
                                className="form-label"
                              >
                                Website
                              </label>
                              <div className="flex items-center">
                                <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <input
                                  id="hospital-website"
                                  type="text"
                                  className="form-input flex-1"
                                  value={hospitalProfile.website}
                                  onChange={(e) =>
                                    updateProfileField(
                                      "website",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="hospital-year"
                                className="form-label"
                              >
                                Established Year
                              </label>
                              <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <input
                                  id="hospital-year"
                                  type="text"
                                  className="form-input flex-1"
                                  value={hospitalProfile.establishedYear}
                                  onChange={(e) =>
                                    updateProfileField(
                                      "establishedYear",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hospital Capacity */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">
                            Capacity Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label
                                htmlFor="hospital-beds"
                                className="form-label"
                              >
                                Number of Beds
                              </label>
                              <input
                                id="hospital-beds"
                                type="number"
                                className="form-input"
                                value={hospitalProfile.capacity.beds}
                                onChange={(e) =>
                                  updateCapacityField(
                                    "beds",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="hospital-or"
                                className="form-label"
                              >
                                Operating Rooms
                              </label>
                              <input
                                id="hospital-or"
                                type="number"
                                className="form-input"
                                value={hospitalProfile.capacity.operatingRooms}
                                onChange={(e) =>
                                  updateCapacityField(
                                    "operatingRooms",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="hospital-er"
                                className="form-label"
                              >
                                Emergency Rooms
                              </label>
                              <input
                                id="hospital-er"
                                type="number"
                                className="form-input"
                                value={hospitalProfile.capacity.emergencyRooms}
                                onChange={(e) =>
                                  updateCapacityField(
                                    "emergencyRooms",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Accreditations */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 flex items-center">
                            <AcademicCapIcon className="h-5 w-5 text-primary mr-2" />
                            Accreditations
                          </h3>

                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Issued By
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Expiration
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {hospitalProfile.accreditations.map(
                                  (accreditation) => (
                                    <tr key={accreditation.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {accreditation.name}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {accreditation.issuedBy}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {new Date(
                                          accreditation.expirationDate
                                        ).toLocaleDateString()}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            accreditation.status === "Active"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                              : accreditation.status ===
                                                  "Expired"
                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                          }`}
                                        >
                                          {accreditation.status}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                          onClick={() =>
                                            removeAccreditation(
                                              accreditation.id
                                            )
                                          }
                                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                          aria-label={`Remove ${accreditation.name} accreditation`}
                                        >
                                          <TrashIcon className="h-5 w-5" />
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
                              onClick={() => setShowAccreditationForm(true)}
                            >
                              <PlusIcon className="h-5 w-5 mr-2" />
                              Add Accreditation
                            </button>
                          </div>
                        </div>

                        {/* Certifications */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 flex items-center">
                            <BookmarkIcon className="h-5 w-5 text-primary mr-2" />
                            Certifications
                          </h3>

                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Issued By
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Expiration
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {hospitalProfile.certifications.map(
                                  (certification) => (
                                    <tr key={certification.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {certification.name}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {certification.issuedBy}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {new Date(
                                          certification.expirationDate
                                        ).toLocaleDateString()}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            certification.status === "Active"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                              : certification.status ===
                                                  "Expired"
                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                          }`}
                                        >
                                          {certification.status}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                          onClick={() =>
                                            removeCertification(
                                              certification.id
                                            )
                                          }
                                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                          aria-label={`Remove ${certification.name} certification`}
                                        >
                                          <TrashIcon className="h-5 w-5" />
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
                              onClick={() => setShowCertificationForm(true)}
                            >
                              <PlusIcon className="h-5 w-5 mr-2" />
                              Add Certification
                            </button>
                          </div>
                        </div>

                        {/* Save Changes */}
                        <div className="flex justify-end mt-6">
                          <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
                          >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-4">
                          {module.id.replace(/-/g, " ")} Module
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          This module is currently under development.
                          Implementation coming soon.
                        </p>

                        <div className="mt-12 p-8 flex justify-center items-center">
                          <div className="w-12 h-12 text-primary opacity-50 animate-pulse">
                            <module.icon className="w-full h-full" />
                          </div>
                        </div>
                      </div>
                    )}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recent Changes
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>No recent configuration changes to display.</p>
              </div>
            </div>
            <div className="card bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Status
              </h3>
              <div className="flex items-center text-sm">
                <span className="h-3 w-3 bg-success rounded-full mr-2"></span>
                <span className="text-gray-600 dark:text-gray-300">
                  All systems operational
                </span>
              </div>
            </div>
            <div className="card bg-gradient-card backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Actions
              </h3>
              <div className="flex flex-col space-y-2 text-sm">
                <button className="text-left text-primary hover:underline">
                  System-wide Announcement
                </button>
                <button className="text-left text-primary hover:underline">
                  Backup Configuration
                </button>
                <button className="text-left text-primary hover:underline">
                  View Audit Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog - Add Accreditation */}
      {showAccreditationForm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Add New Accreditation
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="accreditation-name"
                          className="form-label"
                        >
                          Accreditation Name
                        </label>
                        <input
                          id="accreditation-name"
                          type="text"
                          className="form-input"
                          value={newAccreditation.name}
                          onChange={(e) =>
                            setNewAccreditation({
                              ...newAccreditation,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="accreditation-issued-by"
                          className="form-label"
                        >
                          Issuing Organization
                        </label>
                        <input
                          id="accreditation-issued-by"
                          type="text"
                          className="form-input"
                          value={newAccreditation.issuedBy}
                          onChange={(e) =>
                            setNewAccreditation({
                              ...newAccreditation,
                              issuedBy: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="accreditation-expiration"
                          className="form-label"
                        >
                          Expiration Date
                        </label>
                        <input
                          id="accreditation-expiration"
                          type="date"
                          className="form-input"
                          value={newAccreditation.expirationDate}
                          onChange={(e) =>
                            setNewAccreditation({
                              ...newAccreditation,
                              expirationDate: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="accreditation-status"
                          className="form-label"
                        >
                          Status
                        </label>
                        <select
                          id="accreditation-status"
                          className="form-select"
                          value={newAccreditation.status}
                          onChange={(e) =>
                            setNewAccreditation({
                              ...newAccreditation,
                              status: e.target.value as
                                | "Active"
                                | "Expired"
                                | "Pending",
                            })
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={addAccreditation}
                >
                  Add Accreditation
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setShowAccreditationForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog - Add Certification */}
      {showCertificationForm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 sm:mx-0 sm:h-10 sm:w-10">
                    <BookmarkIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Add New Certification
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="certification-name"
                          className="form-label"
                        >
                          Certification Name
                        </label>
                        <input
                          id="certification-name"
                          type="text"
                          className="form-input"
                          value={newCertification.name}
                          onChange={(e) =>
                            setNewCertification({
                              ...newCertification,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="certification-issued-by"
                          className="form-label"
                        >
                          Issuing Organization
                        </label>
                        <input
                          id="certification-issued-by"
                          type="text"
                          className="form-input"
                          value={newCertification.issuedBy}
                          onChange={(e) =>
                            setNewCertification({
                              ...newCertification,
                              issuedBy: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="certification-expiration"
                          className="form-label"
                        >
                          Expiration Date
                        </label>
                        <input
                          id="certification-expiration"
                          type="date"
                          className="form-input"
                          value={newCertification.expirationDate}
                          onChange={(e) =>
                            setNewCertification({
                              ...newCertification,
                              expirationDate: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="certification-status"
                          className="form-label"
                        >
                          Status
                        </label>
                        <select
                          id="certification-status"
                          className="form-select"
                          value={newCertification.status}
                          onChange={(e) =>
                            setNewCertification({
                              ...newCertification,
                              status: e.target.value as
                                | "Active"
                                | "Expired"
                                | "Pending",
                            })
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={addCertification}
                >
                  Add Certification
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setShowCertificationForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
