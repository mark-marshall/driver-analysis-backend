const yearly = require('./yearly')
const events = require('./events')
const drivers = require('./drivers')

module.exports = server => {
  server.get('/', (req, res) => {
    res.status(200).json({ message: 'Alive!' });
  });

  server.use('/yearly',yearly)
  server.use('/events',events)
  server.use('/drivers',drivers)
};
