const express = require('express');
const listingController = require('../controllers/listingController');
const authController = require('../controllers/authController')
const multer = require('multer');


const router = express.Router();

router.get('/byBreedId/:id',listingController.getListingsByBreed)

router
    .route('/')
    .get(listingController.getAllListings)
    .post(authController.protect,authController.restrictTo('user'),listingController.postListing,listingController.uploadListingImages,listingController.resizeListingImages,listingController.finishListing);

router
    .route('/:id')
    .get(listingController.getListing)
    .patch(listingController.updateListing)
    .delete(listingController.deleteListing);

module.exports = router