const BaseController = require('./baseController');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Courier = require('../models/Courier');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

class OrderController extends BaseController {
  constructor() {
    super(Order);
  }

  // Переопределяем метод создания для автоматического расчета суммы
  create = async (req, res) => {
    try {
      const { products, total_amount, ...orderData } = req.body;

      // Валидация продуктов
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Необходимо выбрать хотя бы один продукт'
        });
      }

      // Получаем информацию о продуктах и рассчитываем сумму
      const productDocs = await Product.find({ _id: { $in: products } });
      
      if (productDocs.length !== products.length) {
        return res.status(400).json({
          success: false,
          error: 'Один или несколько продуктов не найдены'
        });
      }

      // Автоматический расчет суммы на основе цен продуктов
      const calculatedTotal = productDocs.reduce((sum, product) => {
        return sum + (parseFloat(product.price) || 0);
      }, 0);

      // Используем переданную сумму, если она есть и больше расчетной, иначе используем расчетную
      const finalTotal = total_amount && parseFloat(total_amount) >= calculatedTotal 
        ? parseFloat(total_amount) 
        : calculatedTotal;

      const order = await Order.create({
        ...orderData,
        products: products,
        total_amount: finalTotal
      });

      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Переопределяем метод обновления для автоматического расчета суммы
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const { products, total_amount, ...orderData } = req.body;

      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Заказ не найден'
        });
      }

      // Если переданы новые продукты, пересчитываем сумму
      if (products && Array.isArray(products) && products.length > 0) {
        const productDocs = await Product.find({ _id: { $in: products } });
        
        if (productDocs.length !== products.length) {
          return res.status(400).json({
            success: false,
            error: 'Один или несколько продуктов не найдены'
          });
        }

        const calculatedTotal = productDocs.reduce((sum, product) => {
          return sum + (parseFloat(product.price) || 0);
        }, 0);

        const finalTotal = total_amount && parseFloat(total_amount) >= calculatedTotal 
          ? parseFloat(total_amount) 
          : calculatedTotal;

        order.products = products;
        order.total_amount = finalTotal;
      } else if (total_amount !== undefined) {
        // Если обновляется только сумма без изменения продуктов
        order.total_amount = parseFloat(total_amount);
      }

      // Обновляем остальные поля
      Object.keys(orderData).forEach(key => {
        if (orderData[key] !== undefined) {
          order[key] = orderData[key];
        }
      });

      await order.save();

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Переопределяем метод получения всех для populate products
  getAll = async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = '_id', sortOrder = 'asc', ...filters } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const sort = {};
      if (sortBy) {
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }

      const query = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          query[key] = filters[key];
        }
      });

      const records = await Order.find(query)
        .populate('products', 'name price category')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Order.countDocuments(query);

      res.json({
        success: true,
        data: records,
        pagination: {
          current: parseInt(page),
          total: total,
          pages: Math.ceil(total / limit),
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

  // Переопределяем метод получения по ID для populate products
  getById = async (req, res) => {
    try {
      const record = await Order.findById(req.params.id)
        .populate('products', 'name price category description in_stock photo')
        .lean();
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить все записи заказов с информацией о клиенте, курьере и позициях
  getAllDetailed = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = '_id',
        sortOrder = 'asc',
        ...filters
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const filter = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '' && key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder') {
          filter[key] = filters[key];
        }
      });

      const orders = await Order.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const ordersDetailed = await Promise.all(
        orders.map(async (order) => {
          const customer = await Customer.findById(order.customer_id)
            .select('_id last_name first_name middle_name phone address')
            .lean();
          const courier = order.courier_id ? await Courier.findById(order.courier_id)
            .select('_id last_name first_name middle_name phone vehicle_type')
            .lean() : null;
          const orderItems = await OrderItem.find({ order_id: order._id }).lean();
          const orderItemsWithProducts = await Promise.all(
            orderItems.map(async (item) => {
              const product = await Product.findById(item.product_id)
                .select('_id name category')
                .lean();
              return { ...item, product };
            })
          );
          return {
            ...order,
            customer,
            courier,
            orderItems: orderItemsWithProducts
          };
        })
      );

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        data: ordersDetailed,
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

  // Получить запись заказа с детальной информацией
  getDetailed = async (req, res) => {
    try {
      const { id } = req.params;
      
      const order = await Order.findById(id).lean();
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Заказ не найден'
        });
      }

      const customer = await Customer.findById(order.customer_id)
        .select('_id last_name first_name middle_name phone email address')
        .lean();
      const courier = order.courier_id ? await Courier.findById(order.courier_id)
        .select('_id last_name first_name middle_name phone vehicle_type')
        .lean() : null;
      const orderItems = await OrderItem.find({ order_id: id }).lean();
      const orderItemsWithProducts = await Promise.all(
        orderItems.map(async (item) => {
          const product = await Product.findById(item.product_id).lean();
          return { ...item, product };
        })
      );
      
      res.json({
        success: true,
        data: {
          ...order,
          customer,
          courier,
          orderItems: orderItemsWithProducts
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить заказы по статусу
  getByStatus = async (req, res) => {
    try {
      const { status } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const orders = await Order.find({ status })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const ordersDetailed = await Promise.all(
        orders.map(async (order) => {
          const customer = await Customer.findById(order.customer_id)
            .select('_id last_name first_name phone')
            .lean();
          const courier = order.courier_id ? await Courier.findById(order.courier_id)
            .select('_id last_name first_name phone')
            .lean() : null;
          const orderItems = await OrderItem.find({ order_id: order._id }).lean();
          const orderItemsWithProducts = await Promise.all(
            orderItems.map(async (item) => {
              const product = await Product.findById(item.product_id)
                .select('_id name')
                .lean();
              return { ...item, product };
            })
          );
          return {
            ...order,
            customer,
            courier,
            orderItems: orderItemsWithProducts
          };
        })
      );

      const total = await Order.countDocuments({ status });

      res.json({
        success: true,
        data: ordersDetailed,
        status,
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
}

// Создаем экземпляр контроллера
const orderController = new OrderController();

// Экспортируем экземпляр контроллера целиком
module.exports = orderController;
