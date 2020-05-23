import * as Model from '../../models';

/**
 * Create Project category
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.create = async (req, res) => {
  const { name, createdBy, description } = req.body;

  // check if creator has the privileges
  const userRoles = await Model.Role.findByPk(createdBy, { include: ['privileges'] });
  const userPrivileges = userRoles.get({ plain: true }).privileges;

  const privilege = userPrivileges.filter((element) => element.privilegeId === 6);
  if (!privilege || privilege.length < 1) return res.status(400).json({ status: 'error', message: 'you don\'t have this privilege' });

  try {
    await Model.ProjectCategory.create({
      name,
      createdBy,
      description
    });
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message || 'error creating this category' });
  }
  return res.status(200).json({ status: 'success', message: 'project category created successfully' });
};
