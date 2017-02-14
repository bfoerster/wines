const mongoose = require("mongoose");
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
        enum: ['red', 'white', 'rose']
    },
    description: String
});

mongoose.model('Wine', wineSchema);