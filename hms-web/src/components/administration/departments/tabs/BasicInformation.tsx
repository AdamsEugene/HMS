import type { Department } from "../../types";
import {
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface BasicInformationProps {
  department: Department;
  updateField: <K extends keyof Department>(
    field: K,
    value: Department[K]
  ) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  department,
  updateField,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 flex items-center">
          <BuildingOffice2Icon className="h-5 w-5 text-primary mr-2" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dept-name" className="form-label">
              Department Name
            </label>
            <input
              id="dept-name"
              type="text"
              className="form-input"
              value={department.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="dept-type" className="form-label">
              Department Type
            </label>
            <select
              id="dept-type"
              className="form-select"
              value={department.type}
              onChange={(e) => updateField("type", e.target.value)}
            >
              <option value="Clinical">Clinical</option>
              <option value="Clinical Support">Clinical Support</option>
              <option value="Administrative">Administrative</option>
              <option value="Financial">Financial</option>
              <option value="Technical">Technical</option>
              <option value="Operational Support">Operational Support</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="dept-description" className="form-label">
              Description
            </label>
            <textarea
              id="dept-description"
              className="form-input"
              rows={3}
              value={department.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="dept-location" className="form-label">
              Location
            </label>
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="dept-location"
                type="text"
                className="form-input flex-1"
                value={department.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Building, Floor, Room"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dept-extension" className="form-label">
              Extension Number
            </label>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="dept-extension"
                type="text"
                className="form-input flex-1"
                value={department.extension}
                onChange={(e) => updateField("extension", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dept-email" className="form-label">
              Email Address
            </label>
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="dept-email"
                type="email"
                className="form-input flex-1"
                value={department.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dept-established" className="form-label">
              Established Date
            </label>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="dept-established"
                type="date"
                className="form-input flex-1"
                value={department.establishedDate}
                onChange={(e) => updateField("establishedDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dept-status" className="form-label">
              Status
            </label>
            <select
              id="dept-status"
              className="form-select"
              value={department.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as "Active" | "Inactive" | "Under Construction"
                )
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
