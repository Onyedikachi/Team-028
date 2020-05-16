module.exports = (sequelize, DataTypes) => sequelize.define('roleprivileges', {
  rolePrivilegeId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  privilegeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'privileges',
      key: 'privilegeId'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'roleId'
    }
  }
});
