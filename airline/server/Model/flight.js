const mongoose = require('mongoose')

const flightSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    date: { type: String, required: true },
    file: { type: String, required: false },   // to delete
    price: { type: Number, required: true },
});

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight