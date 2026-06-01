import {
  BarChart,
  Delete,
  Edit,
  Inventory,
  LocalShipping,
  Logout,
  SettingsBackupRestore,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CatalogFilters } from '../../components/CatalogFilters';
import { HomeHero } from '../../components/HomeHero';
import { HomeInfoSections } from '../../components/HomeInfoSections';
import { ProductCard } from '../../components/ProductCard';
import { ProductImageUploader } from '../../components/ProductImageUploader';
import { ReportDownloadCard } from '../../components/ReportDownloadCard';
import { SettingsControls } from '../../components/SettingsControls';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { authApi, categoryApi, favoriteApi, orderApi, productApi, reportApi, userApi } from '../../services';
import { authActions, cartActions, catalogActions, settingsActions } from '../../store';
import { Category, Order, Product, User } from '../../types';
import { formatDeliverySlot, getDefaultDeliveryTimes, toDateInputValue } from '../../utils/delivery';
import { useT } from '../../utils/i18n';
import {
  defaultProductImage,
  getCategoryName,
  getFallbackProductDescriptionEn,
  getFallbackProductNameEn,
  getProductDescription,
  getProductName,
  price,
} from '../../utils/productPresentation';
import { clearAppStorage } from '../../utils/storage';
import {
  safeTextRegex,
  validateAddress,
  validateAuth,
  validateProductForm,
  validateUserForm,
  ValidationErrors,
} from '../../utils/validation';

