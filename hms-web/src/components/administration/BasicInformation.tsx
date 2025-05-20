import {
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import type { HospitalProfile } from "./types";

interface BasicInformationProps {
  hospitalProfile: HospitalProfile;
  updateProfileField: <K extends keyof HospitalProfile>(
    field: K,
    value: HospitalProfile[K]
  ) => void;
}

const BasicInformation = ({
  hospitalProfile,
  updateProfileField,
}: BasicInformationProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 flex items-center">
        <BuildingOffice2Icon className="h-5 w-5 text-primary mr-2" />
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="hospital-name" className="form-label">
            Hospital Name
          </label>
          <input
            id="hospital-name"
            type="text"
            className="form-input"
            value={hospitalProfile.name}
            onChange={(e) => updateProfileField("name", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="hospital-type" className="form-label">
            Hospital Type
          </label>
          <select
            id="hospital-type"
            className="form-select"
            value={hospitalProfile.type}
            onChange={(e) => updateProfileField("type", e.target.value)}
          >
            <option value="General Hospital">General Hospital</option>
            <option value="Specialty Hospital">Specialty Hospital</option>
            <option value="Teaching Hospital">Teaching Hospital</option>
            <option value="Rehabilitation Center">Rehabilitation Center</option>
            <option value="Children's Hospital">Children's Hospital</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="hospital-address" className="form-label">
            Address
          </label>
          <input
            id="hospital-address"
            type="text"
            className="form-input"
            value={hospitalProfile.address}
            onChange={(e) => updateProfileField("address", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="hospital-phone" className="form-label">
            Phone Number
          </label>
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              id="hospital-phone"
              type="tel"
              className="form-input flex-1"
              value={hospitalProfile.phone}
              onChange={(e) => updateProfileField("phone", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="hospital-email" className="form-label">
            Email Address
          </label>
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              id="hospital-email"
              type="email"
              className="form-input flex-1"
              value={hospitalProfile.email}
              onChange={(e) => updateProfileField("email", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="hospital-website" className="form-label">
            Website
          </label>
          <div className="flex items-center">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              id="hospital-website"
              type="text"
              className="form-input flex-1"
              value={hospitalProfile.website}
              onChange={(e) => updateProfileField("website", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="hospital-year" className="form-label">
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
                updateProfileField("establishedYear", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
