// Imports -- External
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('express-async-errors');

// Imports -- Internal
const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize the app
const app = express();

// Use all global middleware
app.use(morgan('dev')); // logging

// converts json req bodies into parsed objects attached to req.body
app.use(cookieParser());
app.use(express.json()); 

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Routes

// Error handling middleware

// Exports