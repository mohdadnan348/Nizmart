import "./ServiceList.css";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Common/Button";

const ServiceList = () => {
  const { type } = useParams(); // services/:type
  const navigate = useNavigate();

  // 🔹 TEMP DUMMY DATA (baad me API se aayega)
  const serviceData = {
    home: [
      { id: 1, name: "Electrician", price: "₹199", rating: 4.5 },
      { id: 2, name: "Plumber", price: "₹249", rating: 4.4 },
      { id: 3, name: "AC Repair", price: "₹499", rating: 4.6 },
    ],
    doctor: [
      { id: 1, name: "General Physician", price: "₹500", rating: 4.7 },
      { id: 2, name: "Dermatologist", price: "₹700", rating: 4.6 },
    ],
    food: [
      { id: 1, name: "Restaurant A", price: "30 min", rating: 4.3 },
      { id: 2, name: "Restaurant B", price: "25 min", rating: 4.5 },
    ],
    shopping: [
      { id: 1, name: "Electronics Store", price: "Up to 40% OFF", rating: 4.2 },
      { id: 2, name: "Fashion Store", price: "Up to 60% OFF", rating: 4.4 },
    ],
  };

  const list = serviceData[type] || [];

  const handleAction = (item) => {
    navigate("/booking", {
      state: {
        serviceType: type,
        serviceName: item.name,
        price: item.price,
      },
    });
  };

  return (
    <div className="niz-service-list">
      <h2 className="niz-service-title">
        {type?.toUpperCase()} SERVICES
      </h2>

      {list.length === 0 ? (
        <p className="niz-empty">No services available.</p>
      ) : (
        <div className="niz-service-grid">
          {list.map((item) => (
            <div key={item.id} className="niz-service-item">
              <div className="niz-service-info">
                <h3>{item.name}</h3>
                <p className="niz-rating">⭐ {item.rating}</p>
                <p className="niz-price">{item.price}</p>
              </div>

              <Button
                text={
                  type === "doctor"
                    ? "Book Appointment"
                    : type === "food"
                    ? "Order Now"
                    : "Book Now"
                }
                onClick={() => handleAction(item)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
