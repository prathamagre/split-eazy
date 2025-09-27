const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    listingID: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the listing
        ref: 'Listing',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidBy: {
        type: String,
        required: true
    },
    paidFor: {
        type: [String], // Array of participant names
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    dateOfPayment: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
