// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { validateSignup, validateLogin } = require('../../utils/validators/users')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post('/signup', validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ email, username, hashedPassword, firstName, lastName });

  const safeUser = user.toSafeUser()

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });

}
);

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
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = { credential: 'The provided credentials were invalid.' };
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

// logs out current session

// Get current user
router.get('/me', requireAuth, (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = user.toSafeUser()
    return res.json({
      user: safeUser
    });
  } else {
    return res.json({ user: null });
  }
}
);

router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
}
);

module.exports = router