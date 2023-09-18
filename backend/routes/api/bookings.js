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
    }
  })

  let bookings = []
  for (let i = 0; i < myBookings.length; i++) {
    let booking = myBookings[i].toJSON()
    let spot = await Spot.findOne({where: {id: booking.spotId}, attributes: {exclude: ['createdAt', 'updatedAt', 'description']}})
    let spotImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true }
    })

    if (spotImage) {
      spot.dataValues.previewImage = spotImage.dataValues.url
    }

    booking.Spot = spot.toJSON()
    bookings.push(booking)
  }
  res.json({ Bookings: bookings })
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
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

    const existingBookings = await Booking.findAll({where: {
      spotId: findBooking.spotId,
      [Op.not]: {id: bookingId}
    }})

    for(let i = 0; i < existingBookings.length; i++) {
      let currStartDate = existingBookings[i].startDate
      let currEndDate = existingBookings[i].endDate

      if ((startDate >= currStartDate && startDate <= currEndDate) || (endDate >= currStartDate && endDate <= currEndDate) || (startDate <= currStartDate && endDate >= currEndDate)) {
        const err = new Error('Sorry, this spot is already booked for the specified dates')
        err.status = 403;
        listOfErrors = {}
        if (startDate >= currStartDate && startDate <= currEndDate) {
          listOfErrors.startDate = "Start date conflicts with an existing booking"
        }
        if (endDate >= currStartDate && endDate <= currEndDate) {
          listOfErrors.endDate = "End date conflicts with an existing booking"
        }
        if (startDate < currStartDate && endDate > currEndDate) {
          listOfErrors.startDate = "Start date conflicts with an existing booking"
          listOfErrors.endDate = "End date conflicts with an existing booking"
        }
        err.errors = listOfErrors
        return next(err)
      }
    }

    let currentDate = new Date()
    let editedCurrentDate = currentDate.toISOString().slice(0, 10)

    if (editedCurrentDate > findBooking.endDate) {
      const err = new Error('Past bookings can\'t be modified')
      err.status = 403;
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
      const err = new Error('Forbidden')
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