module.exports = (sequelize, Sequelize) => sequelize.define('users', {
  userID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: Sequelize.STRING
  },
  userPassword:{
    type: Sequelize.STRING
  },
  userEmail: {
    type: Sequelize.STRING
  },
  userRole: {
    type: Sequelize.INTEGER
  },
  userPhone: {
    type: Sequelize.INTEGER
  }
});
