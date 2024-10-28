const app = require('./server');
const sequelize = require('./api/v1/utils/database');

sequelize
  .sync()
  .then((result) => {
    console.log('Database connected');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => console.log(err));