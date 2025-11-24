const { Category } = require('../models');

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const cat = await Category.create({ name, description });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listCategories = async (req, res) => {
  const cats = await Category.findAll();
  res.json(cats);
};

const updateCategory = async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Not found' });
  const { name, description } = req.body;
  if (name !== undefined) cat.name = name;
  if (description !== undefined) cat.description = description;
  await cat.save();
  res.json(cat);
};

const deleteCategory = async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Not found' });
  await cat.destroy();
  res.status(204).send();
};

module.exports = { createCategory, listCategories, updateCategory, deleteCategory };
