const mongoose = require('mongoose');

class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Получить все записи с пагинацией
  getAll = async (req, res) => {
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

      const records = await this.model.find()
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await this.model.countDocuments();

      res.json({
        success: true,
        data: records,
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

  // Получить все записи с сортировкой
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = '_id', sortOrder = 'asc' } = req.query;
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const records = await this.model.find().sort(sort).lean();
      
      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить все записи с фильтрацией
  getAllFiltered = async (req, res) => {
    try {
      const filter = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          filter[key] = req.query[key];
        }
      });

      const records = await this.model.find(filter).lean();
      
      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Поиск записей
  search = async (req, res) => {
    try {
      const { q, field } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      const schemaPaths = Object.keys(this.model.schema.paths);
      const stringFields = schemaPaths.filter(path => {
        const pathType = this.model.schema.paths[path];
        return pathType && pathType.instance === 'String' && path !== '_id';
      });

      const searchFields = field ? [field] : stringFields;

      const searchQuery = {
        $or: searchFields.map(field => ({
          [field]: { $regex: q, $options: 'i' }
        }))
      };

      const records = await this.model.find(searchQuery).lean();

      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить запись по ID
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const record = await this.model.findById(id).lean();
      
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

  // Проверить существование записи
  exists = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          exists: false
        });
      }

      const record = await this.model.findById(id).select('_id').lean();
      res.json({
        success: true,
        exists: !!record
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Создать новую запись
  create = async (req, res) => {
    try {
      const record = new this.model(req.body);
      await record.save();
      
      res.status(201).json({
        success: true,
        data: record.toObject()
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(', ')
        });
      }
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Обновить запись
  update = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const record = await this.model.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).lean();
      
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
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(', ')
        });
      }
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Удалить запись
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const record = await this.model.findByIdAndDelete(id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        message: 'Запись успешно удалена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = BaseController;
