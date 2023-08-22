// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateQuery, validateSpot } = require('../../utils/validators/spots')
const { validateBooking } = require('../../utils/validators/bookings')
const { validateReview } = require('../../utils/validators/reviews')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Review } = require('../../db/models');
const { Booking } = require('../../db/models');
const { sequelize } = require('../../db/models')

const router = express.Router();

// Get all Spots with query parameters
router.get('/?', validateQuery, async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

  // pagination
  const pagination = {}
  if (!page) page = 1
  if (!size) size = 20

  page = parseInt(page)
  size = parseInt(size)

  if (page >= 1 && size >= 1) {
    pagination.limit = size
    pagination.offset = size * (page - 1)
  }

  // search parameters
  const where = {}
  
  if(minLat) where.lat = {[Op.gt]: minLat}
  if(maxLat) where.lat = {[Op.lt]: maxLat}
  if(minLng) where.lng = {[Op.gt]: minLng}
  if(maxLng) where.lng = {[Op.lt]: maxLng}
  if(minPrice) where.price = {[Op.gt]: minPrice}
  if(maxPrice) where.price = {[Op.lt]: maxPrice}

  const allSpots = await Spot.findAll({
    where,
    ...pagination
  })
  let spots = []

  for (let i = 0; i < allSpots.length; i++) {
    let spot = allSpots[i].toJSON()
    let spotImage = await SpotImage.findOne(
      {
        where: {
          spotId: spot.id,
          preview: true
        },
      })
    if (spotImage) {
      spot.previewImage = spotImage.url
      spots.push(spot)
    }
  }


  res.json({ Spots: spots, page, size })
})

// Get all Spots by the current user
router.get('/me', requireAuth, async (req, res) => {
  const currentUserId = req.user.id
  const currentUserSpots = await Spot.findAll({
    where: {
      ownerId: currentUserId
    }
  })
  res.json({Spots: currentUserSpots})
})

