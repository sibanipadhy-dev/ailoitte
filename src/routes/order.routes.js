const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/', authenticate, orderCtrl.placeOrder);
router.get('/', authenticate, orderCtrl.orderHistory);

module.exports = router;
