const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
    },
    gender:{
        type: String,
        enum: ['male', 'female'],
    },
    birthday: {
        type: Date,
        default: null
    },
    description: {
        type: String
    },
    breed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Breed',
    },
    images: [String],
    exactLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
    },
    approximateLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      country: String,
      place: {
        type: String,
        default: null
      },
    },
    tags: [String],
    isApproved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


listingSchema.pre('findOne', function(next) {
    this.populate({
      path: 'user',
      select: '-__v'
    });
    this.populate({
      path: 'breed',
      select: '-__v'
    });
    next();
  });

listingSchema.pre('find', function(next) {
    this.populate({
      path: 'user',
      select: 'name'
    });
    this.populate({
      path: 'breed',
      select: 'name'
    });
    next();
  });
  
  const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing