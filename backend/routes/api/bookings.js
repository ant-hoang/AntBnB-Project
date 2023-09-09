// backend/routes/api/bookings.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateBooking } = require('../../utils/validators/bookings')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { SpotImage } = require('../../db/models');

const router = express.Router();

// add preview image
router.get('/me', requireAuth, async (req, res, _next) => {
  const { user } = req
  const myBookings = await Booking.findAll({
    where: {
      userId: user.id
    },
    include: {
      model: Spot,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  })
  res.json({ Bookings: myBookings })
})

// edit a booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
  const { bookingId } = req.params
  const currUserId = req.user.id
  const { startDate, endDate } = req.body

  try {
    const findBooking = await Booking.findByPk(+bookingId)

    if (!findBooking) throw new Error('Booking coultn\'t be found')

    if (findBooking.userId !== +currUserId) {
      const err = new Error('Cannot edit a booking the user does not own')
      err.status = 403
      return next(err)
    }

    const currStartDate = findBooking.startDate
    const currEndDate = findBooking.endDate

    if ((startDate > currStartDate && startDate < currEndDate) || (endDate > currStartDate && endDate < currEndDate) || (startDate < currStartDate && endDate > currEndDate)) {
      const err = new Error('Sorry, this spot is already booked for the specified dates')
      err.status = 403;
      err.errors = {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking"
      }

      return next(err)
    }

    let currentDate = new Date()
    let editedCurrentDate = currentDate.toISOString().slice(0, 10)

    if (editedCurrentDate > currEndDate) {
      const err = new Error('Past bookings can\'t be modified')
      err.status = 400;
      return next(err)
    }

    const editedBooking = await findBooking.update({
      startDate: startDate,
      endDate: endDate
    })

    res.json(editedBooking)

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// delete a booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const { bookingId } = req.params
  const currUserId = req.user.id

  try {
    const findBooking = await Booking.findByPk(+bookingId)
    if (!findBooking) throw new Error('Booking couldn\'t be found')
    if (findBooking.userId !== +currUserId) {
      const err = new Error('Current user does not own this booking')
      err.status = 403;

      return next(err)
    }

    let currentDate = new Date()
    let editedCurrentDate = currentDate.toISOString().slice(0, 10)

    if (editedCurrentDate > findBooking.startDate) {
      const err = new Error('Bookings that have been started can\'t be deleted')
      err.status = 403
      return next(err)
    }

    await findBooking.destroy()
    res.json({ message: "Successfully deleted" })

  } catch (err) {
    err.status = 404;
    return next(err);
  }


})

module.exports = router