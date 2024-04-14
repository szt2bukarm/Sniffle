const mongoose = require('mongoose');

const breedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this breed'],
    },
    description: {
        type: String,
    },
    images: [String],
    minWeight: {
        type: Number,
    },
    maxWeight: {
        type: Number,
    },
    minHeight: {
        type: Number,
    },
    maxHeigth: {
        type: Number,
    },
    minLifespan: {
        type: Number,
    },
    maxLifespan: {
        type: Number,
    },
    shedding: {
        type: Number,
    },
    openness: {
        type: Number,
    },
    playfulness: {
        type: Number,
    },
    trainability: {
        type: Number,
    },
    barking: {
        type: Number,
    },
});

const Breed = mongoose.model('Breed', breedSchema);
module.exports = Breed;
