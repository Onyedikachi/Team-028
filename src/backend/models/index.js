import Sequelize from 'sequelize';
import config from '../config';
import logger from '../config/logger';
import UserModel from './UserModel';
import AuditModel from './AuditModel';
import SessionModel from './SessionModel';
import OrganizationModel from './OrganizationModel';
import RoleModel from './RoleModel';
import PrivilegeModel from './PrivilegeModel';
import RolePrivilegeModel from './RolePrivilegeModel';


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
const Role = RoleModel(sequelize, Sequelize);
const Privilege = PrivilegeModel(sequelize, Sequelize);
const RolePrivilege = RolePrivilegeModel(sequelize, Sequelize);

User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organizations' });
Organization.hasMany(User, { as: 'users' });

Role.belongsToMany(Privilege, { through: 'roleprivileges', foreignKey: 'roleId', as: 'privileges' });
RolePrivilege.belongsTo(Role, { foreignKey: 'roleId' });
RolePrivilege.belongsTo(Privilege, { foreignKey: 'privilegeId' });
Privilege.belongsToMany(Role, { through: 'roleprivileges', foreignKey: 'privilegeId', as: 'roles' });

sequelize.sync({ force: true }).then(() => {
  logger.info('Database & tables created here');
});

module.exports = {
  db,
  User,
  Audit,
  Session,
  Organization,
  Role,
  Privilege,
  RolePrivilege
};
