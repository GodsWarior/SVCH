import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  DialogActions
} from '@mui/material';
import { customersAPI } from '../../services/api';

const CustomerForm = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        last_name: customer.last_name || '',
        first_name: customer.first_name || '',
        middle_name: customer.middle_name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || ''
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Адрес обязателен';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (customer) {
        await customersAPI.update(customer._id || customer.id, formData);
      } else {
        await customersAPI.create(formData);
      }
      onClose();
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {submitError && (
          <Alert severity="error">{submitError}</Alert>
        )}

        <TextField
          label="Фамилия *"
          value={formData.last_name}
          onChange={handleChange('last_name')}
          error={!!errors.last_name}
          helperText={errors.last_name}
          fullWidth
        />

        <TextField
          label="Имя *"
          value={formData.first_name}
          onChange={handleChange('first_name')}
          error={!!errors.first_name}
          helperText={errors.first_name}
          fullWidth
        />

        <TextField
          label="Отчество"
          value={formData.middle_name}
          onChange={handleChange('middle_name')}
          fullWidth
        />

        <TextField
          label="Телефон *"
          value={formData.phone}
          onChange={handleChange('phone')}
          error={!!errors.phone}
          helperText={errors.phone}
          fullWidth
        />

        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />

        <TextField
          label="Адрес *"
          value={formData.address}
          onChange={handleChange('address')}
          error={!!errors.address}
          helperText={errors.address}
          fullWidth
          multiline
          rows={2}
        />
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {customer ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CustomerForm;
