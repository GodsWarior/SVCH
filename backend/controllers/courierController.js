const BaseController = require('./baseController');
const Courier = require('../models/Courier');
const Order = require('../models/Order');

class CourierController extends BaseController {
  constructor() {
    super(Courier);
  }

  // Получить все записи - ВСЕГДА с информацией о заказах
  getAll = async (req, res) => {
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

      const couriers = await Courier.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const couriersWithOrders = await Promise.all(
        couriers.map(async (courier) => {
          const orders = await Order.find({ courier_id: courier._id })
            .select('_id status created_at')
            .lean();
          return { ...courier, orders };
        })
      );

      const total = await Courier.countDocuments(filter);

      res.json({
        success: true,
        data: couriersWithOrders,
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

  // Получить все записи с сортировкой - ВСЕГДА с информацией о заказах
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = '_id', sortOrder = 'asc' } = req.query;
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const couriers = await Courier.find().sort(sort).lean();

      const couriersWithOrders = await Promise.all(
        couriers.map(async (courier) => {
          const orders = await Order.find({ courier_id: courier._id })
            .select('_id status created_at')
            .lean();
          return { ...courier, orders };
        })
      );
      
      res.json({
        success: true,
        data: couriersWithOrders,
        count: couriersWithOrders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить все записи с фильтрацией - ВСЕГДА с информацией о заказах
  getAllFiltered = async (req, res) => {
    try {
      const filter = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          filter[key] = req.query[key];
        }
      });

      const couriers = await Courier.find(filter).lean();

      const couriersWithOrders = await Promise.all(
        couriers.map(async (courier) => {
          const orders = await Order.find({ courier_id: courier._id })
            .select('_id status created_at')
            .lean();
          return { ...courier, orders };
        })
      );
      
      res.json({
        success: true,
        data: couriersWithOrders,
        count: couriersWithOrders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Поиск записей - ВСЕГДА с информацией о заказах
  search = async (req, res) => {
    try {
      const { q, field = 'last_name' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      const searchQuery = {
        [field]: { $regex: q, $options: 'i' }
      };

      const couriers = await Courier.find(searchQuery).lean();

      const couriersWithOrders = await Promise.all(
        couriers.map(async (courier) => {
          const orders = await Order.find({ courier_id: courier._id })
            .select('_id status created_at')
            .lean();
          return { ...courier, orders };
        })
      );

      res.json({
        success: true,
        data: couriersWithOrders,
        count: couriersWithOrders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить запись по ID - ВСЕГДА с информацией о заказах
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const courier = await Courier.findById(id).lean();
      
      if (!courier) {
        return res.status(404).json({
          success: false,
          error: 'Курьер не найден'
        });
      }

      const orders = await Order.find({ courier_id: id })
        .select('_id status created_at')
        .lean();
      
      res.json({
        success: true,
        data: { ...courier, orders }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить курьера с информацией о заказах
  getWithOrders = async (req, res) => {
    try {
      const { id } = req.params;
      
      const courier = await Courier.findById(id).lean();
      
      if (!courier) {
        return res.status(404).json({
          success: false,
          error: 'Курьер не найден'
        });
      }

      const orders = await Order.find({ courier_id: id }).lean();
      
      res.json({
        success: true,
        data: { ...courier, orders }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить всех курьеров с заказами
  getAllWithOrders = async (req, res) => {
    try {
      const couriers = await Courier.find().lean();

      const couriersWithOrders = await Promise.all(
        couriers.map(async (courier) => {
          const orders = await Order.find({ courier_id: courier._id }).lean();
          return { ...courier, orders };
        })
      );
      
      res.json({
        success: true,
        data: couriersWithOrders,
        count: couriersWithOrders.length
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
const courierController = new CourierController();

// Экспортируем экземпляр контроллера целиком
module.exports = courierController;
