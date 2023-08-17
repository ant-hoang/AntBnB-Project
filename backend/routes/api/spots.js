// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const router = express.Router();



// Get all Spots by the current user
router.get('/me', async (req, res) => {
  const currentUserId = req.user.id
  const currentUserSpots = await Spot.findAll({
    where: {
      id: currentUserId
    }
  })
  res.json({ Spots: currentUserSpots })
})


// Get all Spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll()

  res.json({ "Spots": spots })
})

// /reviews/spots/:spotId
router.get('/:spotId/reviews')


module.exports = router