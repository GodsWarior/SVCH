const { Favorite, Product, Category } = require('../models');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Product, include: [Category] }],
    });
    return res.json(favorites);
  } catch (error) {
    return next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const [favorite] = await Favorite.findOrCreate({
      where: { UserId: req.user.id, ProductId: req.params.productId },
    });
    return res.status(201).json(favorite);
  } catch (error) {
    return next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    await Favorite.destroy({ where: { UserId: req.user.id, ProductId: req.params.productId } });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
