import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  DialogActions,
  MenuItem
} from '@mui/material';
import { couriersAPI } from '../../services/api';

const CourierForm = ({ courier, onClose }) => {
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    phone: '',
    vehicle_type: 'bicycle'
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courier) {
      setFormData({
        last_name: courier.last_name || '',
        first_name: courier.first_name || '',
        middle_name: courier.middle_name || '',
        phone: courier.phone || '',
        vehicle_type: courier.vehicle_type || 'bicycle'
      });
    }
  }, [courier]);

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
      if (courier) {
        await couriersAPI.update(courier._id || courier.id, formData);
      } else {
        await couriersAPI.create(formData);
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
          select
          label="Тип транспорта *"
          value={formData.vehicle_type}
          onChange={handleChange('vehicle_type')}
          fullWidth
        >
          <MenuItem value="bicycle">Велосипед</MenuItem>
          <MenuItem value="motorcycle">Мотоцикл</MenuItem>
          <MenuItem value="car">Автомобиль</MenuItem>
          <MenuItem value="walking">Пешком</MenuItem>
        </TextField>
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {courier ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default CourierForm;
