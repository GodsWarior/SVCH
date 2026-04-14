const mongoose = require('mongoose');

const courierSchema = new mongoose.Schema({
  last_name: {
    type: String,
    required: [true, 'Фамилия не может быть пустой'],
    trim: true,
    maxlength: [50, 'Фамилия не может превышать 50 символов']
  },
  first_name: {
    type: String,
    required: [true, 'Имя не может быть пустым'],
    trim: true,
    maxlength: [50, 'Имя не может превышать 50 символов']
  },
  middle_name: {
    type: String,
    trim: true,
    maxlength: [50, 'Отчество не может превышать 50 символов']
  },
  phone: {
    type: String,
    required: [true, 'Телефон не может быть пустым'],
    trim: true,
    maxlength: [20, 'Телефон не может превышать 20 символов']
  },
  vehicle_type: {
    type: String,
    required: [true, 'Тип транспорта не может быть пустым'],
    enum: {
      values: ['bicycle', 'motorcycle', 'car', 'walking'],
      message: 'Недопустимый тип транспорта'
    }
  },
  photo: {
    type: String,
    trim: true
  }
}, {
  timestamps: false,
  versionKey: false
});

module.exports = mongoose.model('Courier', courierSchema);
