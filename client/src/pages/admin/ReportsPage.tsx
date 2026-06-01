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

export function ReportsPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h3" fontWeight={900}>Отчеты</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReportDownloadCard
            icon={<BarChart color="primary" fontSize="large" />}
            title="PDF-отчет по продажам"
            description="Количество заказов, статусы и общая выручка."
            buttonLabel="Скачать PDF"
            onDownload={() => reportApi.download('sales.pdf')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReportDownloadCard
            icon={<LocalShipping color="primary" fontSize="large" />}
            title="DOCX-отчет по остаткам"
            description="Товары, цены и остатки на складе."
            buttonLabel="Скачать DOCX"
            onDownload={() => reportApi.download('stock.docx')}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
