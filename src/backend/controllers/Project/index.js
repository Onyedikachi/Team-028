import * as Model from '../../models';

/**
 * Create projects
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.create = async (req, res) => {
  const {
    projectName,
    projectCategory,
    description,
    createdBy,
    startDate,
    endDate
  } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  // check if user has the create project privileges
  const userRoles = await Model.Role.findByPk(createdBy, { include: ['privileges'] });
  const userPrivileges = userRoles.get({ plain: true }).privileges;

  const privilege = userPrivileges.filter((element) => element.privilegeId === 12);
  if (!privilege || privilege.length < 1) {
    return res.status(400).json({ status: 'error', message: "you don't have this privilege" });
  }

  try {
    await Model.Project.create({
      projectName,
      projectCategory,
      description,
      createdBy,
      start,
      end
    });
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message || 'error creating project' });
  }

  return res.status(200).json({ status: 'success', message: 'project created successfully' });
};

/**
 * update projects
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.update = async (req, res) => {
  const { projectId } = req.body;

  const project = await Model.Project.findByPk(projectId);

  if (!project) {
    return res.status(400).json({ status: 'error', message: 'this project does not exist' });
  }

  if (req.body.projectName) {
    project.projectName = req.body.projectName;
  }

  if (req.body.projectCategory) {
    project.projectCategory = req.body.projectCategory;
  }

  if (req.body.description) {
    project.description = req.body.description;
  }

  if (req.body.createdBy) {
    project.createdBy = req.body.createdBy;
  }

  if (req.body.startDate) {
    project.startDate = new Date(req.body.startDate);
  }

  if (req.body.endDate) {
    project.endDate = new Date(req.body.endDate);
  }

  try {
    await project.save();
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message || 'error occured while updating this project' });
  }

  return res.status(200).json({ status: 'success', message: 'project details have been updated' });
};

/**
 * delete projects
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.delete = async (req, res) => {
  const { projectId } = req.body;
  const project = await Model.Project.findByPk(projectId);

  if (!project) {
    return res.status(400).json({ status: 'error', message: 'this project does not exist' });
  }

  try {
    await project.destroy();
  } catch (error) {
    return res.status(400).json({ status: 'error', message: 'error occured while deleting this project' });
  }

  return res.status(200).json({ status: 'success', message: 'successfully deleted this project' });
};
