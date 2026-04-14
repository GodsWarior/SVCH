const BaseController = require('./baseController');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

class CustomerController extends BaseController {
  constructor() {
    super(Customer);
  }

  // Получить всех клиентов с их заказами
  getAllWithOrders = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = '_id',
        sortOrder = 'asc'
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const customers = await Customer.find()
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Получаем заказы для каждого клиента
      const customersWithOrders = await Promise.all(
        customers.map(async (customer) => {
          const orders = await Order.find({ customer_id: customer._id }).lean();
          return { ...customer, orders };
        })
      );

      const total = await Customer.countDocuments();

      res.json({
        success: true,
        data: customersWithOrders,
        pagination: {
          current: parseInt(page),
          total,
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить клиента с его заказами
  getWithOrders = async (req, res) => {
    try {
      const { id } = req.params;
      
      const customer = await Customer.findById(id).lean();
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Клиент не найден'
        });
      }

      const orders = await Order.find({ customer_id: id }).lean();
      
      res.json({
        success: true,
        data: { ...customer, orders }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Статистика по клиенту
  getStatistics = async (req, res) => {
    try {
      const { id } = req.params;
      
      const customer = await Customer.findById(id).lean();
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Клиент не найден'
        });
      }

      const orders = await Order.find({ customer_id: id }).lean();
      
      const completedOrders = orders.filter(o => o.status === 'delivered');
      const totalSpent = completedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const lastOrder = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null;
      
      const stats = {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalSpent,
        lastOrder
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
const customerController = new CustomerController();

// Экспортируем экземпляр контроллера целиком
module.exports = customerController;
