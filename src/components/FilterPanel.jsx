import { useEffect, useState } from "react";

// Array of specialties for the filter
const SPECIALTIES = [
  "General Physician",
  "Dentist",
  "Dermatologist",
  "Paediatrician",
  "Gynaecologist",
  "ENT",
  "Diabetologist",
  "Cardiologist",
  "Physiotherapist",
  "Endocrinologist",
  "Orthopaedic",
  "Ophthalmologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Psychiatrist",
  "Urologist",
  "Dietitian/Nutritionist",
  "Psychologist",
  "Sexologist",
  "Nephrologist",
  "Neurologist",
  "Oncologist",
  "Ayurveda",
  "Homeopath",
];

const FilterPanel = ({
  filters,
  setFilters,
  doctors,
}) => {
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    // Extract unique specialties from the doctor data and set them
    const uniqueSpecs = Array.from(
      new Set(doctors.map((doc) => doc.specialty))
    );
    setSpecialties(uniqueSpecs);
  }, [doctors]);

  const handleSpecialtyChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFilters((prev) => ({
        ...prev,
        specialties: [...prev.specialties, value],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        specialties: prev.specialties.filter((spec) => spec !== value),
      }));
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <strong>Consultation Type:</strong>
        <select
          value={filters.consultationType}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              consultationType: e.target.value,
            }))
          }
        >
          <option value="">All</option>
          <option value="online">Online</option>
          <option value="in-person">In-person</option>
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Specialties:</strong>
        <div className="specialties-filter">
          {SPECIALTIES.map((specialty) => (
            <label key={specialty}>
              <input
                type="checkbox"
                value={specialty}
                checked={filters.specialties.includes(specialty)}
                onChange={handleSpecialtyChange}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      <div>
        <strong>Sort by:</strong>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: e.target.value,
            }))
          }
        >
          <option value="">None</option>
          <option value="fees">Fees (Low to High)</option>
          <option value="experience">Experience (High to Low)</option>
          <option value="specialty">Specialty (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
