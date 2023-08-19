// backend/routes/api/bookings.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateSpot } = require('../../utils/validators/spots')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { SpotImage } = require('../../db/models');

const router = express.Router();