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
router.get('/winelist', (req, res) => {
  const { wine } = req.query;
  // console.log(req._parsedUrl.search);
  request.get(`recommendation?wine=${wine}`)
    .then((wines) => {
      res.send(wines.data)
    })
    .catch(e => res.status(400).json({
      message: 'Request to Spoonacular failed/unauthorized'
    }));
});

// router.get('/findByIngredients', (req, res) => {
//   request.get(`findByIngredients?fillIngredients=false&ingredients=${req.query.ingredients}&limitLicense=true&number=25&ranking=2`)
//     .then(recipes => res.send(recipes.data))
//     .catch(e => res.status(400).json({
//       message: 'Request to Spoonacular failed/unauthorized'
//     }));
// });

// router.get('/:id', (req, res) => {
//   request.get(`${req.params.id}/information?includeNutrition=true`)
//     .then(recipe => res.send(recipe.data))
//     .catch(e => res.status(400).json({
//       message: 'Request to Spoonacular failed/unauthorized'
//     }));
// });

module.exports = router;
