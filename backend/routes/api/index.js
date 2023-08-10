// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

// All newly created routes must flow through here!!
router.use(restoreUser);
// router.use('/session', sessionRouter);
router.use('/users', usersRouter);


// // GET /api/require-auth
// router.get('/require-auth', requireAuth, (req, res) => {
//     return res.json(req.user);
//   }
// );

// // GET /api/restore-user
// router.get('/restore-user', (req, res) => {
//     return res.json(req.user);
//   }
// );

// // GET /api/set-token-cookie
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// router.post('/test', function (req, res) {
//   res.json({ requestBody: req.body });
// });

router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});



module.exports = router;