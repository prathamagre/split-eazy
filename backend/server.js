const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require ('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/listing', require('./routes/listing'));

app.use('/payment', require('./routes/payment'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running on PORT ${PORT}`));