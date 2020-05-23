module.exports = (sequelize, Datatypes) => sequelize.define('projectcategories', {
  projectCatId: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Datatypes.STRING
  },
  createdBy: {
    type: Datatypes.INTEGER
  },
  description: {
    type: Datatypes.STRING
  }
});
