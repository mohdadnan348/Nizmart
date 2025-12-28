import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="niz-navbar">
      <ul className="niz-navbar-list">
        <li>
          <NavLink to="/" className="niz-nav-link">
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/home" className="niz-nav-link">
            Home Services
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/food" className="niz-nav-link">
            Food
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/shopping" className="niz-nav-link">
            Shopping
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/doctor" className="niz-nav-link">
            Doctor
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/legal" className="niz-nav-link">
            Legal
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/events" className="niz-nav-link">
            Wedding & Events
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/travel" className="niz-nav-link">
            Travel
          </NavLink>
        </li>

        <li>
          <NavLink to="/services/movies" className="niz-nav-link">
            Movies
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
