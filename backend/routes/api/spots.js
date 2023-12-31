// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize')
const { validateQuery, validateSpot } = require('../../utils/validators/spots')
const { validateBooking } = require('../../utils/validators/bookings')
const { validateReview } = require('../../utils/validators/reviews')
const { requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Review } = require('../../db/models');
const { Booking } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { sequelize } = require('../../db/models')

const router = express.Router();


// Get all Spots by the current user
router.get('/current', requireAuth, async (req, res) => {
  const currentUserId = req.user.id
  const allSpots = await Spot.findAll({
    where: {
      ownerId: currentUserId
    }
  })
  let spots = []

  for (let i = 0; i < allSpots.length; i++) {
    let spot = allSpots[i].toJSON()
    let spotImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
    })
    let reviewRating = await allSpots[i].getReviews({
      attributes: [
        [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
      ]
    })

    spot.avgRating = reviewRating[0].dataValues.avgRating || 0

    if (spotImage) {
      spot.previewImage = spotImage.url
    }
    spots.push(spot)
  }


  res.json({ "Spots": spots })
})

// get all reviews from a specific spot
router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params

  try {
    const findSpot = await Spot.findAll({ where: { id: spotId } })
    if (!findSpot.length) throw new Error('Spot couldn\'t be found')

    const findReviews = await Review.findAll({
      where: {
        spotId: spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    })

    res.json({ Reviews: findReviews })

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// create a review for a specific spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  let { spotId } = req.params
  const { review, stars } = req.body
  const userId = req.user.id

  try {
    const checkIfReview = await Review.findAll({
      where: {
        spotId: spotId,
        userId: userId
      }
    })

    if (checkIfReview.length) {
      const err = new Error('User already has a review for this spot')
      err.status = 500
      return next(err)
    }

    const findSpot = await Spot.findByPk(+spotId)
    if (!findSpot) throw new Error('Spot couldn\'t be found')
    spotId = parseInt(spotId)

    const newReview = await Review.create({ userId, spotId, review, stars })
    res.status(201)
    res.json(newReview)
  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

// get all bookings for a spot based on spot ID
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params
  const currUserId = req.user.id

  try {
    const getSpot = await Spot.findByPk(+spotId)
    if (!getSpot) throw new Error('Spot couldn\'t be found')

    if (currUserId === getSpot.ownerId) {
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

    if (!findSpot) throw new Error('Spot couldn\'t be found')
    if (findSpot.ownerId === +userId) {
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

    if (startDate >= endDate) {
      const err = new Error('Bad Request')
      err.errors = { endDate: 'endDate cannot be on or before startDate' }
      err.status = 400
      return next(err)
    }

    let valueDate = Date.parse(startDate);
    let todayDate = Date.now();
    if (valueDate < todayDate) {
      const err = new Error('cannot book a spot before the present date')
      err.status = 403
      return next(err)
    }


    for (let i = 0; i < findBooking.length; i++) {
      let currStartDate = findBooking[i].startDate
      let currEndDate = findBooking[i].endDate

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
    if (findSpot.ownerId !== +currUserId) {
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

    const countSpotImages = await SpotImage.findAll({ where: { spotId: spotId } })
    if (countSpotImages.length >= 10) {
      const err = new Error('Maximum number of images for this resource was reached')
      err.status = 403
      return next(err)
    }

    for (let i = 0; i < countSpotImages.length; i++) {
      const currSpotImage = countSpotImages[i]
      if (currSpotImage.preview) {
        const err = new Error('User has already set a preview image for this spot')
        err.status = 500
        return next(err)
      }
    }

    const newSpotImage = await SpotImage.create({ spotId, url, preview })

    res.json({
      "id": newSpotImage.dataValues.id,
      "url": newSpotImage.dataValues.url,
      "preview": newSpotImage.dataValues.preview
    })

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

    if (!findSpot) throw new Error('Spot couldn\'t be found')
    if (findSpot.ownerId !== +currUserId) {
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

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

  } catch (err) {
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
      const err = new Error('Forbidden')
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

// get a specific spot
router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params

  try {

    const allSpots = await Spot.findAll({
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
    })

    if (!allSpots.length) throw new Error()
    let spots = []

    for (let i = 0; i < allSpots.length; i++) {
      let spot = allSpots[i].toJSON()
      let spotImage = await SpotImage.findOne({
        where: { spotId: spot.id, preview: true },
      })
      let reviewRating = await allSpots[i].getReviews({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('stars')), 'numReviews'],
          [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
        ]
      })

      spot.numReviews = reviewRating[0].dataValues.numReviews || 0
      spot.avgRating = reviewRating[0].dataValues.avgRating || 0

      if (spotImage) {
        spot.previewImage = spotImage.url
      }
      spots.push(spot)
    }

    res.json({ "Spots": spots[0] })

  } catch (err) {
    err.message = 'Spot couldn\'t be found'
    err.status = 404;
    return next(err)
  }
})

// Create a spot
router.post('/', requireAuth, validateSpot, async (req, res, _next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  const ownerId = req.user.id

  const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

  res.status(201)
  res.json(newSpot)
})

// Get all Spots (optional: with query parameters)
router.get('/', validateQuery, async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
  if (page || size || minLat || maxLat || minLng || maxLng || minPrice || maxPrice) {
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

    if (minLat) where.lat = { [Op.gt]: minLat }
    if (maxLat) where.lat = { [Op.lt]: maxLat }
    if (minLng) where.lng = { [Op.gt]: minLng }
    if (maxLng) where.lng = { [Op.lt]: maxLng }
    if (minPrice) where.price = { [Op.gt]: minPrice }
    if (maxPrice) where.price = { [Op.lt]: maxPrice }

    const allSpots = await Spot.findAll({
      where,
      ...pagination
    })
    let spots = []

    for (let i = 0; i < allSpots.length; i++) {
      let spot = allSpots[i].toJSON()
      let spotImage = await SpotImage.findOne({
        where: { spotId: spot.id, preview: true },
      })
      let reviewRating = await allSpots[i].getReviews({
        attributes: [
          [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
        ]
      })

      spot.avgRating = reviewRating[0].dataValues.avgRating || 0

      if (spotImage) {
        spot.previewImage = spotImage.url
      }
      spots.push(spot)
    }


    res.json({ Spots: spots, page, size })

  } else {
    const allSpots = await Spot.findAll()
    let spots = []

    for (let i = 0; i < allSpots.length; i++) {
      let spot = allSpots[i].toJSON()
      let spotImage = await SpotImage.findOne({
        where: { spotId: spot.id, preview: true },
      })
      let reviewRating = await allSpots[i].getReviews({
        attributes: [
          [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
        ]
      })

      spot.avgRating = reviewRating[0].dataValues.avgRating || 0

      if (spotImage) {
        spot.previewImage = spotImage.url
      }
      spots.push(spot)
    }

    res.json({ "Spots": spots })
  }
})


module.exports = router