const express = require('express');
const axios = require('axios');
// const createError = require('http-errors');

const router = express.Router();

const request = axios.create({
  baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine/',
  headers: {
    // 'Accept': 'application/json',
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.SPOON || 'getyourownapikeyatmashape'
  }
});

// Get recipes
router.get('/foodlist', (req, res) => {
  const { wine } = req.query;
  // Number=5 it is another parameter from the external API to list 5 wines.
  request.get(`dishes?wine=${wine}`)
    .then((wines) => {
      res.send(wines.data)
    })
    .catch(e => res.status(400).json({
      message: 'Request to Spoonacular failed/unauthorized'
    }));
});

module.exports = router;
