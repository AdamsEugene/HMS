import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartContainer from "./ChartContainer";

// Sample data for patient volume chart
const patientData = [
  { name: "Jan", inpatient: 400, outpatient: 240, emergency: 180 },
  { name: "Feb", inpatient: 380, outpatient: 258, emergency: 190 },
  { name: "Mar", inpatient: 410, outpatient: 290, emergency: 200 },
  { name: "Apr", inpatient: 390, outpatient: 300, emergency: 210 },
  { name: "May", inpatient: 430, outpatient: 320, emergency: 195 },
  { name: "Jun", inpatient: 450, outpatient: 310, emergency: 200 },
];

interface PatientVolumeChartProps {
  id: string;
  isCustomizing?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
}

const PatientVolumeChart = ({
  id,
  isCustomizing,
  onRemove,
  onConfigure,
  className,
}: PatientVolumeChartProps) => {
  return (
    <ChartContainer
      id={id}
      title="Patient Volume"
      onRemove={onRemove}
      onConfigure={onConfigure}
      isCustomizing={isCustomizing}
      className={className}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={patientData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "4px",
                color: "white",
              }}
            />
            <Legend />
            <Bar dataKey="inpatient" fill="#0088FE" />
            <Bar dataKey="outpatient" fill="#00C49F" />
            <Bar dataKey="emergency" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default PatientVolumeChart;
