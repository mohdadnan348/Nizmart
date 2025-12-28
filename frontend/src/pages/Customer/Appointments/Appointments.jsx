import "./Appointments.css";
import Button from "../../../components/Common/Button";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();

  // 🔹 TEMP DUMMY DATA (baad me API se aayega)
  const appointments = [
    {
      id: 1,
      title: "Doctor Appointment",
      name: "Dr. Rajesh Kumar",
      date: "15 Jan 2025",
      time: "10:30 AM",
      status: "Confirmed",
      fee: "₹600",
    },
    {
      id: 2,
      title: "Legal Consultation",
      name: "Advocate Anil Sharma",
      date: "18 Jan 2025",
      time: "4:00 PM",
      status: "Completed",
      fee: "₹1200",
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Confirmed") return "status-confirmed";
    if (status === "Completed") return "status-completed";
    if (status === "Cancelled") return "status-cancelled";
    return "";
  };

  return (
    <div className="niz-appointments">
      <h2 className="niz-appointments-title">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="niz-empty">No appointments found.</p>
      ) : (
        <div className="niz-appointments-list">
          {appointments.map((item) => (
            <div key={item.id} className="niz-appointment-card">
              <div className="niz-appointment-info">
                <h3>{item.title}</h3>
                <p><strong>{item.name}</strong></p>
                <p>{item.date} • {item.time}</p>
                <p
                  className={`niz-status ${getStatusClass(item.status)}`}
                >
                  {item.status}
                </p>
                <p className="niz-fee">{item.fee}</p>
              </div>

              <div className="niz-appointment-actions">
                <Button
                  text="View Details"
                  variant="outline"
                  onClick={() => navigate("/")}
                />
                {item.status === "Confirmed" && (
                  <Button
                    text="Reschedule"
                    onClick={() => navigate("/")}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
