const Listing = require('../models/listingModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs');
const path = require('path');

exports.postListing = catchAsync(async (req,res,next) => {
    const doc = await Listing.create({
        user: req.user.id,
    })

    req.doc = doc

    next()
})

const multerStorage = multer.memoryStorage()

const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadListingImages = upload.array('images', 5)

exports.resizeListingImages = catchAsync(async(req,res,next) => {
    if (!req.files) return next();

    const directory = path.join('public', 'img', 'listings', req.doc.id.toString());
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    req.doc.images = [];
    await Promise.all(req.files.map(async (file, index) => {
        const filename = `listing-${req.doc.id}-${index}.jpeg`;
        const metadata = await sharp(file.buffer).metadata();
        await sharp(file.buffer)
            .rotate(metadata.orientation && metadata.orientation !== 1 ? 90 : 0)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(directory, filename));

        req.doc.images.push(filename);
    }));

    next();
})

exports.finishListing = catchAsync(async (req,res,next) => {
    const updatedData = {
        ...req.doc.toObject(), 
        ...req.body
    };
    const listing = await Listing.findOneAndUpdate({_id: req.doc.id}, updatedData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            doc: listing
        }
    })
})

exports.getListingsByBreed = catchAsync(async (req,res,next) => {
    const doc = await Listing.find({breed: req.params.id}).limit(5);
    
    res.status(200).json({
        status: 'success',
        data: {
        doc
        }
    });
})

exports.getRandomListings = catchAsync(async (req,res,next) => {
    const doc = await Listing.aggregate([
        { $sample: { size: 5 } },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            },
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'breeds',
                localField: 'breed',
                foreignField: '_id',
                as: 'breed',
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: '$breed'
        }
    ])
    
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
        doc
        }
    });
})

exports.getAllListings = factory.getAll(Listing)
exports.getListing = factory.getOne(Listing)
exports.updateListing = factory.updateOne(Listing)
exports.deleteListing = factory.deleteOne(Listing)