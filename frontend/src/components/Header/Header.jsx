import "./Header.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="niz-header">
      {/* LEFT : LOGO */}
      <div className="niz-header-left">
        <img
          src="/src/assets/logo/nizmart-logo.png"
          alt="Nizmart Logo"
          className="niz-logo"
        />
        <span className="niz-logo-text">NIZMART</span>
      </div>

      {/* CENTER : SEARCH */}
      <div className="niz-header-center">
        <input
          type="text"
          placeholder="Search services, products, doctors, restaurants..."
          className="niz-search"
        />
      </div>

      {/* RIGHT : LOGIN / USER */}
      <div className="niz-header-right">
        {user ? (
          <div className="niz-user">
            <span className="niz-user-name">Hi, {user.name}</span>
          </div>
        ) : (
          <button className="niz-login-btn">Login</button>
        )}
      </div>
    </header>
  );
};

export default Header;
