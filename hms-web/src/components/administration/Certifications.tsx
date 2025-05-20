import type { HospitalProfile, NewCertification } from "./types";
import {
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface CertificationsProps {
  hospitalProfile: HospitalProfile;
  addCertification: () => void;
  removeCertification: (id: string) => void;
  newCertification: NewCertification;
  setNewCertification: React.Dispatch<React.SetStateAction<NewCertification>>;
  showCertificationForm: boolean;
  setShowCertificationForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Certifications = ({
  hospitalProfile,
  addCertification,
  removeCertification,
  newCertification,
  setNewCertification,
  showCertificationForm,
  setShowCertificationForm,
}: CertificationsProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <AcademicCapIcon className="h-5 w-5 text-primary mr-2" />
          Certifications
        </h3>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => setShowCertificationForm(true)}
          aria-label="Add certification"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Certification
        </button>
      </div>

      {/* Certifications list */}
      <div className="space-y-4">
        {hospitalProfile.certifications.length > 0 ? (
          hospitalProfile.certifications.map((certification) => (
            <div
              key={certification.id}
              className="border dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 dark:bg-gray-850"
            >
              <div className="mb-3 sm:mb-0">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {certification.name}
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Issued by: {certification.issuedBy}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Expires: {certification.expirationDate}
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    certification.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : certification.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {certification.status}
                </span>
                <button
                  type="button"
                  className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => removeCertification(certification.id)}
                  aria-label={`Remove certification: ${certification.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No certifications added yet
          </div>
        )}
      </div>

      {/* Add Certification form */}
      {showCertificationForm && (
        <div className="mt-4 border dark:border-gray-700 rounded-lg p-4 bg-blue-50 dark:bg-gray-750">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Add New Certification
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="cert-name" className="form-label">
                Certification Name
              </label>
              <input
                id="cert-name"
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
              <label htmlFor="cert-issuer" className="form-label">
                Issued By
              </label>
              <input
                id="cert-issuer"
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
              <label htmlFor="cert-expiry" className="form-label">
                Expiration Date
              </label>
              <input
                id="cert-expiry"
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
              <label htmlFor="cert-status" className="form-label">
                Status
              </label>
              <select
                id="cert-status"
                className="form-select"
                value={newCertification.status}
                onChange={(e) =>
                  setNewCertification({
                    ...newCertification,
                    status: e.target.value as "Active" | "Expired" | "Pending",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => setShowCertificationForm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary text-sm"
              onClick={addCertification}
            >
              Add Certification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
