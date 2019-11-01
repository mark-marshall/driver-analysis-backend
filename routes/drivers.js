const express = require('express');
const { models } = require('../model/index');

const routes = express.Router();

/*
[GET] - to /drivers
Reponse: {
    "message": 'Drivers route alive!' 
}
*/
routes.get('/', async (req, res) => {
  models.Driver.distinct('name', function(err, drivers) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(drivers);
    }
  });
});

module.exports = routes;
