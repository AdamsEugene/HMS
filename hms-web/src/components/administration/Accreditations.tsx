import type { HospitalProfile, NewAccreditation } from "./types";
import { BookmarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface AccreditationsProps {
  hospitalProfile: HospitalProfile;
  addAccreditation: () => void;
  removeAccreditation: (id: string) => void;
  newAccreditation: NewAccreditation;
  setNewAccreditation: React.Dispatch<React.SetStateAction<NewAccreditation>>;
  showAccreditationForm: boolean;
  setShowAccreditationForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Accreditations = ({
  hospitalProfile,
  addAccreditation,
  removeAccreditation,
  newAccreditation,
  setNewAccreditation,
  showAccreditationForm,
  setShowAccreditationForm,
}: AccreditationsProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <BookmarkIcon className="h-5 w-5 text-primary mr-2" />
          Accreditations
        </h3>
        <button
          type="button"
          className="btn-primary text-sm flex items-center"
          onClick={() => setShowAccreditationForm(true)}
          aria-label="Add accreditation"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Accreditation
        </button>
      </div>

      {/* Accreditations list */}
      <div className="space-y-4">
        {hospitalProfile.accreditations.length > 0 ? (
          hospitalProfile.accreditations.map((accreditation) => (
            <div
              key={accreditation.id}
              className="border dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 dark:bg-gray-850"
            >
              <div className="mb-3 sm:mb-0">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {accreditation.name}
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Issued by: {accreditation.issuedBy}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Expires: {accreditation.expirationDate}
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    accreditation.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : accreditation.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {accreditation.status}
                </span>
                <button
                  type="button"
                  className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => removeAccreditation(accreditation.id)}
                  aria-label={`Remove accreditation: ${accreditation.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No accreditations added yet
          </div>
        )}
      </div>

      {/* Add Accreditation form */}
      {showAccreditationForm && (
        <div className="mt-4 border dark:border-gray-700 rounded-lg p-4 bg-blue-50 dark:bg-gray-750">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Add New Accreditation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="acc-name" className="form-label">
                Accreditation Name
              </label>
              <input
                id="acc-name"
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
              <label htmlFor="acc-issuer" className="form-label">
                Issued By
              </label>
              <input
                id="acc-issuer"
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
              <label htmlFor="acc-expiry" className="form-label">
                Expiration Date
              </label>
              <input
                id="acc-expiry"
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
              <label htmlFor="acc-status" className="form-label">
                Status
              </label>
              <select
                id="acc-status"
                className="form-select"
                value={newAccreditation.status}
                onChange={(e) =>
                  setNewAccreditation({
                    ...newAccreditation,
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
              onClick={() => setShowAccreditationForm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary text-sm"
              onClick={addAccreditation}
            >
              Add Accreditation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accreditations;
