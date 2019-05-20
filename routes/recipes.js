const express = require('express');
const axios = require('axios');
// const createError = require('http-errors');

const router = express.Router();

const getFullRecipeSelected= axios.create({
  baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/',
  headers: {
    // 'Accept': 'application/json',
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.SPOON || 'getyourownapikeyatmashape'
  }
});

router.get('/recipelist', async (req, res) => {
  const { query } = req.query;
  await getFullRecipeSelected.get(`search?query=${query}&number=5`)
    .then((recipe) => {
      console.log(recipe.data.baseUri)
      res.send(recipe.data)
    })
    .catch(e => res.status(400).json({
      message: 'Request to Spoonacular failed/unauthorized'
    }));
});

module.exports = router;
