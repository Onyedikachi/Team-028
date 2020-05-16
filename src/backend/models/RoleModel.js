module.exports = (sequelize, DataTypes) => sequelize.define('roles', {
  roleId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  roleName: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  dateCreated: {
    type: DataTypes.DATE
  },
  createdBy: {
    type: DataTypes.STRING
  }
});
