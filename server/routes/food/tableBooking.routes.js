const express = require('express');
const router = express.Router();
const tableBookingController = require('../../controllers/food/tableBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create table booking (user)
router.post('/', authMiddleware, tableBookingController.createTableBooking);

// get my table bookings (user)
router.get('/my', authMiddleware, tableBookingController.getMyTableBookings);

// get restaurant table bookings (restaurant owner)
router.get(
  '/restaurant/:restaurantId',
  authMiddleware,
  tableBookingController.getRestaurantTableBookings
);

// update table booking status (restaurant)
router.patch(
  '/:id/status',
  authMiddleware,
  tableBookingController.updateTableBookingStatus
);

// cancel table booking (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  tableBookingController.cancelTableBooking
);

module.exports = router;
