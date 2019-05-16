const express = require('express');
const router = express.Router();

const User = require('../models/user');

const {
  isLoggedIn,
} = require('../helpers/middlewares');

router.get('/', (req, res, next) => {
  const _id  = req.session.currentUser._id;

  User.findById({ _id })
    .then((user) => {
      res.status(200);
      res.json(user);
    })
    .catch(next);
});

router.post('/update', isLoggedIn(), (req, res, next) => {
  const {
    username,
    email
  } = req.body;

  const currentUser = req.session.currentUser._id;
  req.session.currentUser.username = username;
  req.session.currentUser.email = email;

  User.findOneAndUpdate({ _id: currentUser }, { username, email }, { new: true })
    .then((user) => {
      console.log('user desde back!')
      res.status(200);
      res.json(user);
    })
    .catch(next)
});

module.exports = router;