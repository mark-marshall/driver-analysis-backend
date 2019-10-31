const express = require('express');
const { models } = require('../model/index');

const routes = express.Router();

/*
[GET] - to /events
Reponse: {
    "message": 'Events route alive!' 
}
*/
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Events route alive!' });
});

/*
[POST] - to /events/direct
Request: {
    "target": "HAM",
    "competitor": "ROS",
    "year": "2015",
    "session": "Race"
}
Response: {
    "03_15Mel": 0,
    "03_29Sep": 1,
    "04_12Sha": 0,
    "04_19Bah": 1,
    "05_10Bcn": -1,
    "05_24Mco": 0,
    "06_07Mtl": 0,
    "06_21A1r": 0,
    "07_05Sil": 0,
    "07_26Bud": 1,
    "08_23Spa": 0,
    "09_06Mza": 0,
    "09_20Sgp": 2,
    "09_27Suz": -1,
    "10_11Soc": -3,
    "10_25Aus": 0,
    "11_01Mex": 0,
    "11_15Int": 0,
    "11_29Abu": -1
}
NOTE: {} are returned for seasons with no comparison sessions and values 
are rounded for simplicity. Delta is calculated as an absolute lap time delta.
*/
routes.post('/direct', async (req, res) => {
  const { target, competitor, year, session } = req.body;
  try {
    const driverA = await models.Driver.find({ name: target });
    const driverB = await models.Driver.find({ name: competitor });
    // initialize a session_comparisons object to hold the seasons deltas
    const sessionComparisons = {};
    // get required sessions
    driverASessions = driverA[0].career[year].filter(
      rec => rec['session'] == session,
    );
    if (driverASessions.length) {
      for (i = 0; i < driverASessions.length; i++) {
        let driverBSession = driverB[0].career[year].filter(rec => {
          if (
            rec.event == driverASessions[i].event &&
            rec.session == driverASessions[i].session
          ) {
            return rec;
          }
        });
        if (
          driverBSession.length &&
          driverASessions[i].fl &&
          driverASessions[i].fl !== 'NULL' &&
          driverBSession[0].fl !== 'NULL'
        ) {
          // add the delta to the sessionComparisons object
          sessionComparisons[driverASessions[i].event] = Math.round(
            driverASessions[i].fl - driverBSession[0].fl,
          );
        }
      }
    }
    // return the result
    res.status(200).json(sessionComparisons);
  } catch (error) {
    res.status(500).json({
      message:
        'Plese input a valid driver for both the target and competitor keys, and valid year and session-type',
    });
  }
});

module.exports = routes;
