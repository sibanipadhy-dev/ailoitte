const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const storage = process.env.DB_STORAGE || './database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);
db.CartItem = require('./cartItem')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.OrderItem = require('./orderItem')(sequelize, DataTypes);

// Associations
db.Category.hasMany(db.Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId' });

db.User.hasMany(db.CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.CartItem.belongsTo(db.User, { foreignKey: 'userId' });
db.Product.hasMany(db.CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
db.CartItem.belongsTo(db.Product, { foreignKey: 'productId' });

db.User.hasMany(db.Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });
db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });
db.Product.hasMany(db.OrderItem, { foreignKey: 'productId', onDelete: 'SET NULL' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId' });

module.exports = db;
