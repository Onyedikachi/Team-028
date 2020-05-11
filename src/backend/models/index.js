import Sequelize from 'sequelize';
import config from '../config';
import logger from '../config/logger';
import UserModel from './UserModel';

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ force: true }).then(() => {
  logger.info('Database & tables created here');
});

module.exports = {
  db,
  User
};
