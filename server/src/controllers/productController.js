const { Op } = require('sequelize');
const { Product, Category, ProductReview, User } = require('../models');

const getProducts = async (req, res, next) => {
  try {
    const { categoryId, search, minPrice, maxPrice, sort = 'name' } = req.query;
    const where = {};
    if (categoryId) where.CategoryId = categoryId;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { nameEn: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const sortMap = {
      priceAsc: [['price', 'ASC']],
      priceDesc: [['price', 'DESC']],
      newest: [['createdAt', 'DESC']],
      popular: [['isPopular', 'DESC'], ['name', 'ASC']],
      name: [['name', 'ASC']],
    };

    const products = await Product.findAll({
      where,
      include: [Category],
      order: sortMap[sort] || sortMap.name,
    });
    return res.json(products);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: ProductReview, include: [{ model: User, attributes: ['id', 'name'] }] }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await ProductReview.create({
      ProductId: req.params.id,
      UserId: req.user.id,
      rating: req.body.rating,
      text: req.body.text,
    });
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
};

const uploadProductImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
  return res.status(201).json({ imageUrl });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  uploadProductImage,
};
