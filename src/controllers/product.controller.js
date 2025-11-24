const { Product, Category } = require('../models');
const cloudinary = require('../config/cloudinary');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    let imageUrl = null;
    if (req.file) {
      const streamifier = require('streamifier');
      const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
          streamifier.createReadStream(buffer).pipe(stream);
        });
      const result = await uploadFromBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }
    const product = await Product.create({ name, description, price, stock, categoryId: categoryId || null, imageUrl });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.file) {
      const streamifier = require('streamifier');
      const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
          streamifier.createReadStream(buffer).pipe(stream);
        });
      const result = await uploadFromBuffer(req.file.buffer);
      product.imageUrl = result.secure_url;
    }
    const updatable = ['name','description','price','stock','categoryId','imageUrl'];
    updatable.forEach(k => { if (req.body[k] !== undefined) product[k] = req.body[k]; });
    await product.save();
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  await product.destroy();
  return res.status(204).send();
};

const listProducts = async (req, res) => {
  const { minPrice, maxPrice, categoryId, search, page = 1, limit = 10 } = req.query;
  const { Op } = require('sequelize');
  const q = {};
  if (minPrice) q.price = { ...(q.price||{}), [Op.gte]: parseFloat(minPrice) };
  if (maxPrice) q.price = { ...(q.price||{}), [Op.lte]: parseFloat(maxPrice) };
  if (categoryId) q.categoryId = categoryId;
  if (search) q.name = { [Op.like]: `%${search}%` }; // SQLite uses LIKE

  const offset = (page - 1) * limit;
  const { count, rows } = await Product.findAndCountAll({
    where: q,
    include: [{ model: Category, attributes: ['id','name'] }],
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']]
  });
  return res.json({ total: count, page: parseInt(page), perPage: parseInt(limit), products: rows });
};

module.exports = { createProduct, updateProduct, deleteProduct, listProducts };
