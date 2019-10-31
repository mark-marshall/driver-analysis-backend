require('dotenv').config();
const server = require('./api/server');
const connectDb = require('./db/index');

const port = process.env.PORT || 5000;

connectDb()
  .then(async () => {
    try {
      server.listen(port, () =>
        console.log(`===== Server running on port ${port} =====`),
      );
    } catch (error) {
      console.error(error);
    }
  })
  .catch(error => console.error(error));
