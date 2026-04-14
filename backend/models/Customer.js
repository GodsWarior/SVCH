const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email не может превышать 100 символов'],
    validate: {
      validator: function(v) {
        return !v || /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Email должен быть валидным'
    }
  },
  address: {
    type: String,
    required: [true, 'Адрес не может быть пустым'],
    trim: true,
    maxlength: [200, 'Адрес не может превышать 200 символов']
  },
  photo: {
    type: String,
    trim: true
  }
}, {
  timestamps: false,
  versionKey: false
});

module.exports = mongoose.model('Customer', customerSchema);
