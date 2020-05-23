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
