const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/', authenticate, cartCtrl.addToCart);
router.get('/', authenticate, cartCtrl.viewCart);
router.delete('/:id', authenticate, cartCtrl.removeFromCart);

module.exports = router;