// get all reviews from a specific spot
// need to include ReviewImage Model
router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
  const { spotId } = req.params

  try {
    const findReviews = await Review.findAll({
      where: {
        spotId: spotId
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    })

    if (!findReviews.length) throw new Error('Cannot get reviews')

    res.json({ Reviews: findReviews })

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// create a review for a specific spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { spotId } = req.params
  const { review, stars } = req.body
  const userId = req.user.id

  try {
    // check if the user already created a review for this spot
    const checkIfReview = await Review.findAll({
      where: {
        spotId: spotId,
        userId: userId
      }
    })
    if (checkIfReview.length) {
      const err = new Error('User already has a review for this spot')
      err.status = 403
      return next(err)
    }

    // check if the spot exists
    const findSpot = await Spot.findByPk(+spotId)
    if (!findSpot) throw new Error('Spot couldn\'t be found')

    const newReview = await Review.create({ userId, spotId, review, stars })
    res.json(newReview)
  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// get all bookings for a spot based on spot ID
// need to include ReviewImage model
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params
  const currUserId = req.user.id

  try {
    const getSpot = await Spot.findByPk(+spotId)
    if (!getSpot) throw new Error('Spot couldn\'t be found')

    if (currUserId === getSpot.id) {
      const getBooking = await Booking.findAll({
        where: {
          spotId: spotId
        },
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      })

      return res.json({ Bookings: getBooking })

    } else {
      const getBooking = await Booking.findAll({
        where: {
          spotId: spotId
        },
        attributes: ['spotId', 'startDate', 'endDate']
      })

      return res.json({ Bookings: getBooking })
    }

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// create a booking from a spot based on spot Id
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const { spotId } = req.params
  const userId = req.user.id
  const { startDate, endDate } = req.body

  try {
    const findSpot = await Spot.findByPk(+spotId)
    const findBooking = await Booking.findAll({ where: { spotId: spotId } })

    if (!findSpot) throw new Error('Spot coultn\'t be found')
    if (findSpot.ownerId === +userId) {
      const err = new Error('Cannot book a spot current user owns')
      err.status = 403
      return next(err)
    }

    for (let i = 0; i < findBooking.length; i++) {
      let currStartDate = findBooking[i].startDate
      let currEndDate = findBooking[i].endDate

      if ((startDate >= currStartDate && startDate <= currEndDate) || (endDate >= currStartDate && endDate <= currEndDate) || (startDate <= currStartDate && endDate >= currEndDate)) {
        const err = new Error('Sorry, this spot is already booked for the specified dates')
        err.status = 403;
        err.errors = {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }

        return next(err)
      }
    }

    const newBooking = await Booking.create({ spotId, userId, startDate, endDate })

    res.json(newBooking)

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// add an image to a spot
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params
  const { url, preview } = req.body
  const currUserId = req.user.id

  try {
    const findSpot = await Spot.findByPk(+spotId)

    if (!findSpot) throw new Error('Spot couldn\'t be found')
    console.log('ownerId:', findSpot.ownerId)
    console.log('currUserId:', currUserId)
    if (findSpot.ownerId !== +currUserId) {
      const err = new Error('Current user does not own this spot')
      err.status = 403
      return next(err)
    }

    const newSpotImage = await SpotImage.create({ spotId, url, preview })

    res.json(newSpotImage)

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// delete an image from a spot
router.delete('/:spotId/images/:imageId', requireAuth, async (req, res, next) => {
  const { spotId, imageId } = req.params
  const currUserId = req.user.id


  try {
    const findSpot = await Spot.findByPk(+spotId)
    if (findSpot.ownerId !== +currUserId) {
      const err = new Error('Current user does not own this spot')
      err.status = 403
      return next(err)
    }

    const getSpotImage = await SpotImage.findAll({
      where: {
        [Op.and]: [
          { spotId: spotId },
          { id: imageId }
        ]
      }
    })

    if (!getSpotImage.length) throw new Error('Spot/Image couldn\'t be found')

    await getSpotImage[0].destroy()

    res.json({ message: "Successfully deleted" })

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// Edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {

  const { spotId } = req.params
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  const currUserId = req.user.id

  try {
    const findSpot = await Spot.findByPk(+spotId)

    let checkFound = Object.keys(findSpot)
    if (!checkFound.length) {
      throw new Error('Spot couldn\'t be found')

    } else if (findSpot.ownerId !== +currUserId) {
      const err = new Error('Current user does not own this spot')
      err.status = 403
      return next(err)

    } else {
      const editedSpot = await findSpot.update({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
      })

      res.json(editedSpot)
    }

  } catch (err) {
    // const err = new Error('Spot couldn\'t be found')
    err.status = 404
    return next(err);
  }
})

// Delete a specific spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { spotId } = req.params
  const currUserId = req.user.id

  try {
    const deleteSpot = await Spot.findByPk(+spotId)
    if (!deleteSpot) throw new Error('Spot couldn\'t be found')
    if (deleteSpot.ownerId !== +currUserId) {
      const err = new Error('Current user does not own this spot')
      err.status = 403
      return next(err)
    }

    await deleteSpot.destroy()

    res.json({ message: "Successfully deleted" })
  } catch (err) {
    err.status = 404
    return next(err);
  }
})




// Need to add average rating and preview image
// Average Rating pulled from reviews table and create an average aggregate query
router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params

  try {
    const getDetailedSpot = await Spot.findAll(
      {
        where: {
          id: +spotId
        },
        include: [
          {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
          },
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      }
    )

    if (!getDetailedSpot.length) throw new Error()

    res.json(getDetailedSpot[0])

  } catch (err) {
    err.message = 'Spot couldn\'t be found'
    err.status = 404;
    return next(err)
  }
})



// Create a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  const ownerId = req.user.id
  try {
    const currentSpots = await Spot.findAll({
      where: {
        [Op.or]: {
          address: address
        }
      }
    })

    if (currentSpots.length) {
      const err = new Error('Bad request')
      err.status = 400;
      err.errors = { message: 'Spot address has already been created.' };
      return next(err);
    }

    const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

    res.json(newSpot)

  } catch (e) {
    const err = new Error('Spot creation failed');
    err.status = 400;
    err.errors = { message: 'Please check all fields match the required parameters.' };
    return next(err);
  }
})

// Get all Spots
// Code has previewImage added
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll()
  let spots = []

  for (let i = 0; i < allSpots.length; i++) {
    let spot = allSpots[i].toJSON()
    let spotImage = await SpotImage.findOne(
      {
        where: {
          spotId: spot.id,
          preview: true
        },
      })
    if (spotImage) {
      spot.previewImage = spotImage.url
      spots.push(spot)
    }
  }


  res.json({ "Spots": spots })
})

module.exports = router