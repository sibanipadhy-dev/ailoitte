const { Order, OrderItem, CartItem, Product, sequelize } = require('../models');

const placeOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const cartItems = await CartItem.findAll({ where: { userId } });
    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    const total = cartItems.reduce((s, ci) => s + ci.priceAtAdd * ci.quantity, 0);
    const order = await Order.create({ userId, total, status: 'completed' }, { transaction: t });

    for (const ci of cartItems) {
      const product = await Product.findByPk(ci.productId);
      if (!product) { await t.rollback(); return res.status(400).json({ message: 'Product missing' }); }
      if (product.stock < ci.quantity) { await t.rollback(); return res.status(400).json({ message: `Not enough stock for product ${product.name}` }); }
      await OrderItem.create({
        orderId: order.id,
        productId: ci.productId,
        quantity: ci.quantity,
        priceAtPurchase: ci.priceAtAdd
      }, { transaction: t });
      product.stock -= ci.quantity;
      await product.save({ transaction: t });
    }
    await CartItem.destroy({ where: { userId }, transaction: t });
    await t.commit();
    return res.status(201).json({ orderId: order.id, total });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ message: err.message });
  }
};

const orderHistory = async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.findAll({ where: { userId }, include: [{ model: OrderItem }] });
  res.json(orders);
};

module.exports = { placeOrder, orderHistory };
