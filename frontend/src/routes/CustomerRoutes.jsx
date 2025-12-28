import { Routes, Route, Navigate } from "react-router-dom";

import Header from "../components/Header/Header";
import Navbar from "../components/Header/Navbar";

import Home from "../pages/Customer/Home/Home";
import ServiceList from "../pages/Customer/Services/ServiceList";
import Booking from "../pages/Customer/Booking/Booking";
import Orders from "../pages/Customer/Orders/Orders";
import Appointments from "../pages/Customer/Appointments/Appointments";
import Profile from "../pages/Customer/Profile/Profile";

const CustomerRoutes = () => {
  return (
    <>
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:type" element={<ServiceList />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default CustomerRoutes;
