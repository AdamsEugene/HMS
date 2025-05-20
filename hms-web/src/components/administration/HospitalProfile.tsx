import { useState } from "react";
import type {
  HospitalProfile as HospitalProfileType,
  NewAccreditation,
  NewCertification,
} from "./types";
import BasicInformation from "./BasicInformation";
import HospitalCapacity from "./HospitalCapacity";
import Accreditations from "./Accreditations";
import Certifications from "./Certifications";

const HospitalProfile = () => {
  // Hospital profile state
  const [hospitalProfile, setHospitalProfile] = useState<HospitalProfileType>({
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
  const [newAccreditation, setNewAccreditation] = useState<NewAccreditation>({
    name: "",
    issuedBy: "",
    expirationDate: "",
    status: "Active",
  });
  const [newCertification, setNewCertification] = useState<NewCertification>({
    name: "",
    issuedBy: "",
    expirationDate: "",
    status: "Active",
  });

  // Functions for managing hospital profile data
  const updateProfileField = <K extends keyof HospitalProfileType>(
    field: K,
    value: HospitalProfileType[K]
  ) => {
    setHospitalProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCapacityField = (
    field: keyof HospitalProfileType["capacity"],
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

  return (
    <div className="space-y-6">
      <BasicInformation
        hospitalProfile={hospitalProfile}
        updateProfileField={updateProfileField}
      />

      <HospitalCapacity
        hospitalProfile={hospitalProfile}
        updateCapacityField={updateCapacityField}
      />

      <Accreditations
        hospitalProfile={hospitalProfile}
        addAccreditation={addAccreditation}
        removeAccreditation={removeAccreditation}
        newAccreditation={newAccreditation}
        setNewAccreditation={setNewAccreditation}
        showAccreditationForm={showAccreditationForm}
        setShowAccreditationForm={setShowAccreditationForm}
      />

      <Certifications
        hospitalProfile={hospitalProfile}
        addCertification={addCertification}
        removeCertification={removeCertification}
        newCertification={newCertification}
        setNewCertification={setNewCertification}
        showCertificationForm={showCertificationForm}
        setShowCertificationForm={setShowCertificationForm}
      />
    </div>
  );
};

export default HospitalProfile;
