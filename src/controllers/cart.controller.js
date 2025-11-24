const { CartItem, Product } = require('../models');

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const priceAtAdd = product.price;
  let item = await CartItem.findOne({ where: { userId, productId } });
  if (item) {
    item.quantity += parseInt(quantity);
    await item.save();
  } else {
    item = await CartItem.create({ userId, productId, quantity, priceAtAdd });
  }
  return res.status(201).json(item);
};

const viewCart = async (req, res) => {
  const userId = req.user.id;
  const items = await CartItem.findAll({
    where: { userId },
    include: [{ model: Product, attributes: ['name', 'imageUrl', 'stock'] }]
  });
  const total = items.reduce((s, it) => s + it.quantity * it.priceAtAdd, 0);
  res.json({ items, total });
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const item = await CartItem.findOne({ where: { id: req.params.id, userId } });
  if (!item) return res.status(404).json({ message: 'Item not found' });
  await item.destroy();
  res.status(204).send();
};

module.exports = { addToCart, viewCart, removeFromCart };
