import "./Orders.css";
import Button from "../../../components/Common/Button";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  // 🔹 TEMP DUMMY DATA (baad me API se aayega)
  const orders = [
    {
      id: 1,
      type: "home",
      title: "Electrician Service",
      date: "10 Jan 2025",
      time: "11:00 AM",
      status: "Confirmed",
      price: "₹199",
    },
    {
      id: 2,
      type: "doctor",
      title: "Doctor Appointment",
      date: "12 Jan 2025",
      time: "5:30 PM",
      status: "Completed",
      price: "₹500",
    },
    {
      id: 3,
      type: "food",
      title: "Food Order",
      date: "8 Jan 2025",
      time: "9:00 PM",
      status: "Delivered",
      price: "₹350",
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Confirmed") return "status-confirmed";
    if (status === "Completed") return "status-completed";
    if (status === "Delivered") return "status-delivered";
    return "";
  };

  return (
    <div className="niz-orders">
      <h2 className="niz-orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="niz-empty">No orders found.</p>
      ) : (
        <div className="niz-orders-list">
          {orders.map((order) => (
            <div key={order.id} className="niz-order-card">
              <div className="niz-order-info">
                <h3>{order.title}</h3>
                <p>{order.date} • {order.time}</p>
                <p className={`niz-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </p>
                <p className="niz-price">{order.price}</p>
              </div>

              <div className="niz-order-actions">
                <Button
                  text="View Details"
                  variant="outline"
                  onClick={() => navigate("/")}
                />
                <Button
                  text="Rebook"
                  onClick={() => navigate("/")}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
