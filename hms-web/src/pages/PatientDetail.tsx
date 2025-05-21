import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  PencilSquareIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

// Add detailed sample vital signs data
const vitalSignsData = [
  {
    date: "2023-04-15",
    systolic: 130,
    diastolic: 85,
    heartRate: 72,
    temperature: 98.6,
    respirationRate: 16,
    oxygenSaturation: 98,
    weight: 185,
  },
  {
    date: "2023-01-10",
    systolic: 125,
    diastolic: 80,
    heartRate: 82,
    temperature: 100.2,
    respirationRate: 20,
    oxygenSaturation: 97,
    weight: 183,
  },
  {
    date: "2022-09-20",
    systolic: 128,
    diastolic: 82,
    heartRate: 68,
    temperature: 98.4,
    respirationRate: 14,
    oxygenSaturation: 99,
    weight: 180,
  },
  {
    date: "2022-06-15",
    systolic: 135,
    diastolic: 88,
    heartRate: 74,
    temperature: 98.2,
    respirationRate: 16,
    oxygenSaturation: 98,
    weight: 188,
  },
  {
    date: "2022-03-10",
    systolic: 132,
    diastolic: 84,
    heartRate: 70,
    temperature: 98.8,
    respirationRate: 15,
    oxygenSaturation: 98,
    weight: 192,
  },
];

// Add mock ECG data
const ecgData = [
  { time: 0, value: 0.1 },
  { time: 1, value: 0.2 },
  { time: 2, value: 0.5 },
  { time: 3, value: 0.7 },
  { time: 4, value: 1.0 },
  { time: 5, value: 0.5 },
  { time: 6, value: 0.0 },
  { time: 7, value: -0.5 },
  { time: 8, value: -0.2 },
  { time: 9, value: 0.0 },
  { time: 10, value: 0.3 },
  { time: 11, value: 0.7 },
  { time: 12, value: 1.2 },
  { time: 13, value: 0.5 },
  { time: 14, value: 0.0 },
  { time: 15, value: -0.5 },
  { time: 16, value: -0.3 },
  { time: 17, value: 0.0 },
  { time: 18, value: 0.1 },
  { time: 19, value: 0.2 },
  { time: 20, value: 0.5 },
  { time: 21, value: 0.7 },
  { time: 22, value: 1.0 },
  { time: 23, value: 0.5 },
  { time: 24, value: 0.0 },
  { time: 25, value: -0.5 },
  { time: 26, value: -0.2 },
  { time: 27, value: 0.0 },
];

// Add lab results data
const labResultsData = [
  {
    date: "2023-04-15",
    test: "Complete Blood Count",
    details: {
      hemoglobin: { value: 14.2, unit: "g/dL", normalRange: "13.5-17.5" },
      whiteBloodCells: { value: 7.5, unit: "10^3/µL", normalRange: "4.5-11.0" },
      platelets: { value: 250, unit: "10^3/µL", normalRange: "150-450" },
      hematocrit: { value: 42, unit: "%", normalRange: "41-50" },
    },
  },
  {
    date: "2023-04-15",
    test: "Lipid Panel",
    details: {
      totalCholesterol: { value: 195, unit: "mg/dL", normalRange: "<200" },
      ldl: { value: 110, unit: "mg/dL", normalRange: "<100" },
      hdl: { value: 45, unit: "mg/dL", normalRange: ">40" },
      triglycerides: { value: 150, unit: "mg/dL", normalRange: "<150" },
    },
  },
  {
    date: "2023-04-15",
    test: "Comprehensive Metabolic Panel",
    details: {
      glucose: { value: 92, unit: "mg/dL", normalRange: "70-99" },
      bun: { value: 15, unit: "mg/dL", normalRange: "7-20" },
      creatinine: { value: 0.9, unit: "mg/dL", normalRange: "0.6-1.2" },
      sodium: { value: 140, unit: "mmol/L", normalRange: "135-145" },
      potassium: { value: 4.0, unit: "mmol/L", normalRange: "3.5-5.0" },
    },
  },
  {
    date: "2023-01-10",
    test: "Hemoglobin A1C",
    details: {
      a1c: { value: 5.8, unit: "%", normalRange: "<5.7" },
    },
  },
];

