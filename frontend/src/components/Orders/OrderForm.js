import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Typography
} from '@mui/material';
import { ordersAPI, customersAPI, couriersAPI, productsAPI } from '../../services/api';

const OrderForm = ({ order, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    courier_id: '',
    status: 'pending',
    delivery_address: '',
    products: [],
    total_amount: '0',
    created_at: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, couriersRes, productsRes] = await Promise.all([
          customersAPI.getAll(),
          couriersAPI.getAll(),
          productsAPI.getAll()
        ]);
        setCustomers(customersRes.data.data || []);
        setCouriers(couriersRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (err) {
        setSubmitError('Ошибка при загрузке данных');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (order) {
      const orderProducts = order.products || [];
      const productIds = orderProducts.map(p => typeof p === 'object' ? (p._id || p.id) : p);
      
      setFormData({
        customer_id: order.customer_id || (typeof order.customer_id === 'object' ? order.customer_id._id || order.customer_id.id : order.customer_id),
        courier_id: order.courier_id || (order.courier_id && typeof order.courier_id === 'object' ? order.courier_id._id || order.courier_id.id : order.courier_id),
        status: order.status || 'pending',
        delivery_address: order.delivery_address || '',
        products: productIds,
        total_amount: order.total_amount || '0',
        created_at: order.created_at ? order.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [order]);

  // Автоматический расчет суммы при изменении продуктов
  useEffect(() => {
    if (formData.products && formData.products.length > 0 && products.length > 0) {
      const selectedProducts = products.filter(p => 
        formData.products.includes(p._id || p.id)
      );
      const total = selectedProducts.reduce((sum, product) => {
        return sum + (parseFloat(product.price) || 0);
      }, 0);
      
      setFormData(prev => ({
        ...prev,
        total_amount: total.toFixed(2)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        total_amount: '0'
      }));
    }
  }, [formData.products, products]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_id) {
      newErrors.customer_id = 'Клиент обязателен';
    }
    
    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = 'Адрес доставки обязателен';
    }

    if (!formData.products || formData.products.length === 0) {
      newErrors.products = 'Выберите хотя бы один продукт';
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
        customer_id: formData.customer_id,
        courier_id: formData.courier_id || null,
        status: formData.status,
        delivery_address: formData.delivery_address,
        products: formData.products,
        total_amount: parseFloat(formData.total_amount),
        created_at: new Date(formData.created_at).toISOString()
      };
      
      if (order) {
        await ordersAPI.update(order._id || order.id, submitData);
      } else {
        await ordersAPI.create(submitData);
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

  const handleProductsChange = (event) => {
    const value = typeof event.target.value === 'string' 
      ? event.target.value.split(',') 
      : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      products: value
    }));
    if (errors.products) {
      setErrors(prev => ({ ...prev, products: '' }));
    }
  };

  const statusLabels = {
    pending: 'Ожидает',
    confirmed: 'Подтвержден',
    preparing: 'Готовится',
    ready: 'Готов',
    delivering: 'Доставляется',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  };

  const getSelectedProductsTotal = () => {
    if (!formData.products || formData.products.length === 0) return 0;
    const selectedProducts = products.filter(p => 
      formData.products.includes(p._id || p.id)
    );
    return selectedProducts.reduce((sum, product) => {
      return sum + (parseFloat(product.price) || 0);
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {submitError && (
          <Alert severity="error">{submitError}</Alert>
        )}

        <TextField
          select
          label="Клиент *"
          value={formData.customer_id}
          onChange={handleChange('customer_id')}
          error={!!errors.customer_id}
          helperText={errors.customer_id}
          fullWidth
        >
          {customers.map((customer) => (
            <MenuItem key={customer._id || customer.id} value={customer._id || customer.id}>
              {customer.last_name} {customer.first_name} {customer.middle_name || ''} - {customer.phone}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Курьер"
          value={formData.courier_id}
          onChange={handleChange('courier_id')}
          fullWidth
        >
          <MenuItem value="">Не назначен</MenuItem>
          {couriers.map((courier) => (
            <MenuItem key={courier._id || courier.id} value={courier._id || courier.id}>
              {courier.last_name} {courier.first_name} {courier.middle_name || ''} - {courier.phone}
            </MenuItem>
          ))}
        </TextField>

        <FormControl fullWidth error={!!errors.products}>
          <InputLabel>Продукты *</InputLabel>
          <Select
            multiple
            value={formData.products}
            onChange={handleProductsChange}
            input={<OutlinedInput label="Продукты" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const product = products.find(p => (p._id || p.id) === value);
                  return (
                    <Chip 
                      key={value} 
                      label={product ? `${product.name} (${product.price} ₽)` : value}
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
          >
            {products.map((product) => (
              <MenuItem key={product._id || product.id} value={product._id || product.id}>
                {product.name} - {product.price} ₽ {!product.in_stock && '(нет в наличии)'}
              </MenuItem>
            ))}
          </Select>
          {errors.products && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.products}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="Общая сумма *"
          type="number"
          value={formData.total_amount}
          disabled
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          helperText="Сумма рассчитывается автоматически на основе выбранных продуктов"
        />

        <TextField
          select
          label="Статус *"
          value={formData.status}
          onChange={handleChange('status')}
          fullWidth
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Адрес доставки *"
          value={formData.delivery_address}
          onChange={handleChange('delivery_address')}
          error={!!errors.delivery_address}
          helperText={errors.delivery_address}
          fullWidth
          multiline
          rows={2}
        />

        <TextField
          label="Дата создания"
          type="date"
          value={formData.created_at}
          onChange={handleChange('created_at')}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {order ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default OrderForm;
