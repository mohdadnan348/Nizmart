import "./Profile.css";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Common/Button";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="niz-profile">
      <h2 className="niz-profile-title">My Profile</h2>

      {/* USER INFO */}
      <div className="niz-profile-card">
        <h3>Account Details</h3>

        <div className="niz-profile-row">
          <span>Name</span>
          <strong>{user?.name || "Guest User"}</strong>
        </div>

        <div className="niz-profile-row">
          <span>Email</span>
          <strong>{user?.email || "Not provided"}</strong>
        </div>

        <div className="niz-profile-row">
          <span>Phone</span>
          <strong>{user?.phone || "Not provided"}</strong>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="niz-profile-actions">
        <Button
          text="My Orders"
          variant="outline"
          onClick={() => navigate("/orders")}
        />
        <Button
          text="My Appointments"
          variant="outline"
          onClick={() => navigate("/appointments")}
        />
        <Button
          text="Logout"
          variant="danger"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Profile;
