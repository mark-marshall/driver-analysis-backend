const express = require('express');

const routes = express.Router();

/*
[GET] - to /events
*/
routes.get('/', (req, res) => {
    res.status(200).json({message: "Events route alive!"})
  });

module.exports = routes
