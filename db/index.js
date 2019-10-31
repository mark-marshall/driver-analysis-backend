require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  };

  module.exports = connectDb
  