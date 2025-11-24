const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/category.controller');
const authenticate = require('../middleware/auth.middleware');
const permit = require('../middleware/role.middleware');

router.get('/', catCtrl.listCategories);
router.post('/', authenticate, permit(['admin']), catCtrl.createCategory);
router.patch('/:id', authenticate, permit(['admin']), catCtrl.updateCategory);
router.delete('/:id', authenticate, permit(['admin']), catCtrl.deleteCategory);

module.exports = router;
