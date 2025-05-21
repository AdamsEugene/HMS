import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  UserIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  PencilSquareIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

// Patient status types
type PatientStatus =
  | "Active"
  | "Discharged"
  | "Scheduled"
  | "Waiting"
  | "InProgress";

// Patient data interface
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  email: string;
  address: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  medicalRecordNumber: string;
  status: PatientStatus;
  lastVisit?: string;
  upcomingAppointment?: string;
  dateOfBirth: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
}

// Sample patient data
const patientsData: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    contactNumber: "(555) 123-4567",
    email: "john.smith@example.com",
    address: "123 Main St, Anytown, CA 12345",
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC123456789",
    medicalRecordNumber: "MRN001",
    status: "Active",
    lastVisit: "2023-04-15",
    upcomingAppointment: "2023-06-20",
    dateOfBirth: "1978-05-12",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    contactNumber: "(555) 987-6543",
    email: "sarah.johnson@example.com",
    address: "456 Oak Ave, Somewhere, NY 67890",
    insuranceProvider: "Aetna",
    insuranceNumber: "AE987654321",
    medicalRecordNumber: "MRN002",
    status: "Active",
    lastVisit: "2023-05-03",
    upcomingAppointment: "2023-07-10",
    dateOfBirth: "1991-08-23",
    bloodType: "A-",
    allergies: ["Sulfa Drugs", "Shellfish"],
    chronicConditions: [],
  },
  {
    id: "P003",
    name: "Robert Chen",
    age: 67,
    gender: "Male",
    contactNumber: "(555) 456-7890",
    email: "robert.chen@example.com",
    address: "789 Pine St, Elsewhere, TX 54321",
    insuranceProvider: "Medicare",
    insuranceNumber: "MC456789012",
    medicalRecordNumber: "MRN003",
    status: "Active",
    lastVisit: "2023-05-10",
    upcomingAppointment: "2023-06-15",
    dateOfBirth: "1956-01-30",
    bloodType: "B+",
    allergies: ["Ibuprofen", "Contrast Dye"],
    chronicConditions: [
      "Coronary Artery Disease",
      "Osteoarthritis",
      "Glaucoma",
    ],
  },
  {
    id: "P004",
    name: "Emily Rodriguez",
    age: 28,
    gender: "Female",
    contactNumber: "(555) 789-1234",
    email: "emily.rodriguez@example.com",
    address: "321 Elm St, Somewhere, CA 90210",
    insuranceProvider: "Aetna",
    insuranceNumber: "AE123456789",
    medicalRecordNumber: "MRN004",
    status: "Scheduled",
    lastVisit: "2023-04-22",
    upcomingAppointment: "2023-06-12",
    dateOfBirth: "1995-03-17",
    bloodType: "A+",
    allergies: ["Dust", "Pollen"],
    chronicConditions: ["Asthma"],
  },
  {
    id: "P005",
    name: "David Kim",
    age: 52,
    gender: "Male",
    contactNumber: "(555) 567-8901",
    email: "david.kim@example.com",
    address: "456 Maple Ave, Anystate, NY 12345",
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC987654321",
    medicalRecordNumber: "MRN005",
    status: "Active",
    lastVisit: "2023-05-05",
    upcomingAppointment: "2023-06-25",
    dateOfBirth: "1971-11-08",
    bloodType: "O-",
    allergies: ["Sulfa"],
    chronicConditions: ["Hypertension", "High Cholesterol"],
  },
  {
    id: "P006",
    name: "Sophia Martinez",
    age: 35,
    gender: "Female",
    contactNumber: "(555) 234-5678",
    email: "sophia.martinez@example.com",
    address: "789 Oak St, Othertown, FL 33456",
    insuranceProvider: "Medicare",
    insuranceNumber: "MC123789456",
    medicalRecordNumber: "MRN006",
    status: "Waiting",
    lastVisit: "2023-05-15",
    dateOfBirth: "1988-07-22",
    bloodType: "B-",
    allergies: [],
    chronicConditions: ["Migraine"],
  },
  {
    id: "P007",
    name: "James Wilson",
    age: 72,
    gender: "Male",
    contactNumber: "(555) 345-6789",
    email: "james.wilson@example.com",
    address: "123 Cherry Ln, Somewhere, CA 95123",
    insuranceProvider: "Medicare",
    insuranceNumber: "MC654321987",
    medicalRecordNumber: "MRN007",
    status: "Discharged",
    lastVisit: "2023-05-01",
    dateOfBirth: "1951-02-14",
    bloodType: "AB+",
    allergies: ["Penicillin", "Morphine"],
    chronicConditions: ["Diabetes Type 2", "COPD", "Arthritis"],
  },
];

