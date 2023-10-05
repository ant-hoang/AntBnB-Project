// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateLogin } = require('../../utils/validators/users')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// logging in a user
router.post('/', validateLogin, async (req, res, next) => {
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
    firstName: user.firstName,
    lastName: user.lastName,
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
router.get('/', (req, res) => {
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
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});


module.exports = router