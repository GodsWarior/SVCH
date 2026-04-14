const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название продукта не может быть пустым'],
    trim: true,
    maxlength: [100, 'Название не может превышать 100 символов']
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Цена обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  },
  category: {
    type: String,
    required: [true, 'Категория не может быть пустой'],
    trim: true,
    maxlength: [50, 'Категория не может превышать 50 символов']
  },
  in_stock: {
    type: Boolean,
    default: true
  },
  photo: {
    type: String,
    trim: true
  }
}, {
  timestamps: false,
  versionKey: false
});

module.exports = mongoose.model('Product', productSchema);
