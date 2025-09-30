const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    participants: { type: [String], required: true },
    dateOfCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
