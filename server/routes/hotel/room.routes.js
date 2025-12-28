const express = require('express');
const router = express.Router();

const roomController = require('../../controllers/hotel/room.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create room (hotel owner)
router.post('/', authMiddleware, roomController.createRoom);

// get rooms by hotel (public)
router.get('/hotel/:hotelId', roomController.getRoomsByHotel);

// get room by id (public)
router.get('/:id', roomController.getRoomById);

// check availability (public)
router.get('/:id/availability', roomController.checkAvailability);

// update room (hotel owner)
router.put('/:id', authMiddleware, roomController.updateRoom);

// activate / deactivate room (hotel owner)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  roomController.toggleRoomStatus
);

module.exports = router;
