const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

const auth = require('./routes/auth');
const wine = require('./routes/wine');
const profile = require('./routes/profile');
const recipes = require('./routes/recipes');

// mongoose
//   .connect(process.env.MONGODB_URI, {
//     keepAlive: true,
//     useNewUrlParser: true,
//     reconnectTries: Number.MAX_VALUE,
//   })
//   .then((connection) => {
//     console.log(`Connected to Mongo! Database name: "${connection.connections[0].name}"`);
//     // console.log(connection)
//   })
//   .catch(error => {
//     console.error(error);
//   });

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [process.env.PUBLIC_DOMAIN],
  }),
);
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(
  session({
    store: MongoStore.create({
      // mongooseConnection: mongoose.connection,
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // 1 day
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', auth);
app.use('/wine', wine);
app.use('/profile', profile);
app.use('/recipes', recipes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ code: 'not found' });
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    const statusError = err.status || '500';
    res.status(statusError).json(err);
  }
});

module.exports = app;
