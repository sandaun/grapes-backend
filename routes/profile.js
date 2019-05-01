const express = require('express');
const router = express.Router();

const User = require('../models/user');

const {
  isLoggedIn,
} = require('../helpers/middlewares');

router.post('/update', isLoggedIn(), (req, res, next) => {
  const {
    username,
    email
  } = req.body;

  const currentUser = req.session.currentUser._id;

  User.findOneAndUpdate({ _id: currentUser }, { username, email }, { new: true })
    .then((user) => {
      res.status(200);
      res.json(user);
    })
    .catch(next)
});

module.exports = router;