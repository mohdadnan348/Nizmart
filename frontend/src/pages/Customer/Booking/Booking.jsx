import "./Booking.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../../../components/Common/Button";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { serviceType, serviceName, price } = location.state || {};

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");

  if (!serviceType) {
    return (
      <div className="niz-booking">
        <p>Invalid booking request.</p>
      </div>
    );
  }

  const getTitle = () => {
    if (serviceType === "doctor") return "Book Appointment";
    if (serviceType === "food") return "Place Order";
    return "Book Service";
  };

  const handleConfirm = () => {
    // 👉 later yahan API call aayegi
    alert("Booking / Order Confirmed!");
    navigate("/orders");
  };

  return (
    <div className="niz-booking">
      <h2 className="niz-booking-title">{getTitle()}</h2>

      <div className="niz-booking-card">
        {/* SERVICE INFO */}
        <div className="niz-booking-section">
          <h3>Service Details</h3>
          <p><strong>Service:</strong> {serviceName}</p>
          <p><strong>Price:</strong> {price}</p>
        </div>

        {/* DATE & TIME */}
        <div className="niz-booking-section">
          <h3>Date & Time</h3>
          <div className="niz-row">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* ADDRESS */}
        {serviceType !== "food" && (
          <div className="niz-booking-section">
            <h3>Service Address</h3>
            <textarea
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}

        {/* PAYMENT */}
        <div className="niz-booking-section">
          <h3>Payment Method</h3>
          <div className="niz-payment">
            <label>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online Payment
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        {/* ACTION */}
        <div className="niz-booking-action">
          <Button
            text={getTitle()}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
