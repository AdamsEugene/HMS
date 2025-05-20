import type { HospitalProfile } from "./types";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface HospitalCapacityProps {
  hospitalProfile: HospitalProfile;
  updateCapacityField: (
    field: keyof HospitalProfile["capacity"],
    value: number
  ) => void;
}

const HospitalCapacity = ({
  hospitalProfile,
  updateCapacityField,
}: HospitalCapacityProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 flex items-center">
        <CheckCircleIcon className="h-5 w-5 text-primary mr-2" />
        Hospital Capacity
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="hospital-beds" className="form-label">
            Total Beds
          </label>
          <input
            id="hospital-beds"
            type="number"
            className="form-input"
            value={hospitalProfile.capacity.beds}
            onChange={(e) =>
              updateCapacityField("beds", parseInt(e.target.value))
            }
          />
        </div>

        <div>
          <label htmlFor="hospital-or" className="form-label">
            Operating Rooms
          </label>
          <input
            id="hospital-or"
            type="number"
            className="form-input"
            value={hospitalProfile.capacity.operatingRooms}
            onChange={(e) =>
              updateCapacityField("operatingRooms", parseInt(e.target.value))
            }
          />
        </div>

        <div>
          <label htmlFor="hospital-er" className="form-label">
            Emergency Rooms
          </label>
          <input
            id="hospital-er"
            type="number"
            className="form-input"
            value={hospitalProfile.capacity.emergencyRooms}
            onChange={(e) =>
              updateCapacityField("emergencyRooms", parseInt(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HospitalCapacity;
