// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateSignup } = require('../../utils/validators/users')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


// Sign up
router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const existingUsers = await User.unscoped().findAll({
    where: { [Op.or]: [{ email: email }, { username: username }] },
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


module.exports = router