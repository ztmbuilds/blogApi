
const { sequelize } = require('./models');
const {initializeRedisClient} = require('./middlewares/redis');
require('dotenv').config({ path: `${process.cwd()}/.env` });
const app = require('./app')

async function initializeExpressServer() {


  // connect to Redis
  await initializeRedisClient();


  app.listen(process.env.PORT || 3000,async () => {
    console.log('Server is running on port 5000');
    await sequelize.authenticate();
    console.log('Database Connected!');
  });
}

  initializeExpressServer()
  .then()
  .catch((e) => console.error(e));