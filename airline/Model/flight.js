const mongoose = require('mongoose')

const flightSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    date: { type: String, required: true },
    file: { type: String, required: true },
    price: { type: Number, required: true },
});

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight
