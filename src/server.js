'use strict';
const authRouter = require('./auth/router.js');
// ---------------------------------------------------------------------------
// Dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// ---------------------------------------------------------------------------
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// ---------------------------------------------------------------------------
// Routes
app.use('/', authRouter);

// ---------------------------------------------------------------------------
module.exports = {
  server: app,
  start: (port) => {
    port = process.env.PORT || 3030;
    app.listen(port, () => {
      console.log(`up and running on ${port}`);
    });
  },
};
