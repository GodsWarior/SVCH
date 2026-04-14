const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Импортируем маршруты
const customerRoutes = require('./routes/customers');
const courierRoutes = require('./routes/couriers');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api/customers', customerRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Тестовый маршрут
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Food Delivery API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      customers: '/api/customers',
      couriers: '/api/couriers', 
      products: '/api/products',
      orders: '/api/orders'
    }
  });
});

// Подключение к базе данных и запуск сервера
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Customers API: http://localhost:${PORT}/api/customers`);
      console.log(`Couriers API: http://localhost:${PORT}/api/couriers`);
      console.log(`Products API: http://localhost:${PORT}/api/products`);
      console.log(`Orders API: http://localhost:${PORT}/api/orders`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
