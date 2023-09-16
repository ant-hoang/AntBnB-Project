// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateSignup, validateLogin } = require('../../utils/validators/users')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { Booking } = require('../../db/models');
const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');

const router = express.Router();


// Sign up
router.post('/signup', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const existingUsers = await User.findAll({
    where: { [Op.or]: [{ email: email }, { username: username }] },
    attributes: {include: ['id', 'email', 'username', 'firstName', 'lastName']}
  })

  for(let i = 0; i < existingUsers.length; i++) {
    const currUser = existingUsers[i]
    if (currUser.email === email) {
      const err = new Error('User already exists')
      err.errors = { "email": "User with email already exists" }
      err.status = 500
      return next(err)
    }
    if (currUser.username === username) {
      const err = new Error('User already exists')
      err.errors = { "username": "User with username already exists" }
      err.status = 500
      return next(err)
    }
  }

  const user = await User.create({ email, username, hashedPassword, firstName, lastName });

  const safeUser = user.toSafeUser()

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });

});

// logging in a user
router.post('/login', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    return next(err);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
}
);

// Get current user
router.get('/me', (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = user.toSafeUser()
    return res.json({
      user: safeUser
    });
  } else {
    return res.json({ user: null });
  }
});

// logs out current session
router.delete('/me', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});


module.exports = router