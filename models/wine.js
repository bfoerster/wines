const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['red', 'white', 'rose']
    },
    description: String
});

module.exports = mongoose.model('Wine', wineSchema);