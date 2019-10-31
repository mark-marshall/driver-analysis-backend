const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
    event: {
        type: String
    },
    session: {
        type: String
    },
    team: {
        type: String
    },
    fl: {
        type: {}
    },
    teammate_fl: {
        type: {}
    }
  });
  
const schema = new mongoose.Schema({
    name: String,
    career: {
        2015: [seasonSchema],
        2016: [seasonSchema],
        2017: [seasonSchema],
        2018: [seasonSchema],
        2019: [seasonSchema]
    }
}, {collection: 'data'});

const Driver = mongoose.model('data', schema);

module.exports = Driver;
