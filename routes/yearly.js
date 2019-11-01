const express = require('express');
const { models } = require('../model/index');

const routes = express.Router();

/*
[GET] - to /yearly
Reponse: {
    "message": 'Yearly route alive!' 
}
*/
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Yearly route alive!' });
});

/*
[POST] - to /yearly/direct
Request: {
    "target": "HAM",
	"competitor": "ROS"
}
{
    "2015": 8,
    "2016": 18,
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
    // initialize a years object to hold annual deltas
    const years = {};
    // loop over the year keys in the retrieved document for driver
    for (let key in driverA[0]['career']) {
      if (!key.includes('20')) {
        continue;
      }
      // initialize the delta for the year
      delta = 0;
      // loop over every session for the year
      for (i = 0; i < driverA[0]['career'][key].length; i++) {
        let driverA_time = driverA[0]['career'][key];
        // find the event/session for the competitor
        let session = driverB[0]['career'][key].filter(rec => {
          if (
            rec['event'] == driverA[0]['career'][key][i]['event'] &&
            rec['session'] == driverA[0]['career'][key][i]['session']
          ) {
            return rec;
          }
        });
        // check whether both driver and competitor have a valid time for the session
        if (
          session.length &&
          session[0]['fl'] &&
          session[0]['fl'] !== 'NULL' &&
          driverA_time[i]['fl'] !== 'NULL'
        ) {
          // increment the yearly delta
          delta += Math.round(driverA_time[i]['fl'] - session[0]['fl']);
        }
      }
      // save the delta to the key for that year
      years[key] = delta;
    }
    // return the result
    res.status(200).json(years);
  } catch (error) {
    res.status(500).json({
      message:
        'Plese input a valid driver for both the target and competitor keys',
    });
  }
});

/*
[POST] - to /yearly/teammate
Request: {
    "target": "HAM",
}
Response: {
    "2015": 8,
    "2016": 18,
    "2017": -29,
    "2018": -20,
    "2019": -47
}
NOTE: 0s are returned for years with no comparison and values are rounded
for simplicity. Delta is calculated per session per event as an absolute
lap time delta.
*/
routes.post('/teammate', async (req, res) => {
  const { target } = req.body;
  try {
    const targetDriver = await models.Driver.find({ name: target });
    // initialize a years object to hold annual deltas
    const years = {};
    // loop over the year keys in the retrieved document for driver
    for (let key in targetDriver[0]['career']) {
      if (!key.includes('20')) {
        continue;
      }
      // initialize the delta for the year
      delta = 0;
      // loop over every session for the year
      for (i = 0; i < targetDriver[0]['career'][key].length; i++) {
        let time = targetDriver[0]['career'][key];
        // check whether both driver and teammate have a valid time for the session
        if (
          time[i] &&
          time[i]['fl'] &&
          time[i]['teammate_fl'] &&
          time[i]['fl'] !== 'NULL' &&
          time[i]['teammate_fl'] !== 'NULL'
        ) {
          // increment the yearly delta
          delta += Math.round(time[i]['fl'] - time[i]['teammate_fl']);
        }
      }
      // save the delta to the key for that year
      years[key] = delta;
    }
    // return the result
    res.status(200).json(years);
  } catch (error) {
    res.status(500).json({
      message: 'Plese input a valid driver for the target key',
    });
  }
});

module.exports = routes;
