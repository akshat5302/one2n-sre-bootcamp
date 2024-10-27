const express = require('express');
const bodyparser = require('body-parser');
const sequelize = require('./api/v1/utils/database');
const Student = require('./api/v1/models/student');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// test route
app.get('/', (req, res, next) => {
  res.send('Hello World using Gitops');
});

// Health route

app.use('/api/v1/health', require('./api/v1/routes/healthroute'));

// CRUD routes
app.use('/api/v1/students', require('./api/v1/routes/studentsroute'));

// error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message } = error;
  res.status(status).json({ message });
});

// sync database
sequelize
  .sync()
  .then((result) => {
    console.log('Database connected');
    app.listen(3000);
  })
  .catch((err) => console.log(err));
