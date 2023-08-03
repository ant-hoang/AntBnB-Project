// backend/routes/api/index.js
const router = require('express').Router();

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});


module.exports = router;