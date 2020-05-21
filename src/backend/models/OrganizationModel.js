module.exports = (sequelize, DataTypes) => sequelize.define('organizations', {
  organizationId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER
  },
  userCatId: {
    type: DataTypes.INTEGER
  },
  companyName: {
    type: DataTypes.STRING
  },
  RCNumber: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  BVN: {
    type: DataTypes.BIGINT
  },
  address: {
    type: DataTypes.STRING
  },
  dateIncorporated: {
    type: DataTypes.DATE
  }
});
