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

const router = express.Router();

// get current user reviews
// need to add review Images
router.get('/me/reviews', requireAuth, async (req, res, _next) => {
  const { user } = req
  const myReviews = await Review.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
       model: Spot,
       attributes: {
        exclude: ['createdAt', 'updatedAt']
       } 
      }
    ]
  })

  res.json({ Reviews: myReviews })
})

// get current user bookings
router.get('/me/bookings', requireAuth, async (req, res, _next) => {
  const { user } = req
  const myBookings = await Booking.findAll({
    where: {
      userId: user.id
    },
    include: {
      model: Spot,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  })
  res.json({ Bookings: myBookings })
})

// Sign up
router.post('/signup', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  try {

    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = user.toSafeUser()

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });

    // Fail-safe in case anything goes wrong
  } catch (e) {
    const err = new Error('Account creation failed');
    err.status = 401;
    err.title = 'Account creation failed';
    err.errors = { message: 'Please check all fields match the required parameters.' };
    return next(err);
  }

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

// logs out current session
router.delete('/me', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
}
);


module.exports = router