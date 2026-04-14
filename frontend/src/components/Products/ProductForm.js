import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  DialogActions,
  FormControlLabel,
  Switch
} from '@mui/material';
import { productsAPI } from '../../services/api';

const ProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    in_stock: true
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        in_stock: product.in_stock !== undefined ? product.in_stock : true
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть больше 0';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Категория обязательна';
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
      const submitData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      if (product) {
        await productsAPI.update(product._id || product.id, submitData);
      } else {
        await productsAPI.create(submitData);
      }
      onClose();
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = field === 'in_stock' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
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
          label="Название *"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
        />

        <TextField
          label="Описание"
          value={formData.description}
          onChange={handleChange('description')}
          fullWidth
          multiline
          rows={3}
        />

        <TextField
          label="Цена *"
          type="number"
          value={formData.price}
          onChange={handleChange('price')}
          error={!!errors.price}
          helperText={errors.price}
          fullWidth
          inputProps={{ step: '0.01', min: '0' }}
        />

        <TextField
          label="Категория *"
          value={formData.category}
          onChange={handleChange('category')}
          error={!!errors.category}
          helperText={errors.category}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.in_stock}
              onChange={handleChange('in_stock')}
            />
          }
          label="В наличии"
        />
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {product ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default ProductForm;
