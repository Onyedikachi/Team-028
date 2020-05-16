module.exports = (sequelize, DataTypes) => sequelize.define('privileges', {
  privilegeId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  privilegeName: {
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
