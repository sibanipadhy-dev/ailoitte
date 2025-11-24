const express = require('express');
const router = express.Router();
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const prodCtrl = require('../controllers/product.controller');
const authenticate = require('../middleware/auth.middleware');
const permit = require('../middleware/role.middleware');

router.get('/', prodCtrl.listProducts);
router.post('/', authenticate, permit(['admin']), upload.single('image'), prodCtrl.createProduct);
router.patch('/:id', authenticate, permit(['admin']), upload.single('image'), prodCtrl.updateProduct);
router.delete('/:id', authenticate, permit(['admin']), prodCtrl.deleteProduct);

module.exports = router;

