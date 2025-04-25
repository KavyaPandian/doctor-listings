import { useState, useEffect } from "react";
import "./App.css";

// Logo URL (using placeholder for now)
const LOGO_URL = "/api/placeholder/200/60";

const SPECIALTIES = [
  "General Physician", "Dentist", "Dermatologist", "Paediatrician",
  "Gynaecologist", "ENT", "Diabetologist", "Cardiologist", "Physiotherapist",
  "Endocrinologist", "Orthopaedic", "Ophthalmologist", "Gastroenterologist",
  "Pulmonologist", "Psychiatrist", "Urologist", "Dietitian/Nutritionist",
  "Psychologist", "Sexologist", "Nephrologist", "Neurologist", "Oncologist",
  "Ayurveda", "Homeopath"
];

function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [consultationType, setConsultationType] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // New: grid or list view
  const [showFavorites, setShowFavorites] = useState(false); // New: favorites filter
  const [favorites, setFavorites] = useState([]); // New: store favorite doctors
  const [ratingFilter, setRatingFilter] = useState(0); // New: rating filter

  useEffect(() => {
    // Fetch doctor data
    fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json")
      .then((res) => res.json())
      .then((data) => {
        // Add random ratings for demonstration purposes
        const enhancedData = data.map(doc => ({
          ...doc,
          rating: (Math.random() * 3 + 2).toFixed(1) // Random rating between 2.0 and 5.0
        }));
        setDoctors(enhancedData || []);
        setFilteredDoctors(enhancedData || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    
    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem('doctorFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let filtered = [...doctors];
    
    // 1. Filter by Consultation Type (Video Consult / In Clinic)
    if (consultationType) {
      if (consultationType === "Video Consult") {
        filtered = filtered.filter((doc) => doc.video_consult);
      } else if (consultationType === "In Clinic") {
        filtered = filtered.filter((doc) => doc.in_clinic);
      }
    }

    // 2. Filter by Specialties
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(
        (doc) =>
          Array.isArray(doc.specialities) &&
          doc.specialities.some((s) => selectedSpecialties.includes(s.name))
      );
    }

    // 3. Filter by Search (Doctor name)
    if (search) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // 4. Filter by Rating
    if (ratingFilter > 0) {
      filtered = filtered.filter((doc) => 
        parseFloat(doc.rating) >= ratingFilter
      );
    }
    
    // 5. Filter by Favorites
    if (showFavorites) {
      filtered = filtered.filter((doc) => 
        favorites.includes(doc.id)
      );
    }

    // 6. Sorting by Fees, Experience, or Rating
    if (sortBy === "fees") {
      filtered = filtered.sort((a, b) => {
        const feeA = parseInt((a.fees || "").replace(/[^\d]/g, ""), 10) || 0;
        const feeB = parseInt((b.fees || "").replace(/[^\d]/g, ""), 10) || 0;
        return feeA - feeB;
      });
    } else if (sortBy === "experience") {
      filtered = filtered.sort((a, b) => {
        const expA =
          parseInt((a.experience || "").replace(/[^\d]/g, ""), 10) || 0;
        const expB =
          parseInt((b.experience || "").replace(/[^\d]/g, ""), 10) || 0;
        return expB - expA;
      });
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => {
        return parseFloat(b.rating) - parseFloat(a.rating);
      });
    }

    // Update filtered list
    setFilteredDoctors(filtered);
  }, [doctors, consultationType, selectedSpecialties, search, sortBy, ratingFilter, showFavorites, favorites]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleConsultationTypeChange = (e) => {
    setConsultationType(e.target.value);
  };

  const handleSpecialtyChange = (spec) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleRatingFilterChange = (e) => {
    setRatingFilter(parseFloat(e.target.value));
  };
  
  const toggleFavorite = (doctorId) => {
    const newFavorites = favorites.includes(doctorId)
      ? favorites.filter(id => id !== doctorId)
      : [...favorites, doctorId];
    
    setFavorites(newFavorites);
    localStorage.setItem('doctorFavorites', JSON.stringify(newFavorites));
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };
  
  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push("★"); // Full star
      } else if (i === fullStars && hasHalfStar) {
        stars.push("⯨"); // Half star (approximation)
      } else {
        stars.push("☆"); // Empty star
      }
    }
    
    return (
      <span className="stars" style={{ color: "#FFD700" }}>
        {stars.join('')} ({rating})
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="header">
        <div className="logo-container">
          <img src={LOGO_URL} alt="DocFinder Logo" className="logo" />
          <h1>DocFinder</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={toggleViewMode}
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </button>
          
          <button 
            className={`favorite-toggle ${showFavorites ? 'active' : ''}`}
            onClick={toggleShowFavorites}
          >
            {showFavorites ? "Show All" : "Show Favorites"}
          </button>
        </div>
      </div>

      <div className="filter-container">
        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for a doctor"
            className="search-input"
          />
        </div>

        {/* Filter Options */}
        <div className="filter-options">
          {/* Consultation Type Filter */}
          <div className="filter-option">
            <label>Consultation Type:</label>
            <select
              value={consultationType}
              onChange={handleConsultationTypeChange}
            >
              <option value="">All Types</option>
              <option value="Video Consult">Video Consult</option>
              <option value="In Clinic">In Clinic</option>
            </select>
          </div>

          {/* Sort By Options */}
          <div className="filter-option">
            <label>Sort By:</label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="">Default</option>
              <option value="fees">Fees (Low to High)</option>
              <option value="experience">Experience (High to Low)</option>
              <option value="rating">Rating (High to Low)</option>
            </select>
          </div>
          
          {/* Rating Filter */}
          <div className="filter-option">
            <label>Minimum Rating:</label>
            <select value={ratingFilter} onChange={handleRatingFilterChange}>
              <option value="0">All Ratings</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="specialties-filter">
        <h3>Specialties:</h3>
        <div className="specialties-grid">
          {SPECIALTIES.map((specialty) => (
            <label key={specialty} className="specialty-checkbox">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      {/* Display Doctor List */}
      {loading ? (
        <div className="loading">Loading doctors...</div>
      ) : filteredDoctors.length > 0 ? (
        <div className={`doctor-list ${viewMode === "grid" ? "grid-view" : "list-view"}`}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className={`doctor-card ${viewMode === "grid" ? "grid-card" : "list-card"}`}>
              <div className="doctor-info">
                <div className="doctor-header">
                  <h2>{doctor.name}</h2>
                  <button 
                    className={`favorite-button ${favorites.includes(doctor.id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(doctor.id)}
                  >
                    {favorites.includes(doctor.id) ? "★" : "☆"}
                  </button>
                </div>
                
                <p className="specialties">{doctor.specialities?.map((s) => s.name).join(", ")}</p>
                <p className="rating">{renderStars(doctor.rating)}</p>
                <p className="fees">{doctor.fees ? `Fees: ₹${doctor.fees}` : "Fees not available"}</p>
                <p className="experience">{doctor.experience ? `Experience: ${doctor.experience}` : "Experience not available"}</p>
                
                <div className="availability">
                  {doctor.video_consult && <span className="video-badge">Video Consult</span>}
                  {doctor.in_clinic && <span className="clinic-badge">In Clinic</span>}
                </div>
              </div>
              
              <div className="doctor-actions">
                <button className="book-appointment">Book Appointment</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">No doctors found matching your criteria</div>
      )}
    </div>
  );
}

export default App;