// Add heart health records
const heartHealthRecords = [
  {
    date: "2023-03-20",
    type: "Echocardiogram",
    provider: "Dr. James Wilson",
    results:
      "Normal left ventricular size and function. Ejection fraction 65%. No significant valvular abnormalities.",
    recommendations: "No follow-up required unless symptoms develop.",
  },
  {
    date: "2022-11-15",
    type: "ECG",
    provider: "Dr. Emily Johnson",
    results: "Normal sinus rhythm. No ST-T wave changes. Normal intervals.",
    recommendations: "Annual follow-up recommended.",
  },
  {
    date: "2022-08-05",
    type: "Stress Test",
    provider: "Dr. James Wilson",
    results:
      "Patient completed Bruce protocol for 10 minutes. No chest pain or arrhythmias. Normal blood pressure response.",
    recommendations: "Continue current exercise program and medications.",
  },
];

// Tab definition
interface TabType {
  id: string;
  label: string;
  icon: React.ElementType;
}

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

// Sample medication data
const medicationsData = [
  {
    id: "M001",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2022-10-15",
    endDate: null,
    prescribedBy: "Dr. Emily Johnson",
    purpose: "Hypertension",
    status: "Active",
    instructions: "Take in the morning with or without food",
    refillsRemaining: 2,
    pharmacy: "HealthPlus Pharmacy",
    sideEffects: ["Dizziness", "Dry cough", "Headache"],
    interactions: ["NSAIDs", "Potassium supplements"],
  },
  {
    id: "M002",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily with meals",
    startDate: "2022-09-20",
    endDate: null,
    prescribedBy: "Dr. Emily Johnson",
    purpose: "Type 2 Diabetes",
    status: "Active",
    instructions: "Take with breakfast and dinner",
    refillsRemaining: 3,
    pharmacy: "HealthPlus Pharmacy",
    sideEffects: ["Nausea", "Diarrhea", "Abdominal discomfort"],
    interactions: ["Certain contrast dyes", "Alcohol"],
  },
  {
    id: "M003",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    startDate: "2022-09-20",
    endDate: null,
    prescribedBy: "Dr. Emily Johnson",
    purpose: "High Cholesterol",
    status: "Active",
    instructions: "Take at night",
    refillsRemaining: 1,
    pharmacy: "HealthPlus Pharmacy",
    sideEffects: ["Muscle pain", "Liver problems"],
    interactions: ["Grapefruit juice", "Certain antibiotics"],
  },
  {
    id: "M004",
    name: "Ibuprofen",
    dosage: "200mg",
    frequency: "As needed for pain, not to exceed 1200mg in 24 hours",
    startDate: "2023-01-15",
    endDate: "2023-02-15",
    prescribedBy: "Dr. Michael Chen",
    purpose: "Joint Pain",
    status: "Completed",
    instructions: "Take with food to reduce stomach upset",
    refillsRemaining: 0,
    pharmacy: "MedExpress Pharmacy",
    sideEffects: ["Stomach upset", "Heartburn"],
    interactions: ["Blood thinners", "Aspirin"],
  },
];

