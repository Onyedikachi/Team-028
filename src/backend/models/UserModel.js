module.exports = (sequelize, Datatypes) => sequelize.define('users', {
  userID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: Datatypes.STRING
  },
  userPassword: {
    type: Datatypes.STRING
  },
  userEmail: {
    type: Datatypes.STRING
  },
  userCategory: {
    type: Datatypes.INTEGER
  },
  userOrganization: {
    type: Datatypes.INTEGER
  },
  userRole: {
    type: Datatypes.INTEGER
  },
  userPhone: {
    type: Datatypes.BIGINT
  },
  isVerified: {
    type: Datatypes.BOOLEAN
  },
  createdAt: {
    type: Datatypes.DATE
  },
  updatedAt: {
    type: Datatypes.DATE
  }
});
