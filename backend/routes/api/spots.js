// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateSpot } = require('../../utils/validators/spots')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');

const router = express.Router();

// Get all Spots by the current user
router.get('/me', async (req, res) => {
  const currentUserId = req.user.id
  const currentUserSpots = await Spot.findAll({
    where: {
      ownerId: currentUserId
    }
  })
  res.json(currentUserSpots)
})

// Edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  
  const { spotId } = req.params
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  const ownerId = req.user.id
  
  try {
    const editSpot = await Spot.findByPk(+spotId)

    let checkFound = Object.keys(editSpot)
    if(!checkFound.length) {
      throw new Error('Spot couldn\'t be found')
      
    } else if (editSpot.ownerId !== ownerId) {
      throw new Error('Current user does not own this spot')

    } else {
      editSpot.address = address
      editSpot.city = city
      editSpot.state = state
      editSpot.country = country
      editSpot.lat = lat
      editSpot.lng = lng
      editSpot.name = name
      editSpot.description = description
      editSpot.price = price

      res.json(editSpot)
    }

  } catch (err) {
    // const err = new Error('Spot couldn\'t be found')
    err.status = 404
    err.title = 'Spot couldn\'t be found';
    return next(err);
  }
})

// Delete a specific spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params
  try {
    const deleteSpot = await Spot.findByPk(+spotId)
    if(!deleteSpot.length) throw new Error()
    
    await deleteSpot.destroy()
    
    res.json({message: "Successfully deleted"})
  } catch (e) {
    const err = new Error('Spot couldn\'t be found')
    err.status = 404
    err.title = 'Spot couldn\'t be found';
    return next(err);
  }
})


// Need to add average rating and preview image
// Average Rating pulled from reviews table and create an average aggregate query


router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params

  // need to figure out how to exclude username
  try {
    const getDetailedSpot = await Spot.findAll(
      {
        where: {
          id: +spotId
        },
        include: {
          model: User,
        }
      }
    )
  
    if(!getDetailedSpot.length) throw new Error()
  
    res.json(getDetailedSpot)

  } catch (e) {
    const err = new Error('Spot couldn\'t be found');
    err.status = 404;
    err.title = 'Spot couldn\'t be found';
    return next(err);
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
      err.title = 'Bad request';
      err.errors = { message: 'Spot address has already been created.' };
      return next(err);
    }

    const newSpot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

    res.json(newSpot)

  } catch (e) {
    const err = new Error('Spot creation failed');
    err.status = 400;
    err.title = 'Spot creation failed';
    err.errors = { message: 'Please check all fields match the required parameters.' };
    return next(err);
  }
})

// Get all Spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll()

  res.json({ "Spots": spots })
})

// /reviews/spots/:spotId
router.get('/:spotId/reviews')


module.exports = router