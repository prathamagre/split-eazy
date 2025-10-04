const express = require('express');
const router = express.Router();
const {createListing, getAllListings, editListings, deleteListings} = require('../controllers/listingController');

router.post('/create', createListing);

router.get('/', getAllListings);

router.post('/edit/:id', editListings);

router.delete('/delete/:id', deleteListings);

module.exports = router;