import "./ServiceCard.css";

const ServiceCard = ({ title, description, imageUrl, onClick }) => {
  return (
    <div className="niz-service-card" onClick={onClick}>
      <div className="niz-service-image-wrapper">
        <img
          src={`${imageUrl}?auto=format&fit=crop&w=600&q=60`}
          alt={title}
          className="niz-service-image"
        />
      </div>

      <div className="niz-service-content">
        <h3 className="niz-service-title">{title}</h3>
        <p className="niz-service-desc">{description}</p>
        <button className="niz-service-btn">Explore</button>
      </div>
    </div>
  );
};

export default ServiceCard;
