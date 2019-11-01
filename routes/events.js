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
    ...
}
NOTE: {} are returned for seasons with no comparison sessions and values 
are rounded for simplicity. Delta is calculated as an absolute lap time delta.
*/
routes.post('/direct', async (req, res) => {
  const { target, competitor, year, session } = req.body;
  try {
    const driverA = await models.Driver.find({ name: target });
    const driverB = await models.Driver.find({ name: competitor });
    // initialize a session_comparisons object to hold the session deltas
    const sessionComparisons = {};
    // get required sessions
    driverASessions = driverA[0]['career'][year].filter(
      rec => rec['session'] == session,
    );
    if (driverASessions.length) {
      for (i = 0; i < driverASessions.length; i++) {
        let driverBSession = driverB[0]['career'][year].filter(rec => {
          if (
            rec['event'] == driverASessions[i]['event'] &&
            rec['session'] == driverASessions[i]['session']
          ) {
            return rec;
          }
        });
        if (
          driverBSession.length &&
          driverASessions[i]['fl'] &&
          driverASessions[i]['fl'] !== 'NULL' &&
          driverBSession[0]['fl'] !== 'NULL'
        ) {
          // add the delta to the sessionComparisons object
          sessionComparisons[driverASessions[i]['event']] =
            Math.round((driverASessions[i]['fl'] - driverBSession[0]['fl']) * 100) /
            100;
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

/*
[POST] - to /events/teammate
Request: {
    "target": "HAM",
    "year": "2017",
    "session": "Race"
}
Response: {
    "03_26Mel": 0,
    "04_09Sha": 0,
    "04_16Bah": -1,
    ...
}
NOTE: {} are returned for seasons with no comparison sessions and values 
are rounded for simplicity. Delta is calculated as an absolute lap time delta.
*/
routes.post('/teammate', async (req, res) => {
  const { target, year, session } = req.body;
  try {
    const targetDriver = await models.Driver.find({ name: target });
    // initialize a session_comparisons object to hold the session deltas
    const sessionComparisons = {};
    // get required sessions
    targetDriverSessions = targetDriver[0]['career'][year].filter(
      rec => rec['session'] == session,
    );
    // loop over each of the drivers sessions
    for (i = 0; i < targetDriverSessions.length; i++) {
      // check whether both driver and teammate have a valid time for the session
      if (
        targetDriverSessions[i]['fl'] &&
        targetDriverSessions[i]['teammate_fl'] &&
        targetDriverSessions[i]['fl'] !== 'NULL' &&
        targetDriverSessions[i]['teammate_fl'] !== 'NULL'
      ) {
        sessionComparisons[targetDriverSessions[i]['event']] =
          Math.round(
            (targetDriverSessions[i]['fl'] - targetDriverSessions[i]['teammate_fl']) *
              100,
          ) / 100;
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
