const BaseController = require('./baseController');
const Product = require('../models/Product');
const OrderItem = require('../models/OrderItem');

class ProductController extends BaseController {
  constructor() {
    super(Product);
  }

  // Получить продукт с позициями заказов
  getWithOrderItems = async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await Product.findById(id).lean();
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Продукт не найден'
        });
      }

      const orderItems = await OrderItem.find({ product_id: id }).lean();
      
      res.json({
        success: true,
        data: { ...product, orderItems }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Статистика по продукту
  getStatistics = async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await Product.findById(id).lean();
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Продукт не найден'
        });
      }

      const orderItems = await OrderItem.find({ product_id: id }).lean();
      
      const totalQuantity = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const totalRevenue = orderItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price_at_order || 0)), 0);
      const averagePrice = orderItems.length > 0
        ? orderItems.reduce((sum, item) => sum + (item.price_at_order || 0), 0) / orderItems.length
        : 0;
      
      const stats = {
        totalOrders: orderItems.length,
        totalQuantity,
        totalRevenue,
        averagePrice
      };
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

// Создаем экземпляр контроллера
const productController = new ProductController();

// Экспортируем экземпляр контроллера целиком
module.exports = productController;