// Add the appointment modal component at the top of the file, before PatientDetail
// AppointmentModal Component
const AppointmentModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Schedule New Appointment</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="appointment-type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Appointment Type
                </label>
                <select
                  id="appointment-type"
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Select appointment type</option>
                  <option value="check-up">Regular Check-up</option>
                  <option value="follow-up">Follow-up Visit</option>
                  <option value="specialist">Specialist Consultation</option>
                  <option value="lab-work">Lab Work</option>
                  <option value="imaging">Imaging</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="provider"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Provider
                </label>
                <select
                  id="provider"
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Select provider</option>
                  <option value="dr-johnson">Dr. Emily Johnson</option>
                  <option value="dr-chen">Dr. Michael Chen</option>
                  <option value="dr-martinez">Dr. Robert Martinez</option>
                  <option value="dr-williams">Dr. Sarah Williams</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Time
                </label>
                <select
                  id="time"
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Select time</option>
                  <option value="9:00">9:00 AM</option>
                  <option value="9:30">9:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="1:00">1:00 PM</option>
                  <option value="1:30">1:30 PM</option>
                  <option value="2:00">2:00 PM</option>
                  <option value="2:30">2:30 PM</option>
                  <option value="3:00">3:00 PM</option>
                  <option value="3:30">3:30 PM</option>
                  <option value="4:00">4:00 PM</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Briefly describe the reason for this appointment..."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Appointment scheduled successfully!");
                  onClose();
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add glucose monitoring data
const glucoseData = [
  { date: "2023-05-20", fasting: 95, postMeal: 145, beforeBed: 110 },
  { date: "2023-05-10", fasting: 92, postMeal: 150, beforeBed: 105 },
  { date: "2023-04-30", fasting: 97, postMeal: 160, beforeBed: 120 },
  { date: "2023-04-15", fasting: 94, postMeal: 155, beforeBed: 115 },
  { date: "2023-03-25", fasting: 90, postMeal: 140, beforeBed: 108 },
  { date: "2023-03-05", fasting: 88, postMeal: 138, beforeBed: 102 },
  { date: "2023-02-15", fasting: 91, postMeal: 143, beforeBed: 106 },
  { date: "2023-01-30", fasting: 98, postMeal: 165, beforeBed: 125 },
];

// Add blood pressure history data
const bpHistoryData = [
  { date: "2023-05-20", systolic: 128, diastolic: 82 },
  { date: "2023-05-01", systolic: 130, diastolic: 84 },
  { date: "2023-04-15", systolic: 132, diastolic: 86 },
  { date: "2023-03-30", systolic: 135, diastolic: 87 },
  { date: "2023-03-15", systolic: 133, diastolic: 85 },
  { date: "2023-03-01", systolic: 129, diastolic: 83 },
  { date: "2023-02-15", systolic: 131, diastolic: 84 },
  { date: "2023-02-01", systolic: 134, diastolic: 86 },
  { date: "2023-01-15", systolic: 136, diastolic: 88 },
  { date: "2023-01-01", systolic: 132, diastolic: 85 },
];

// Add cholesterol history data
const cholesterolData = [
  {
    date: "2023-04-15",
    totalCholesterol: 195,
    ldl: 110,
    hdl: 45,
    triglycerides: 150,
  },
  {
    date: "2022-10-20",
    totalCholesterol: 205,
    ldl: 125,
    hdl: 42,
    triglycerides: 170,
  },
  {
    date: "2022-04-25",
    totalCholesterol: 210,
    ldl: 130,
    hdl: 40,
    triglycerides: 180,
  },
  {
    date: "2021-10-30",
    totalCholesterol: 215,
    ldl: 135,
    hdl: 38,
    triglycerides: 195,
  },
  {
    date: "2021-04-15",
    totalCholesterol: 220,
    ldl: 140,
    hdl: 36,
    triglycerides: 200,
  },
];

// Add A1C history data
const a1cData = [
  { date: "2023-04-15", value: 5.8 },
  { date: "2022-10-20", value: 6.0 },
  { date: "2022-04-25", value: 6.2 },
  { date: "2021-10-30", value: 6.5 },
  { date: "2021-04-15", value: 6.8 },
  { date: "2020-10-20", value: 7.1 },
];

// Add sample message data
const messagesData = [
  {
    id: "msg1",
    date: "2023-05-28",
    subject: "Medication Refill Request",
    from: "John Smith (Patient)",
    content:
      "I need a refill for my Lisinopril medication. I'm down to my last few pills. Thank you.",
    replied: true,
    type: "clinical",
  },
  {
    id: "msg2",
    date: "2023-05-25",
    subject: "Lab Results Available",
    from: "Dr. Emily Johnson",
    content:
      "Your recent lab results are available for review. Overall, the results look good. Your blood pressure is slightly elevated, so let's discuss lifestyle modifications during your next visit. You can view the detailed results in your patient portal.",
    replied: false,
    type: "clinical",
  },
  {
    id: "msg3",
    date: "2023-05-15",
    subject: "Appointment Confirmation",
    from: "Scheduling Department",
    content:
      "This is a confirmation of your upcoming appointment on June 20, 2023 at 10:00 AM with Dr. Emily Johnson. Please arrive 15 minutes early to complete any necessary paperwork. Let us know if you need to reschedule.",
    replied: false,
    type: "administrative",
  },
  {
    id: "msg4",
    date: "2023-05-10",
    subject: "Insurance Update Needed",
    from: "Billing Department",
    content:
      "Our records show that your insurance information may have changed. Please provide us with your updated insurance card at your next visit, or upload it through the patient portal at your earliest convenience.",
    replied: true,
    type: "administrative",
  },
];

const PatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [expandedMedication, setExpandedMedication] = useState<string | null>(
    null
  );

  // New state variables
  const [activeChartType, setActiveChartType] = useState("vitals");
  const [filterTimeRange, setFilterTimeRange] = useState("6months");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState("upcoming");
  const [messageFilter, setMessageFilter] = useState("all");

  // Add new state variables
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

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

  // Update the prepareVitalSignsData function to support time range filtering
  const prepareVitalSignsData = () => {
    let filteredData = [...vitalSignsData];

    // Apply time filter
    if (filterTimeRange !== "all") {
      const now = new Date();
      const monthsToSubtract =
        filterTimeRange === "6months"
          ? 6
          : filterTimeRange === "1year"
            ? 12
            : filterTimeRange === "3years"
              ? 36
              : 0;

      if (monthsToSubtract > 0) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

        filteredData = filteredData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= cutoffDate;
        });
      }
    }

    return filteredData.reverse();
  };

  // Add a helper function to check if a lab value is within the normal range
  const isNormalValue = (value: number, range: string) => {
    if (range.startsWith("<")) {
      const limit = parseFloat(range.substring(1));
      return value < limit;
    } else if (range.startsWith(">")) {
      const limit = parseFloat(range.substring(1));
      return value > limit;
    } else if (range.includes("-")) {
      const [min, max] = range.split("-").map(parseFloat);
      return value >= min && value <= max;
    }
    return true;
  };

  // Add a function to prepare glucose data
  const prepareGlucoseData = () => {
    let filteredData = [...glucoseData];

    // Apply time filter
    if (filterTimeRange !== "all") {
      const now = new Date();
      const monthsToSubtract =
        filterTimeRange === "6months"
          ? 6
          : filterTimeRange === "1year"
            ? 12
            : filterTimeRange === "3years"
              ? 36
              : 0;

      if (monthsToSubtract > 0) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

        filteredData = filteredData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= cutoffDate;
        });
      }
    }

    return filteredData.reverse();
  };

  // Add a function to prepare BP history data
  const prepareBPHistoryData = () => {
    let filteredData = [...bpHistoryData];

    // Apply time filter
    if (filterTimeRange !== "all") {
      const now = new Date();
      const monthsToSubtract =
        filterTimeRange === "6months"
          ? 6
          : filterTimeRange === "1year"
            ? 12
            : filterTimeRange === "3years"
              ? 36
              : 0;

      if (monthsToSubtract > 0) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

        filteredData = filteredData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= cutoffDate;
        });
      }
    }

    return filteredData.reverse();
  };

  // Add a function to prepare cholesterol data
  const prepareCholesterolData = () => {
    let filteredData = [...cholesterolData];

    // Apply time filter
    if (filterTimeRange !== "all") {
      const now = new Date();
      const monthsToSubtract =
        filterTimeRange === "6months"
          ? 6
          : filterTimeRange === "1year"
            ? 12
            : filterTimeRange === "3years"
              ? 36
              : 0;

      if (monthsToSubtract > 0) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

        filteredData = filteredData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= cutoffDate;
        });
      }
    }

    return filteredData.reverse();
  };

  // Add a function to prepare A1C data
  const prepareA1CData = () => {
    let filteredData = [...a1cData];

    // Apply time filter
    if (filterTimeRange !== "all") {
      const now = new Date();
      const monthsToSubtract =
        filterTimeRange === "6months"
          ? 6
          : filterTimeRange === "1year"
            ? 12
            : filterTimeRange === "3years"
              ? 36
              : 0;

      if (monthsToSubtract > 0) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

        filteredData = filteredData.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= cutoffDate;
        });
      }
    }

    return filteredData.reverse();
  };

  // Add a function to filter messages
  const getFilteredMessages = () => {
    if (messageFilter === "all") return messagesData;
    return messagesData.filter((msg) => msg.type === messageFilter);
  };

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

                  {/* Chart Selection and Controls */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium flex items-center">
                        <ChartBarIcon className="h-5 w-5 mr-2 text-primary" />
                        Medical Data Visualization
                      </h4>
                      <div className="flex space-x-2">
                        <select
                          className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
                          value={activeChartType}
                          onChange={(e) => setActiveChartType(e.target.value)}
                          aria-label="Chart type"
                        >
                          <option value="vitals">Vital Signs</option>
                          <option value="bp">Blood Pressure History</option>
                          <option value="glucose">Glucose Monitoring</option>
                          <option value="a1c">A1C History</option>
                          <option value="cholesterol">
                            Cholesterol Levels
                          </option>
                          <option value="ecg">ECG Data</option>
                          <option value="lab">Lab Results</option>
                          <option value="weight">Weight History</option>
                        </select>
                        <select
                          className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
                          value={filterTimeRange}
                          onChange={(e) => setFilterTimeRange(e.target.value)}
                          aria-label="Time range"
                        >
                          <option value="6months">6 Months</option>
                          <option value="1year">1 Year</option>
                          <option value="3years">3 Years</option>
                          <option value="all">All Data</option>
                        </select>
                      </div>
                    </div>

                    {/* Vital Signs Chart */}
                    {activeChartType === "vitals" && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={prepareVitalSignsData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" />
                            <YAxis
                              yAxisId="left"
                              orientation="left"
                              stroke="#ef4444"
                            />
                            <YAxis
                              yAxisId="right"
                              orientation="right"
                              stroke="#3b82f6"
                            />
                            <Tooltip />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="systolic"
                              stroke="#ef4444"
                              name="Systolic BP"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="diastolic"
                              stroke="#3b82f6"
                              name="Diastolic BP"
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="heartRate"
                              stroke="#10b981"
                              name="Heart Rate"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Blood Pressure History Chart */}
                    {activeChartType === "bp" && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={prepareBPHistoryData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" />
                            <YAxis domain={[70, "dataMax + 10"]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="systolic"
                              stroke="#ef4444"
                              name="Systolic"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="diastolic"
                              stroke="#3b82f6"
                              name="Diastolic"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Glucose Monitoring Chart */}
                    {activeChartType === "glucose" && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={prepareGlucoseData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" />
                            <YAxis domain={[60, 180]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="fasting"
                              stroke="#10b981"
                              name="Fasting Glucose"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="postMeal"
                              stroke="#f59e0b"
                              name="Post-Meal Glucose"
                            />
                            <Line
                              type="monotone"
                              dataKey="beforeBed"
                              stroke="#8b5cf6"
                              name="Before Bed Glucose"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* A1C History Chart */}
                    {activeChartType === "a1c" && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={prepareA1CData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" />
                            <YAxis domain={[5, 8]} />
                            <Tooltip
                              formatter={(value) => [`${value}%`, "A1C"]}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#8b5cf6"
                              name="A1C"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Cholesterol Chart */}
                    {activeChartType === "cholesterol" && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={prepareCholesterolData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 250]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="totalCholesterol"
                              stroke="#8b5cf6"
                              name="Total Cholesterol"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="ldl"
                              stroke="#ef4444"
                              name="LDL"
                            />
                            <Line
                              type="monotone"
                              dataKey="hdl"
                              stroke="#10b981"
                              name="HDL"
                            />
                            <Line
                              type="monotone"
                              dataKey="triglycerides"
                              stroke="#f59e0b"
                              name="Triglycerides"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* ECG Chart */}
                    {activeChartType === "ecg" && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={ecgData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis
                              dataKey="time"
                              label={{
                                value: "Time (ms)",
                                position: "insideBottomRight",
                                offset: -10,
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Amplitude (mV)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <Tooltip
                              formatter={(value) => [
                                `${value} mV`,
                                "Amplitude",
                              ]}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#ef4444"
                              dot={false}
                              name="ECG"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="text-center text-sm text-gray-500 mt-2">
                          ECG recording from{" "}
                          {heartHealthRecords.find((r) => r.type === "ECG")
                            ?.date || "Unknown Date"}
                        </div>
                      </div>
                    )}

                    {/* Lab Results Chart */}
                    {activeChartType === "lab" && (
                      <div className="h-64">
                        <div className="h-full flex flex-col justify-center items-center">
                          <h5 className="text-lg font-medium mb-4">
                            Lab Results
                          </h5>
                          <div className="w-full max-w-2xl">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Test
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Value
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Normal Range
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                  {labResultsData[0]?.details &&
                                    Object.entries(
                                      labResultsData[0].details
                                    ).map(([key, detail], index) => (
                                      <tr
                                        key={index}
                                        className={
                                          index % 2 === 0
                                            ? "bg-gray-50 dark:bg-gray-900/50"
                                            : ""
                                        }
                                      >
                                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                                          {key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (str) =>
                                              str.toUpperCase()
                                            )}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm">
                                          {detail.value} {detail.unit}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm">
                                          {detail.normalRange}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm">
                                          <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                              isNormalValue(
                                                detail.value,
                                                detail.normalRange
                                              )
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                            }`}
                                          >
                                            {isNormalValue(
                                              detail.value,
                                              detail.normalRange
                                            )
                                              ? "Normal"
                                              : "Attention"}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="text-center text-sm text-gray-500 mt-2">
                              Last Updated:{" "}
                              {labResultsData[0]?.date || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Weight Chart */}
                    {activeChartType === "weight" && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={prepareVitalSignsData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" />
                            <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              stroke="#8884d8"
                              name="Weight (lbs)"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Heart Health Records */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">Heart Health Records</h4>
                      <button
                        onClick={() => setActiveTab("medical")}
                        className="text-primary text-sm hover:text-primary/80"
                      >
                        View All Records
                      </button>
                    </div>
                    <div className="space-y-4">
                      {heartHealthRecords.slice(0, 2).map((record, index) => (
                        <div
                          key={index}
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
                          <p className="text-sm mb-2">{record.results}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">
                              Recommendations:
                            </span>{" "}
                            {record.recommendations}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Medical Records */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">Recent Medical Records</h4>
                      <button
                        onClick={() => setActiveTab("medical")}
                        className="text-primary text-sm hover:text-primary/80"
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
                  <div className="space-y-4">
                    {medicationsData.map((medication) => (
                      <div
                        key={medication.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="flex flex-wrap justify-between mb-2">
                          <div>
                            <h4 className="font-medium">
                              {medication.name} ({medication.dosage})
                            </h4>
                            <p className="text-sm text-gray-500">
                              {medication.frequency}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                medication.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {medication.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <div>
                            <span className="font-medium">Start:</span>{" "}
                            {medication.startDate}
                          </div>
                          {medication.endDate && (
                            <div>
                              <span className="font-medium">End:</span>{" "}
                              {medication.endDate}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Prescribed by:</span>{" "}
                            {medication.prescribedBy}
                          </div>
                          <div>
                            <span className="font-medium">Purpose:</span>{" "}
                            {medication.purpose}
                          </div>
                        </div>

                        {/* Use string literals for aria-expanded */}
                        {expandedMedication === medication.id ? (
                          <button
                            onClick={() => setExpandedMedication(null)}
                            className="text-primary text-sm hover:text-primary/80"
                            aria-expanded="true"
                          >
                            Show Less
                          </button>
                        ) : (
                          <button
                            onClick={() => setExpandedMedication(medication.id)}
                            className="text-primary text-sm hover:text-primary/80"
                            aria-expanded="false"
                          >
                            Show More
                          </button>
                        )}

                        {expandedMedication === medication.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h5 className="font-medium mb-1">
                                  Instructions
                                </h5>
                                <p>{medication.instructions}</p>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">Pharmacy</h5>
                                <p>{medication.pharmacy}</p>
                                <p className="mt-1">
                                  Refills remaining:{" "}
                                  {medication.refillsRemaining}
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">
                                  Side Effects
                                </h5>
                                <ul className="list-disc list-inside">
                                  {medication.sideEffects.map(
                                    (effect, index) => (
                                      <li key={index}>{effect}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">
                                  Interactions
                                </h5>
                                <ul className="list-disc list-inside">
                                  {medication.interactions.map(
                                    (interaction, index) => (
                                      <li key={index}>{interaction}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "appointments" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Appointments</h3>
                  <div className="flex justify-between mb-4">
                    <div className="flex space-x-2">
                      <button
                        className={`px-3 py-1 ${appointmentFilter === "upcoming" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} rounded-md text-sm hover:bg-primary/90`}
                        onClick={() => setAppointmentFilter("upcoming")}
                      >
                        Upcoming
                      </button>
                      <button
                        className={`px-3 py-1 ${appointmentFilter === "past" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600`}
                        onClick={() => setAppointmentFilter("past")}
                      >
                        Past
                      </button>
                      <button
                        className={`px-3 py-1 ${appointmentFilter === "cancelled" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600`}
                        onClick={() => setAppointmentFilter("cancelled")}
                      >
                        Cancelled
                      </button>
                    </div>
                    <button
                      className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 flex items-center"
                      onClick={() => setShowAppointmentModal(true)}
                    >
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      Schedule New
                    </button>
                  </div>

                  {/* Render appointments based on filter */}
                  <div className="space-y-4">
                    {appointmentFilter === "upcoming" && (
                      <>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="mb-2 md:mb-0">
                              <h4 className="font-medium">
                                Annual Physical Examination
                              </h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                <span>June 20, 2023 | 10:30 AM - 11:30 AM</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-md text-sm">
                                Check In
                              </button>
                              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm">
                                Reschedule
                              </button>
                              <button className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md text-sm">
                                Cancel
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Provider
                                </p>
                                <p className="text-sm">Dr. Emily Johnson</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Department
                                </p>
                                <p className="text-sm">Internal Medicine</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Location
                                </p>
                                <p className="text-sm">
                                  Main Hospital - Room 305
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 mb-1">
                                Notes
                              </p>
                              <p className="text-sm">
                                Please arrive 15 minutes early to complete
                                paperwork. Fast for 8 hours before appointment
                                for lab work.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="mb-2 md:mb-0">
                              <h4 className="font-medium">
                                Diabetes Follow-up
                              </h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                <span>July 15, 2023 | 2:00 PM - 2:30 PM</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-md text-sm">
                                Check In
                              </button>
                              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm">
                                Reschedule
                              </button>
                              <button className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md text-sm">
                                Cancel
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Provider
                                </p>
                                <p className="text-sm">Dr. Robert Martinez</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Department
                                </p>
                                <p className="text-sm">Endocrinology</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Location
                                </p>
                                <p className="text-sm">
                                  Specialty Clinic - Suite 210
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 mb-1">
                                Notes
                              </p>
                              <p className="text-sm">
                                Bring glucose monitoring records. Insurance
                                pre-authorization completed.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {appointmentFilter === "past" && (
                      <>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="mb-2 md:mb-0">
                              <h4 className="font-medium">
                                Quarterly Blood Work
                              </h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                <span>April 15, 2023 | 8:00 AM - 9:00 AM</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                                Completed
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Provider
                                </p>
                                <p className="text-sm">Dr. Emily Johnson</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Department
                                </p>
                                <p className="text-sm">Laboratory Services</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Location
                                </p>
                                <p className="text-sm">
                                  Main Hospital - Lab Wing
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 mb-1">
                                Notes
                              </p>
                              <p className="text-sm">
                                Routine blood work for diabetes and cholesterol
                                monitoring. Results available in patient portal.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="mb-2 md:mb-0">
                              <h4 className="font-medium">Urgent Care Visit</h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                <span>
                                  January 10, 2023 | 3:15 PM - 4:00 PM
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                                Completed
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Provider
                                </p>
                                <p className="text-sm">Dr. Michael Chen</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Department
                                </p>
                                <p className="text-sm">Urgent Care</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Location
                                </p>
                                <p className="text-sm">
                                  Medical Plaza - First Floor
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 mb-1">
                                Notes
                              </p>
                              <p className="text-sm">
                                Treated for flu-like symptoms. Diagnosed with
                                viral upper respiratory infection.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {appointmentFilter === "cancelled" && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="mb-2 md:mb-0">
                            <h4 className="font-medium">
                              Dermatology Consultation
                            </h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <CalendarDaysIcon className="h-4 w-4 mr-1" />
                              <span>March 5, 2023 | 11:00 AM - 11:45 AM</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs">
                              Cancelled
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Provider
                              </p>
                              <p className="text-sm">Dr. Sarah Williams</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Department
                              </p>
                              <p className="text-sm">Dermatology</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Location
                              </p>
                              <p className="text-sm">
                                Specialty Clinic - Suite 305
                              </p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-gray-500 mb-1">
                              Cancellation Reason
                            </p>
                            <p className="text-sm">
                              Patient requested cancellation. Reason: Schedule
                              conflict.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No appointments message */}
                    {((appointmentFilter === "upcoming" &&
                      appointmentFilter.length === 0) ||
                      (appointmentFilter === "past" &&
                        appointmentFilter.length === 0) ||
                      (appointmentFilter === "cancelled" &&
                        appointmentFilter.length === 0)) && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No {appointmentFilter} appointments found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "communication" && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Communication</h3>
                  <div className="flex justify-between mb-4">
                    <div className="flex space-x-2">
                      <button
                        className={`px-3 py-1 ${messageFilter === "all" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} rounded-md text-sm hover:bg-primary/90`}
                        onClick={() => setMessageFilter("all")}
                      >
                        All Messages
                      </button>
                      <button
                        className={`px-3 py-1 ${messageFilter === "clinical" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600`}
                        onClick={() => setMessageFilter("clinical")}
                      >
                        Clinical
                      </button>
                      <button
                        className={`px-3 py-1 ${messageFilter === "administrative" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600`}
                        onClick={() => setMessageFilter("administrative")}
                      >
                        Administrative
                      </button>
                    </div>
                    <button
                      className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 flex items-center"
                      onClick={() => setShowNewMessageModal(true)}
                      aria-label="Create new message"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      New Message
                    </button>
                  </div>

                  {/* Communication history */}
                  <div className="space-y-4">
                    {getFilteredMessages().map((message) => (
                      <div
                        key={message.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{message.subject}</h4>
                          <span className="text-sm text-gray-500">
                            {message.date}
                          </span>
                        </div>
                        <div className="flex items-start mb-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {message.from}
                            </p>
                            <p className="text-sm mt-1">{message.content}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-md text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                            onClick={() => {
                              setSelectedMessage(message.id);
                              setShowReplyModal(true);
                            }}
                            aria-label="Reply to message"
                          >
                            Reply
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                            onClick={() =>
                              alert(
                                `Message marked as ${message.replied ? "unread" : "read"}`
                              )
                            }
                            aria-label={`Mark message as ${message.replied ? "unread" : "read"}`}
                          >
                            {message.replied
                              ? "Mark as Unread"
                              : "Mark as Read"}
                          </button>
                          <button
                            className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800"
                            onClick={() => alert("Message deleted")}
                            aria-label="Delete message"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {getFilteredMessages().length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No {messageFilter !== "all" ? messageFilter : ""}{" "}
                        messages found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment scheduling modal */}
      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
        />
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">New Message</h3>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close new message form"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Message sent successfully!");
                  setShowNewMessageModal(false);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="recipient"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Recipient
                    </label>
                    <select
                      id="recipient"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select recipient</option>
                      <option value="dr-johnson">Dr. Emily Johnson</option>
                      <option value="dr-chen">Dr. Michael Chen</option>
                      <option value="billing">Billing Department</option>
                      <option value="scheduling">Scheduling Department</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewMessageModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reply Message Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">Reply to Message</h3>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedMessage(null);
                }}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close reply form"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm font-medium mb-1">
                  {messagesData.find((m) => m.id === selectedMessage)?.subject}
                </p>
                <p className="text-sm">
                  {messagesData.find((m) => m.id === selectedMessage)?.content}
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Reply sent successfully!");
                  setShowReplyModal(false);
                  setSelectedMessage(null);
                }}
              >
                <div>
                  <label
                    htmlFor="reply"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Reply
                  </label>
                  <textarea
                    id="reply"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    required
                  ></textarea>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyModal(false);
                      setSelectedMessage(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                  >
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
