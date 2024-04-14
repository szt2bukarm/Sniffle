const Breed = require('../models/breedModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory')


exports.getBreedNames = catchAsync(async (req,res,next) => {
    const doc = await Breed.find().select('name _id')
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
        doc
        }
    });
})

exports.createBreed = factory.createOne(Breed)
exports.getBreeds = factory.getAll(Breed)
exports.getOneBreed = factory.getOne(Breed)
exports.updateBreed = factory.updateOne(Breed)
exports.deleteBreed = factory.deleteOne(Breed)