const express = require('express');
const { models } = require('../model/index');

const routes = express.Router();

/*
[GET] - to /yearly
*/
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Yearly route alive!' });
});

/*
[POST] - to /yearly/direct
Request: {
    "target": "ROS",
	"competitor": "HAM"
}
Response: {
    "2015": -8,
    "2016": 37,
    "2017": 0,
    "2018": 0,
    "2019": 0
}
NOTE: 0s are returned for years with no comparison and values are rounded
for simplicity. Delta is calculated per session per event as an absolute
lap time delta.
*/
routes.post('/direct', async (req, res) => {
  const { target, competitor } = req.body;
  try {
    const driverA = await models.Driver.find({ name: target });
    const driverB = await models.Driver.find({ name: competitor });
    const years = {};
    for (let key in driverA[0].career) {
      if(!key.includes('20')){
          break
      }
      delta = 0;
      for (i = 0; i < driverA[0].career[key].length; i++) {
        let driverB_time = driverB[0].career[key];
        let driverA_time = driverA[0].career[key];
        if (
          driverB_time[i] &&
          driverB_time[i].fl &&
          driverB_time[i].fl !== 'NULL' &&
          driverA_time[i].fl !== 'NULL'
        ) {
          delta += Math.round(driverA_time[i].fl - driverB_time[i].fl);
        }
      }
      years[key] = delta;
    }
    if (driverA && driverB) {
      res.status(200).json(years);
    } else {
      res.status(400).json({ message: 'Plese input a valid driver for both the target and competitor' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = routes;
