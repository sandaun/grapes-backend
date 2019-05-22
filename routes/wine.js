const express = require('express');
const axios = require('axios');
// const createError = require('http-errors');

const router = express.Router();

const getFoodByPairingWine = axios.create({
  baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine/',
  headers: {
    // 'Accept': 'application/json',
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.SPOON || 'getyourownapikeyatmashape'
  }
});

const getImageFromFoodPaired = axios.create({
  baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/menuItems/',
  headers: {
    // 'Accept': 'application/json',
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.SPOON || 'getyourownapikeyatmashape'
  }
});

const getEdamam = axios.create({
  baseURL: 'https://api.edamam.com/',
});


router.get('/foodlist', async (req, res) => {
  const { wine } = req.query;
  const  dataFoodToFront = {
    pairedFoodwithWine: [],
    foodUrlArray: [],
  }
  await getFoodByPairingWine.get(`dishes?wine=${wine}`)
    .then((food) => {
      dataFoodToFront.pairedFoodwithWine = food.data.pairings;
    })
    .catch(e => res.status(400).json({
      message: 'Request to Spoonacular failed/unauthorized'
    }));
   
  for (let food of dataFoodToFront.pairedFoodwithWine) {
    await getEdamam.get(`search?q=${food}&app_id=${process.env.EDAMAM_ID}&app_key=${process.env.EDAMAM_KEY}`)
      .then((menu) => {
        // Control if the menuItems array exists or not and give th default food image URL to frontend
        const {recipe: {image}} = menu.data.hits[0]
        dataFoodToFront.foodUrlArray.push(image)
      })
      .catch(e => res.status(401).json({
        message: 'Request to Edamam failed/unauthorized'
      }));
    }      

    // The next part is commented as it is the original API and to be used if the above fails.

    // for (let food of dataFoodToFront.pairedFoodwithWine) {
    //   await getImageFromFoodPaired.get(`search?number=10&query=${food}`)
    //     .then((menu) => {
    //       // Control if the menuItems array exists or not and give th default food image URL to frontend
    //       if (menu.data.menuItems.length == 0 || menu.data.menuItems === undefined) {
    //         const image = '/images/food/foodDefault.jpg'
    //         dataFoodToFront.foodUrlArray.push(image)          
    //       } else {
    //         const { image } = menu.data.menuItems[0];
    //         dataFoodToFront.foodUrlArray.push(image)
    //       }
    //     })
    //   }   
  res.send(dataFoodToFront);
});


router.get('/winelist', (req, res) => {
  const { food } = req.query;
  getFoodByPairingWine.get(`pairing?food=${food}`)
    .then((wine) => {
      res.send(wine.data)
    })
    .catch(e => res.status(400).json({
      message: 'Request to Spoonacular failed/unauthorized'
    }));
});

module.exports = router;