export function AdminProductsPage() {
  const t = useT();
  const language = useAppSelector((state) => state.settings.language);
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    nameEn: '',
    price: '',
    stock: '0',
    CategoryId: '',
    weight: '',
    description: '',
    descriptionEn: '',
    imageUrl: '',
  });
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [imageUploading, setImageUploading] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', role: 'customer' });
  const [userFormErrors, setUserFormErrors] = useState<ValidationErrors>({});

  const load = () => {
    productApi.getAll({ search: '', categoryId: '', minPrice: '', maxPrice: '', sort: 'name' }).then(setProducts);
    categoryApi.getAll().then(setCategories);
    orderApi.getAll().then(setOrders);
    userApi.getAll().then(setUsers);
  };

  useEffect(load, []);

  const resetProductForm = () => {
    setEditingProductId(null);
    setForm({
      name: '',
      nameEn: '',
      price: '',
      stock: '0',
      CategoryId: '',
      weight: '',
      description: '',
      descriptionEn: '',
      imageUrl: '',
    });
    setFormErrors({});
  };

  const openCreateProductDialog = () => {
    resetProductForm();
    setDialogOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      nameEn: product.nameEn || getFallbackProductNameEn(product.name),
      price: String(product.price),
      stock: String(product.stock),
      CategoryId: String(product.CategoryId),
      weight: product.weight || '',
      description: product.description || '',
      descriptionEn: product.descriptionEn || getFallbackProductDescriptionEn(product.name),
      imageUrl: product.imageUrl || '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const saveProduct = async () => {
    const nextErrors = validateProductForm(form);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      CategoryId: Number(form.CategoryId),
      imageUrl: form.imageUrl || defaultProductImage,
    };

    if (editingProductId) {
      await productApi.update(editingProductId, payload);
    } else {
      await productApi.create(payload);
    }
    setDialogOpen(false);
    resetProductForm();
    load();
  };

  const handleProductImageChange = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors({ ...formErrors, imageUrl: 'Выберите файл изображения' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormErrors({ ...formErrors, imageUrl: 'Размер картинки должен быть до 2 МБ' });
      return;
    }

    try {
      setImageUploading(true);
      const { imageUrl } = await productApi.uploadImage(file);
      setForm((current) => ({ ...current, imageUrl }));
      setFormErrors((current) => ({ ...current, imageUrl: '' }));
    } catch {
      setFormErrors((current) => ({ ...current, imageUrl: 'Не удалось загрузить картинку на сервер' }));
    } finally {
      setImageUploading(false);
    }
  };

  const openEditUserDialog = (user: User) => {
    setEditingUserId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    });
    setUserFormErrors({});
    setUserDialogOpen(true);
  };

  const saveUser = async () => {
    const nextErrors = validateUserForm(userForm);
    setUserFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !editingUserId) {
      return;
    }

    await userApi.update(editingUserId, {
      name: userForm.name.trim(),
      email: userForm.email.trim(),
      phone: userForm.phone.trim(),
      role: userForm.role,
    });
    setUserDialogOpen(false);
    setEditingUserId(null);
    setUserFormErrors({});
    load();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>Админ-панель</Typography>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="Товары" />
        <Tab label="Заказы" />
        <Tab label="Пользователи" />
      </Tabs>
      {tab === 0 && (
        <Paper sx={{ p: 2 }}>
          <Button
            startIcon={<Inventory />}
            variant="contained"
            onClick={openCreateProductDialog}
          >
            Добавить товар
          </Button>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            {products.map((product) => (
              <Stack key={product.id} direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                <Typography sx={{ flexGrow: 1, overflowWrap: 'anywhere' }}>{getProductName(product, language)}</Typography>
                <Chip label={getCategoryName(product.Category, language) || 'Без категории'} />
                <Typography>{price(product.price)}</Typography>
                <Typography>Остаток: {product.stock}</Typography>
                <IconButton aria-label="Редактировать товар" onClick={() => openEditProductDialog(product)}><Edit /></IconButton>
                <IconButton onClick={() => productApi.remove(product.id).then(load)}><Delete /></IconButton>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
      {tab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            {orders.map((order) => (
              <Stack key={order.id} direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Typography sx={{ flexGrow: 1 }}>Заказ #{order.id} · {price(order.total)}</Typography>
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Статус</InputLabel>
                  <Select label="Статус" value={order.status} onChange={(event) => orderApi.updateStatus(order.id, event.target.value).then(load)}>
                    {['new', 'confirmed', 'packing', 'delivering', 'completed', 'cancelled'].map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
      {tab === 2 && (
        <Paper sx={{ p: 2 }}>
          {users.map((item) => (
            <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" sx={{ py: 1 }}>
              <Typography sx={{ overflowWrap: 'anywhere' }}>{item.name} · {item.email}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={item.role} />
                {item.role !== 'admin' && (
                  <IconButton aria-label="Редактировать пользователя" onClick={() => openEditUserDialog(item)}><Edit /></IconButton>
                )}
              </Stack>
            </Stack>
          ))}
        </Paper>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editingProductId ? 'Редактирование товара' : 'Новый товар'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
            />
            <TextField
              label={t.productNameEn}
              value={form.nameEn}
              onChange={(event) => setForm({ ...form, nameEn: event.target.value })}
              error={Boolean(formErrors.nameEn)}
              helperText={formErrors.nameEn || 'Example: Fresh Tomatoes'}
            />
            <TextField
              label="Описание"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              error={Boolean(formErrors.description)}
              helperText={formErrors.description}
              multiline
              minRows={2}
            />
            <TextField
              label={t.productDescriptionEn}
              value={form.descriptionEn}
              onChange={(event) => setForm({ ...form, descriptionEn: event.target.value })}
              error={Boolean(formErrors.descriptionEn)}
              helperText={formErrors.descriptionEn}
              multiline
              minRows={2}
            />
            <TextField
              label="Цена"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value.replace(',', '.') })}
              error={Boolean(formErrors.price)}
              helperText={formErrors.price}
              inputProps={{ inputMode: 'decimal' }}
            />
            <TextField
              label="Остаток"
              value={form.stock}
              onChange={(event) => setForm({ ...form, stock: event.target.value })}
              error={Boolean(formErrors.stock)}
              helperText={formErrors.stock}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Вес"
              value={form.weight}
              onChange={(event) => setForm({ ...form, weight: event.target.value })}
              error={Boolean(formErrors.weight)}
              helperText={formErrors.weight || 'Например: 1 кг, 500 г'}
            />
            <ProductImageUploader
              imageUrl={form.imageUrl}
              alt={form.name}
              error={formErrors.imageUrl}
              uploading={imageUploading}
              onChange={handleProductImageChange}
              onReset={() => setForm({ ...form, imageUrl: '' })}
            />
            <FormControl error={Boolean(formErrors.CategoryId)}>
              <InputLabel>Категория</InputLabel>
              <Select label="Категория" value={form.CategoryId} onChange={(event) => setForm({ ...form, CategoryId: event.target.value })}>
                {categories.map((category) => <MenuItem key={category.id} value={String(category.id)}>{category.name}</MenuItem>)}
              </Select>
              {formErrors.CategoryId && <FormHelperText>{formErrors.CategoryId}</FormHelperText>}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            resetProductForm();
          }}>
            Отмена
          </Button>
          <Button variant="contained" onClick={saveProduct}>Сохранить</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} fullWidth>
        <DialogTitle>Редактирование пользователя</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Имя"
              value={userForm.name}
              onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}
              error={Boolean(userFormErrors.name)}
              helperText={userFormErrors.name}
            />
            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
              error={Boolean(userFormErrors.email)}
              helperText={userFormErrors.email}
            />
            <TextField
              label="Телефон"
              value={userForm.phone}
              onChange={(event) => setUserForm({ ...userForm, phone: event.target.value })}
              error={Boolean(userFormErrors.phone)}
              helperText={userFormErrors.phone || 'Например: +375293737994'}
            />
            <FormControl error={Boolean(userFormErrors.role)}>
              <InputLabel>Роль</InputLabel>
              <Select label="Роль" value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
                <MenuItem value="customer">Покупатель</MenuItem>
                <MenuItem value="admin">Администратор</MenuItem>
              </Select>
              {userFormErrors.role && <FormHelperText>{userFormErrors.role}</FormHelperText>}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={saveUser}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
