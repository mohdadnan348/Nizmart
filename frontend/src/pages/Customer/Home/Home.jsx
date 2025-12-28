import "./Home.css";
import { useNavigate } from "react-router-dom";
import ServiceCard from "../../../components/Cards/ServiceCard";

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Home Services",
      description: "Electrician, Plumber, Carpenter, AC Repair",
      route: "/services/home",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    },
    {
      title: "Food Delivery",
      description: "Order food & table booking",
      route: "/services/food",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    },
    {
      title: "Shopping",
      description: "Fashion, Grocery, Electronics",
      route: "/services/shopping",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      title: "Doctor",
      description: "Clinic & online consultation",
      route: "/services/doctor",
      imageUrl: "https://images.unsplash.com/photo-1580281657521-6d8b5b1c47b1",
    },
    {
      title: "Legal Services",
      description: "Advocate & legal consultation",
      route: "/services/legal",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    },
    {
      title: "Wedding & Events",
      description: "Wedding, birthday & corporate events",
      route: "/services/events",
      imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    },
    {
      title: "Hotels & Travel",
      description: "Hotels, cab & travel booking",
      route: "/services/travel",
      imageUrl: "https://images.unsplash.com/photo-1502920514313-52581002a659",
    },
    {
      title: "Movies",
      description: "Movie ticket booking",
      route: "/services/movies",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    },
    {
      title: "Bike Rental",
      description: "Rent bikes & scooters",
      route: "/services/bike",
      imageUrl: "https://images.unsplash.com/photo-1518655048521-f130df041f66",
    },
    {
      title: "Book Driver",
      description: "Personal & outstation drivers",
      route: "/services/driver",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    },
    {
      title: "Matrimony",
      description: "Find your perfect match",
      route: "/services/matrimony",
      imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    },
    {
      title: "Real Estate",
      description: "Buy, sell & rent property",
      route: "/services/property",
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    },
    {
      title: "Mobile & Laptop Repair",
      description: "Phone & laptop repair services",
      route: "/services/repair",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    },
    {
      title: "B2B Marketplace",
      description: "Manufacturers & wholesalers",
      route: "/services/b2b",
      imageUrl: "https://images.unsplash.com/photo-1581093588401-22d8a3f3b2f7",
    },
    {
      title: "Retail Sellers",
      description: "Local shops & sellers",
      route: "/services/retail",
      imageUrl: "https://images.unsplash.com/photo-1521335629791-ce4aec67ddaf",
    },
    {
      title: "Delivery & Logistics",
      description: "Courier & delivery services",
      route: "/services/logistics",
      imageUrl: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
    },
    {
      title: "Cinema Booking",
      description: "Book movie tickets & shows",
      route: "/services/cinema",
      imageUrl: "https://images.unsplash.com/photo-1517602302552-471fe67acf66",
    },
    {
      title: "Service Partners",
      description: "Verified service providers",
      route: "/services/partners",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    },
  ];

  return (
    <div className="niz-home">
      <h2 className="niz-home-title">All Services</h2>

      <div className="niz-services-grid">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            imageUrl={service.imageUrl}
            onClick={() => navigate(service.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
