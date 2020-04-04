const express = require('express');
const axios = require('axios');

const router = express.Router();

const User = require('../models/user');

const { isLoggedIn } = require('../helpers/middlewares');

const getFullRecipeSelected = axios.create({
  baseURL: 'https://api.spoonacular.com/recipes/',
  // headers: {
  //   // 'Accept': 'application/json',
  //   'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
  //   'X-RapidAPI-Key': process.env.SPOON || 'getyourownapikeyatmashape',
  // },
});

router.get('/recipelist', async (req, res) => {
  const { query } = req.query;
  await getFullRecipeSelected
    .get(`search?apiKey=${process.env.SPOON}&query=${query}`)
    .then(recipe => {
      res.send(recipe.data);
    })
    .catch(e =>
      res.status(400).json({
        message: 'Request to Spoonacular failed/unauthorized',
      }),
    );
});

// GET RECIPE BY ID - TO BE IMPLEMENTED V2
router.get('/recipelist/favorites', async (req, res) => {
  const { query } = req.query;

  await getFullRecipeSelected
    .get(`${query}/information`)
    .then(recipe => {
      res.send(recipe.data);
    })
    .catch(e =>
      res.status(400).json({
        message: 'Request to Spoonacular failed/unauthorized',
      }),
    );
});

// GET FAVORITE RECIPES BY USER
router.get('/favorite', isLoggedIn(), (req, res, next) => {
  const userID = req.session.currentUser._id;
  User.findById(userID)
    .then(favoriteList => {
      req.session.currentUser.favoriteRecipes = favoriteList.favoriteRecipes;
      res.status(200);
      res.json(favoriteList.favoriteRecipes);
    })
    .catch(err => {
      res.json(err);
    });
});

// ADD FAVORITE
router.put('/favorite/:id', isLoggedIn(), (req, res, next) => {
  const userID = req.session.currentUser._id;
  const { id } = req.params;
  User.findByIdAndUpdate(
    userID,
    { $push: { favoriteRecipes: id } },
    { new: true },
  )
    .then(recipesArray => {
      res.json(recipesArray.favoriteRecipes);
    })
    .catch(err => {
      res.json(err);
    });
});

//DELETE FAVORITE
router.post('/favorite/delete/:id', isLoggedIn(), async (req, res, next) => {
  try {
    const userID = req.session.currentUser;
    const { id } = req.params;
    let deleteFavorite = await User.findByIdAndUpdate(userID, {
      $pull: { favoriteRecipes: id },
      new: true,
    });
    res.json(deleteFavorite);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
