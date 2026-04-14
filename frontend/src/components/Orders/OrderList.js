import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { ordersAPI } from '../../services/api';
import OrderForm from './OrderForm';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order) => {
    setEditingOrder(order);
    setOpenForm(true);
  };

  const handleDelete = (order) => {
    setDeleteConfirm(order);
  };

  const confirmDelete = async () => {
    try {
      await ordersAPI.delete(deleteConfirm._id || deleteConfirm.id);
      setOrders(orders.filter(o => (o._id || o.id) !== (deleteConfirm._id || deleteConfirm.id)));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при удалении заказа');
    }
  };

  const handleCreate = () => {
    setEditingOrder(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingOrder(null);
    fetchOrders();
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      preparing: 'Готовится',
      ready: 'Готов',
      delivering: 'Доставляется',
      delivered: 'Доставлен',
      cancelled: 'Отменен'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      confirmed: 'info',
      preparing: 'warning',
      ready: 'warning',
      delivering: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const filteredOrders = orders.filter(order =>
    order.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Заказы
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Добавить заказ
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по адресу или статусу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Клиент ID</TableCell>
              <TableCell>Курьер ID</TableCell>
              <TableCell>Продукты</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Адрес доставки</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => {
              const products = order.products || [];
              const productsCount = Array.isArray(products) ? products.length : 0;
              const productsNames = Array.isArray(products) 
                ? products.map(p => typeof p === 'object' ? p.name : p).slice(0, 2).join(', ') 
                : '';
              const moreProducts = productsCount > 2 ? ` и еще ${productsCount - 2}` : '';
              
              return (
                <TableRow key={order._id || order.id}>
                  <TableCell>{order._id || order.id}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>{order.courier_id || '-'}</TableCell>
                  <TableCell>
                    {productsCount > 0 ? (
                      <Box>
                        <Typography variant="body2">{productsNames}{moreProducts}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Всего: {productsCount}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Нет продуктов</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.delivery_address}</TableCell>
                  <TableCell>{parseFloat(order.total_amount || 0).toFixed(2)} ₽</TableCell>
                  <TableCell>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(order)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(order)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredOrders.length === 0 && !loading && (
        <Typography variant="body1" align="center" sx={{ mt: 3 }}>
          Заказы не найдены
        </Typography>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Редактировать заказ' : 'Добавить заказ'}
        </DialogTitle>
        <DialogContent>
          <OrderForm
            order={editingOrder}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить заказ №{deleteConfirm?._id || deleteConfirm?.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Отмена</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OrderList;
