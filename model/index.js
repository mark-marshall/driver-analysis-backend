require('dotenv').config();
const mongoose = require('mongoose');
const Driver = require('./driverModel');

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,  useUnifiedTopology: true });
};

const models = { Driver };

module.exports = {
  connectDb,
  models,
};
  