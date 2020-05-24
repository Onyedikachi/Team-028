module.exports = (sequelize, Datatypes) => sequelize.define('projects', {
  projectId: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectName: {
    type: Datatypes.STRING
  },
  projectCategory: {
    type: Datatypes.INTEGER
  },
  description: {
    type: Datatypes.TEXT
  },
  createdBy: {
    type: Datatypes.INTEGER
  },
  startDate: {
    type: Datatypes.DATE
  },
  endDate: {
    type: Datatypes.DATE
  }
});
