import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import ChartContainer from "./ChartContainer";

// Sample patient data
const patientData = [
  {
    id: "P-1001",
    name: "John Smith",
    age: 45,
    department: "Cardiology",
    status: "Inpatient",
    admittedDate: "2023-05-15",
  },
  {
    id: "P-1002",
    name: "Emily Johnson",
    age: 32,
    department: "Neurology",
    status: "Outpatient",
    admittedDate: "2023-05-16",
  },
  {
    id: "P-1003",
    name: "Michael Williams",
    age: 58,
    department: "Orthopedics",
    status: "Inpatient",
    admittedDate: "2023-05-12",
  },
  {
    id: "P-1004",
    name: "Sarah Davis",
    age: 27,
    department: "Obstetrics",
    status: "Discharged",
    admittedDate: "2023-05-10",
  },
  {
    id: "P-1005",
    name: "David Miller",
    age: 62,
    department: "Oncology",
    status: "Inpatient",
    admittedDate: "2023-05-08",
  },
  {
    id: "P-1006",
    name: "Jennifer Wilson",
    age: 41,
    department: "Cardiology",
    status: "Outpatient",
    admittedDate: "2023-05-17",
  },
  {
    id: "P-1007",
    name: "Robert Brown",
    age: 53,
    department: "Pulmonology",
    status: "Inpatient",
    admittedDate: "2023-05-14",
  },
];

interface PatientTableProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
}

const PatientTable = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
}: PatientTableProps) => {
  const { currentTheme } = useTheme();

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Inpatient":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500 font-medium">
            {status}
          </span>
        );
      case "Outpatient":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500 font-medium">
            {status}
          </span>
        );
      case "Discharged":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400 font-medium">
            {status}
          </span>
        );
      case "Emergency":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500 font-medium">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-500 font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <ChartContainer
      id={id}
      title="Patient Records"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/20 text-left border-b border-white/10">
              <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-white/70">
                Patient ID
              </th>
              <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-white/70">
                Name
              </th>
              <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-white/70">
                Age
              </th>
              <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-white/70">
                Department
              </th>
              <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-white/70">
                Status
              </th>
              <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-white/70">
                Admitted
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {patientData.map((patient, index) => (
              <tr
                key={patient.id}
                className={`${
                  index % 2 === 0
                    ? "bg-black/5 hover:bg-black/10"
                    : "bg-black/10 hover:bg-black/15"
                } transition-colors`}
              >
                <td className="px-4 py-3 text-xs text-white/90 font-mono">
                  {patient.id}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-white">
                  {patient.name}
                </td>
                <td className="px-4 py-3 text-sm text-white/80">
                  {patient.age}
                </td>
                <td className="px-4 py-3 text-sm text-white/80">
                  {patient.department}
                </td>
                <td className="px-4 py-3 text-sm">
                  {getStatusBadge(patient.status)}
                </td>
                <td className="px-4 py-3 text-sm text-white/70">
                  {new Date(patient.admittedDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartContainer>
  );
};

export default PatientTable;
