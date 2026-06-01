const { Address, Order, OrderItem, Payment, Product } = require('../models');

const getOrders = async (req, res, next) => {
  try {
    const isAdmin = req.user.Role?.name === 'admin';
    const where = isAdmin ? {} : { UserId: req.user.id };
    const orders = await Order.findAll({
      where,
      include: [Address, Payment, { model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  const transaction = await Order.sequelize.transaction();
  try {
    const { address, items, deliverySlot, paymentMethod = 'card' } = req.body;
    const savedAddress = await Address.create({ ...address, UserId: req.user.id }, { transaction });

    const products = await Product.findAll({ where: { id: items.map((item) => item.productId) }, transaction });
    const productMap = new Map(products.map((product) => [product.id, product]));
    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const order = await Order.create({
      UserId: req.user.id,
      AddressId: savedAddress.id,
      total,
      deliverySlot,
    }, { transaction });

    for (const item of items) {
      const product = productMap.get(item.productId);
      await OrderItem.create({
        OrderId: order.id,
        ProductId: product.id,
        quantity: item.quantity,
        price: product.price,
      }, { transaction });
      await product.update({ stock: Math.max(product.stock - item.quantity, 0) }, { transaction });
    }

    await Payment.create({ OrderId: order.id, method: paymentMethod, amount: total }, { transaction });
    await transaction.commit();

    const created = await Order.findByPk(order.id, { include: [Address, Payment, { model: OrderItem, include: [Product] }] });
    return res.status(201).json(created);
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.update({ status: req.body.status });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
