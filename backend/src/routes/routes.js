const express = require('express');

const {handlePayment,verifyPayment}=require('../controllers/paymentController')
const router = express.Router();

// Route to handle payments
router.post('/handle-payment', handlePayment);

// Route to verify payments
router.post('/verify-payment', verifyPayment);
module.exports = router;
