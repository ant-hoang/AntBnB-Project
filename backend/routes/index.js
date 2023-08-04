// backend/routes/index.js
const express = require('express');
const apiRouter = require('./api');
const router = express.Router();

router.use('/api', apiRouter)


module.exports = router;