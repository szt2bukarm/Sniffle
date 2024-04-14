const express = require('express');
const breedController = require('../controllers/breedController');
const authController = require("../controllers/authController")

const router = express.Router();

router.get('/names',breedController.getBreedNames)
router
    .route('/')
    .get(breedController.getBreeds)
    .post(authController.protect,authController.restrictTo('admin'),breedController.createBreed);

router
    .route('/:id')
    .get(breedController.getOneBreed)
    .patch(authController.protect,authController.restrictTo('admin'),breedController.updateBreed)
    .delete(authController.protect,authController.restrictTo('admin'),breedController.deleteBreed);

module.exports = router