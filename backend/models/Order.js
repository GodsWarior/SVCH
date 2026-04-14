const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'ID клиента обязателен']
  },
  courier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courier',
    default: null
  },
  status: {
    type: String,
    required: [true, 'Статус не может быть пустым'],
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
      message: 'Недопустимый статус'
    },
    default: 'pending'
  },
  delivery_address: {
    type: String,
    required: [true, 'Адрес доставки не может быть пустым'],
    trim: true,
    maxlength: [200, 'Адрес доставки не может превышать 200 символов']
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  total_amount: {
    type: Number,
    required: [true, 'Общая сумма обязательна'],
    min: [0, 'Общая сумма не может быть отрицательной']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  delivered_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: false,
  versionKey: false
});

module.exports = mongoose.model('Order', orderSchema);
