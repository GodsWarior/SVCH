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
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { couriersAPI } from '../../services/api';
import CourierForm from './CourierForm';

const CourierList = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingCourier, setEditingCourier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCouriers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await couriersAPI.getAll();
      setCouriers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при загрузке курьеров');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const handleEdit = (courier) => {
    setEditingCourier(courier);
    setOpenForm(true);
  };

  const handleDelete = (courier) => {
    setDeleteConfirm(courier);
  };

  const confirmDelete = async () => {
    try {
      await couriersAPI.delete(deleteConfirm._id || deleteConfirm.id);
      setCouriers(couriers.filter(c => (c._id || c.id) !== (deleteConfirm._id || deleteConfirm.id)));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при удалении курьера');
    }
  };

  const handleCreate = () => {
    setEditingCourier(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCourier(null);
    fetchCouriers();
  };

  const getVehicleTypeLabel = (type) => {
    const labels = {
      bicycle: 'Велосипед',
      motorcycle: 'Мотоцикл',
      car: 'Автомобиль',
      walking: 'Пешком'
    };
    return labels[type] || type;
  };

  const filteredCouriers = couriers.filter(courier =>
    courier.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && couriers.length === 0) {
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
          Курьеры
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Добавить курьера
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по ФИО или телефону..."
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
              <TableCell>Фамилия</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Транспорт</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCouriers.map((courier) => (
              <TableRow key={courier._id || courier.id}>
                <TableCell>{courier._id || courier.id}</TableCell>
                <TableCell>{courier.last_name}</TableCell>
                <TableCell>{courier.first_name}</TableCell>
                <TableCell>{courier.phone}</TableCell>
                <TableCell>{getVehicleTypeLabel(courier.vehicle_type)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(courier)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(courier)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredCouriers.length === 0 && !loading && (
        <Typography variant="body1" align="center" sx={{ mt: 3 }}>
          Курьеры не найдены
        </Typography>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCourier ? 'Редактировать курьера' : 'Добавить курьера'}
        </DialogTitle>
        <DialogContent>
          <CourierForm
            courier={editingCourier}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить курьера {deleteConfirm?.last_name} {deleteConfirm?.first_name}?
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

export default CourierList;