// Sample medical history data
const medicalHistoryData = [
  {
    id: "V001",
    date: "2023-04-15",
    type: "Check-up",
    provider: "Dr. Emily Johnson",
    notes:
      "Patient reports feeling well. Blood pressure slightly elevated at 130/85. Recommended lifestyle modifications and scheduled follow-up in 3 months.",
    vitals: {
      bloodPressure: "130/85",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "185 lbs",
    },
  },
  {
    id: "V002",
    date: "2023-01-10",
    type: "Urgent Care",
    provider: "Dr. Michael Chen",
    notes:
      "Patient presented with flu-like symptoms. Tested negative for influenza and COVID-19. Diagnosed with viral upper respiratory infection. Recommended rest, fluids, and over-the-counter pain relievers.",
    vitals: {
      bloodPressure: "125/80",
      heartRate: "82 bpm",
      temperature: "100.2°F",
      weight: "183 lbs",
    },
  },
  {
    id: "V003",
    date: "2022-09-20",
    type: "Annual Physical",
    provider: "Dr. Emily Johnson",
    notes:
      "Comprehensive physical examination performed. All systems within normal limits. Updated vaccinations. Recommended continued exercise and healthy diet. Patient reports occasional joint pain, advised to take OTC pain relievers as needed.",
    vitals: {
      bloodPressure: "128/82",
      heartRate: "68 bpm",
      temperature: "98.4°F",
      weight: "180 lbs",
    },
  },
];

// Tab definition
interface TabType {
  id: string;
  label: string;
  icon: React.ElementType;
}

const PatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState<Patient | null>(null);

  // Tabs configuration
  const tabs: TabType[] = [
    { id: "overview", label: "Overview", icon: UserIcon },
    {
      id: "medical",
      label: "Medical Records",
      icon: ClipboardDocumentListIcon,
    },
    {
      id: "medications",
      label: "Medications",
      icon: ClipboardDocumentCheckIcon,
    },
    { id: "appointments", label: "Appointments", icon: CalendarDaysIcon },
    {
      id: "communication",
      label: "Communication",
      icon: ChatBubbleLeftRightIcon,
    },
  ];

  useEffect(() => {
    // In a real app, this would be an API call
    const foundPatient = patientsData.find((p) => p.id === patientId);
    setPatient(foundPatient || null);
  }, [patientId]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
          <p className="text-gray-500 mb-4">
            The patient you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/patients")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            aria-label="Return to patients list"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/patients")}
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mr-4"
          aria-label="Return to patients list"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          <span>Back to Patients</span>
        </button>
        <h1 className="text-2xl font-bold">Patient Profile</h1>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Patient Profile Header */}
            <div className="relative h-32 bg-gradient-to-r from-primary to-primary/70">
              {/* Edit button */}
              <button
                className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Edit patient information"
              >
                <PencilSquareIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="flex justify-center -mt-12">
              <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Patient Basic Info */}
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold">{patient.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {patient.gender}, {patient.age} years old
              </p>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${patient.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
                  ${patient.status === "Scheduled" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : ""}
                  ${patient.status === "Waiting" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : ""}
                  ${patient.status === "InProgress" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" : ""}
                  ${patient.status === "Discharged" ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" : ""}
                `}
                >
                  {patient.status}
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Patient details */}
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  MRN:
                </span>{" "}
                <span>{patient.medicalRecordNumber}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  DOB:
                </span>{" "}
                <span>{patient.dateOfBirth}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Blood Type:
                </span>{" "}
                <span>{patient.bloodType || "Unknown"}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Last Visit:
                </span>{" "}
                <span>{patient.lastVisit || "No recent visit"}</span>
              </div>
              {patient.upcomingAppointment && (
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Next Appointment:
                  </span>{" "}
                  <span>{patient.upcomingAppointment}</span>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Contact Information */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm">{patient.contactNumber}</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm">{patient.email}</span>
                </div>
                <div className="flex items-start">
                  <HomeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-sm">{patient.address}</span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Insurance Information */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Insurance Information
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Provider:
                  </span>{" "}
                  <span>{patient.insuranceProvider || "None"}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Policy Number:
                  </span>{" "}
                  <span>{patient.insuranceNumber || "None"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with tabs */}
        <div className="lg:col-span-3">
          {/* Tabs navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  aria-label={`View ${tab.label} tab`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              {activeTab === "overview" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Patient Overview</h3>

                  {/* Health Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Allergies */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <h4 className="font-medium mb-3">Allergies</h4>
                      {patient.allergies.length === 0 ? (
                        <p className="text-gray-500">No known allergies</p>
                      ) : (
                        <ul className="space-y-2">
                          {patient.allergies.map((allergy, index) => (
                            <li key={index} className="flex items-start">
                              <span className="h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                              <span>{allergy}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Chronic Conditions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <h4 className="font-medium mb-3">Chronic Conditions</h4>
                      {patient.chronicConditions.length === 0 ? (
                        <p className="text-gray-500">No chronic conditions</p>
                      ) : (
                        <ul className="space-y-2">
                          {patient.chronicConditions.map((condition, index) => (
                            <li key={index} className="flex items-start">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <h4 className="font-medium mb-3 flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2 text-primary" />
                      Vital Signs Trends
                    </h4>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded">
                      <p className="text-gray-500">
                        Vital signs chart will be displayed here
                      </p>
                    </div>
                  </div>

                  {/* Recent Medical Records */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">Recent Medical Records</h4>
                      <button
                        onClick={() => setActiveTab("medical")}
                        className="text-primary text-sm hover:text-primary/80"
                        aria-label="View all medical records"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {medicalHistoryData.slice(0, 2).map((record) => (
                        <div
                          key={record.id}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        >
                          <div className="flex justify-between mb-2">
                            <h5 className="font-medium">{record.type}</h5>
                            <span className="text-sm text-gray-500">
                              {record.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {record.provider}
                          </p>
                          <p className="text-sm">{record.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "medical" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Medical Records</h3>
                  <div className="space-y-4">
                    {medicalHistoryData.map((record) => (
                      <div
                        key={record.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{record.type}</h4>
                          <span className="text-sm text-gray-500">
                            {record.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {record.provider}
                        </p>
                        <p className="text-sm mb-3">{record.notes}</p>

                        {/* Vitals */}
                        <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg">
                          <h5 className="text-sm font-medium mb-2">
                            Vital Signs
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-gray-500">
                                Blood Pressure:
                              </span>{" "}
                              {record.vitals.bloodPressure}
                            </div>
                            <div>
                              <span className="text-gray-500">Heart Rate:</span>{" "}
                              {record.vitals.heartRate}
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Temperature:
                              </span>{" "}
                              {record.vitals.temperature}
                            </div>
                            <div>
                              <span className="text-gray-500">Weight:</span>{" "}
                              {record.vitals.weight}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "medications" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Medications</h3>
                  <p className="text-center text-gray-500 py-12">
                    Medications will be displayed here
                  </p>
                </div>
              )}

              {activeTab === "appointments" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Appointments</h3>
                  <p className="text-center text-gray-500 py-12">
                    Appointments will be displayed here
                  </p>
                </div>
              )}

              {activeTab === "communication" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Communication</h3>
                  <p className="text-center text-gray-500 py-12">
                    Communication history will be displayed here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
