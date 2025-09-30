const express = require('express');
const router = express.Router();
const { addRecord, getAllRecords, editRecord, deleteRecord, settlement } = require('../controllers/paymentController');

// Add a payment record
router.post('/addRecord', addRecord);

// Get all payment records for a listing
router.post('/getAllRecords', getAllRecords);

// Edit a payment record
router.post('/editRecord/:id', editRecord);

// Delete a payment record (we take paymentID from body and map to req.params)
router.post('/deleteRecord', (req, res) => {
    req.params.id = req.body.paymentID;
    deleteRecord(req, res);
});

// Settlement calculation (we take listingID from body and map to req.params)
router.post('/settlement', (req, res) => {
    req.params.listingID = req.body.listingID;
    settlement(req, res);
});

module.exports = router;
