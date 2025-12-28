const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* =======================
   STATIC FILES
======================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =======================
   ROUTES
======================= */

// auth & user
app.use('/api/auth', require('./routes/user/auth.routes'));
app.use('/api/users', require('./routes/user/user.routes'));
app.use('/api/roles', require('./routes/user/role.routes'));
app.use('/api/addresses', require('./routes/user/address.routes'));
app.use('/api/wallets', require('./routes/user/wallet.routes'));

// service
app.use('/api/service-categories', require('./routes/service/serviceCategory.routes'));
app.use('/api/services', require('./routes/service/service.routes'));
app.use('/api/service-partners', require('./routes/service/servicePartner.routes'));
app.use('/api/service-bookings', require('./routes/service/serviceBooking.routes'));
app.use('/api/service-reviews', require('./routes/service/serviceReview.routes'));

// food
app.use('/api/restaurants', require('./routes/food/restaurant.routes'));
app.use('/api/food-categories', require('./routes/food/foodCategory.routes'));
app.use('/api/menu-items', require('./routes/food/menuItem.routes'));
app.use('/api/food-orders', require('./routes/food/foodOrder.routes'));
app.use('/api/table-bookings', require('./routes/food/tableBooking.routes'));
app.use('/api/delivery-partners', require('./routes/food/deliveryPartner.routes'));

// retail
app.use('/api/sellers', require('./routes/retail/seller.routes'));
app.use('/api/product-categories', require('./routes/retail/productCategory.routes'));
app.use('/api/products', require('./routes/retail/product.routes'));
app.use('/api/retail-orders', require('./routes/retail/retailOrder.routes'));

// b2b
app.use('/api/companies', require('./routes/b2b/company.routes'));
app.use('/api/b2b-products', require('./routes/b2b/b2bProduct.routes'));
app.use('/api/rfq', require('./routes/b2b/rfq.routes'));
app.use('/api/quotations', require('./routes/b2b/quotation.routes'));
app.use('/api/b2b-orders', require('./routes/b2b/b2bOrder.routes'));

// doctor
app.use('/api/doctors', require('./routes/doctor/doctor.routes'));
app.use('/api/specializations', require('./routes/doctor/specialization.routes'));
app.use('/api/appointments', require('./routes/doctor/appointment.routes'));
app.use('/api/consultations', require('./routes/doctor/consultation.routes'));

// legal
app.use('/api/advocates', require('./routes/legal/advocate.routes'));
app.use('/api/legal-services', require('./routes/legal/legalService.routes'));
app.use('/api/legal-bookings', require('./routes/legal/legalBooking.routes'));
app.use('/api/legal-documents', require('./routes/legal/legalDocument.routes'));

// event
app.use('/api/vendors', require('./routes/event/vendor.routes'));
app.use('/api/event-services', require('./routes/event/eventService.routes'));
app.use('/api/event-bookings', require('./routes/event/eventBooking.routes'));
app.use('/api/custom-requirements', require('./routes/event/customRequirement.routes'));

// hotel & travel
app.use('/api/hotels', require('./routes/hotel/hotel.routes'));
app.use('/api/rooms', require('./routes/hotel/room.routes'));
app.use('/api/hotel-bookings', require('./routes/hotel/hotelBooking.routes'));
app.use('/api/travel-bookings', require('./routes/hotel/travelBooking.routes'));

// movie
app.use('/api/movies', require('./routes/movie/movie.routes'));
app.use('/api/theatres', require('./routes/movie/theatre.routes'));
app.use('/api/screens', require('./routes/movie/screen.routes'));
app.use('/api/seats', require('./routes/movie/seat.routes'));
app.use('/api/movie-bookings', require('./routes/movie/movieBooking.routes'));

// property
app.use('/api/property-owners', require('./routes/property/propertyOwner.routes'));
app.use('/api/properties', require('./routes/property/property.routes'));
app.use('/api/site-visits', require('./routes/property/siteVisit.routes'));

// bike
app.use('/api/bike-owners', require('./routes/bike/bikeOwner.routes'));
app.use('/api/bikes', require('./routes/bike/bike.routes'));
app.use('/api/bike-bookings', require('./routes/bike/bikeBooking.routes'));

// logistics
app.use('/api/logistics-companies', require('./routes/logistics/logisticsCompany.routes'));


// driver
app.use('/api/drivers', require('./routes/driver/driver.routes'));
app.use('/api/driver-bookings', require('./routes/driver/driverBooking.routes'));

// matrimony
app.use('/api/matrimony/profiles', require('./routes/matrimony/matrimonyProfile.routes'));
app.use('/api/matrimony/interests', require('./routes/matrimony/interest.routes'));
app.use('/api/matrimony/matches', require('./routes/matrimony/match.routes'));
app.use('/api/matrimony/subscriptions', require('./routes/matrimony/subscription.routes'));

// classified
app.use('/api/classified/categories', require('./routes/classified/classifiedCategory.routes'));
app.use('/api/classified/ads', require('./routes/classified/classifiedAd.routes'));
app.use('/api/classified/reports', require('./routes/classified/classifiedReport.routes'));

/* =======================
   HEALTH CHECK
======================= */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 NIZMART API is running',
  });
});

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

module.exports = app;
