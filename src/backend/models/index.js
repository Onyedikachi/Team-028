import Sequelize from 'sequelize';
import config from '../config';
import logger from '../config/logger';
import UserModel from './UserModel';
import AuditModel from './AuditModel';
import SessionModel from './SessionModel';
import OrganizationModel from './OrganizationModel';


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
const Audit = AuditModel(sequelize, Sequelize);
const Session = SessionModel(sequelize, Sequelize);
const Organization = OrganizationModel(sequelize, Sequelize);

User.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(User);

sequelize.sync({ force: true }).then(() => {
  logger.info('Database & tables created here');
});

module.exports = {
  db,
  User,
  Audit,
  Session,
  Organization
};
