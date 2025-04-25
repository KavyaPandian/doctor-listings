const DoctorList = ({ doctors }) => {
  if (!doctors.length) return <p>No doctors found.</p>;

  return (
    <div className="doctor-list">
      {doctors.map((doc, index) => (
        <div key={doc.id || index} className="doctor-card">
          <h3>{doc.name}</h3>
          <p>Specialty: {doc.specialty}</p>
          <p>Experience: {doc.experience} years</p>
          <p>Fees:{doc.fees}</p>
          <p>Consultation: {doc.consultationType}</p>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
