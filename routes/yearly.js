const express = require('express');

const routes = express.Router();

/*
[GET] - to /yearly
*/
routes.get('/', (req, res) => {
    res.status(200).json({message: "Yearly route alive!"})
  });

module.exports = routes
