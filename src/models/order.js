module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    total: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('pending','completed','cancelled'), defaultValue: 'pending' },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  }, {});
};
