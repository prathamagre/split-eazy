const express =  require('express');
const router = express.Router();
const{addRecord, getAllRecords, editRecord, deleteRecord, settlement} = require('../controllers/paymentController')

router.post('/add', addRecord);

router.post('/getAll', getAllRecords);

router.post('/edit/:id', editRecord);

router.post('/delete/:id', deleteRecord);

router.post('/settlement/:listingID', settlement);

module.exports = router;