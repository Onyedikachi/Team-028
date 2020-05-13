module.exports = (sequelize, DataTypes) => sequelize.define('audit', {
  auditId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING
  },
  actionStatus: {
    type: DataTypes.STRING
  },
  performedBy: {
    type: DataTypes.INTEGER
  },
  actionTime: {
    type: DataTypes.TIME
  }
});
