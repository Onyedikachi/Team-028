/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Model from '../../models';
import config from '../../config';


/**
 * Create users
 * @param {object} req - Request object
 * @param {object} res - Response object
 */
module.exports.register = async (req, res) => {
  const userData = {};

  // verify if user email exists already
  const user = await Model.User.findOne({ where: { userEmail: req.body.email } });
  if (user) return res.status(400).json({ status: 'error', message: 'email already exists' });

  // hash the password
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
    if (error) return res.status(400).json({ status: 'error', message: 'password not hashed correctly' });

    userData.userName = req.body.name;
    userData.userPassword = hash;
    userData.userEmail = req.body.email;
    userData.userCategory = parseInt(req.body.category, 10);
    userData.userOrganization = parseInt(req.body.organization, 10);
    userData.userPhone = parseInt(req.body.phone, 10);
    userData.userRole = parseInt(req.body.role, 10);
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    Model.User.create(userData)
      .then((usr) => {
        // delete user password from json sent to client
        const data = usr.dataValues;
        delete data.userPassword;

        // add token to data
        const privateKey = config.jwtsecret;
        const token = jwt.sign(data, privateKey);
        data.token = token;

        // update audit
        const auditData = {};

        auditData.action = 'register';
        auditData.actionStatus = 'success';
        auditData.performedBy = data.userID;
        auditData.actionTime = data.createdAt;

        Model.Audit.create(auditData)
          .then(() => res.status(200).json({
            status: 'success',
            message: 'You have registered successfully',
            data
          }))
          .catch((e) => res.status(400).json({
            status: 'error',
            message: e.message || 'User registered, but there are errors generating audit data'
          }));
      })
      .catch((er) => res.status(500).json({
        status: 'error',
        message: er.message || 'Some error occurred while creating user'
      }));
  });

  return res.status(400).son({
    status: 'error',
    message: 'something went wrong'
  });
};
