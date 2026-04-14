const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'ID заказа обязателен']
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'ID продукта обязателен']
  },
  quantity: {
    type: Number,
    required: [true, 'Количество обязательно'],
    min: [1, 'Количество должно быть больше 0']
  },
  price_at_order: {
    type: Number,
    required: [true, 'Цена на момент заказа обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  }
}, {
  timestamps: false,
  versionKey: false
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
