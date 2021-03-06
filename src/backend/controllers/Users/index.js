import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import * as Model from '../../models';
import config from '../../config';
import logger from '../../config/logger';

/**
 * Create users
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.register = async (req, res) => {
  const userData = {};

  // verify if user email exists already
  const user = await Model.User.findOne({ where: { userEmail: req.body.email } });
  if (user) return res.status(400).json({ status: 'error', message: 'email already exists' });

  const creatorId = parseInt(req.body.creatorId, 10) || 0;
  const creatorRole = parseInt(req.body.creatorRole, 10) || 1;
  const creatorOrganization = parseInt(req.body.creatorOrganization, 10) || 0;
  const userOrganization = parseInt(req.body.organization, 10);

  // find organization users by creator Id
  const organization = await Model.Organization.findByPk(creatorOrganization, { include: ['users'] });
  let userInOrganization = null;
  try {
    const organizationUsers = organization.get({ plain: true }).users;
    userInOrganization = organizationUsers.filter((element) => element.userId === creatorId);
  } catch (error) {
    logger.warn(error.message);
    logger.info('No users in this company');
  }

  // get role privileges;
  const userRoles = await Model.Role.findByPk(creatorRole, { include: ['privileges'] });
  const userPrivileges = userRoles.get({ plain: true }).privileges;

  const privilege = userPrivileges.filter((element) => element.privilegeId === 1);
  if (!privilege || privilege.length < 1) return res.status(400).json({ status: 'error', message: 'you don\'t have this privilege' });

  // To create a user, the creator must be a System Admin or and admin of that Organization
  if (!(userInOrganization || userRoles.roleId === 1 || creatorOrganization === userOrganization)) return res.status(400).json({ status: 'error', message: 'you are not allowed to create users for this organization' });

  // hash the password
  const saltRounds = 10;
  const hash = await bcrypt.hash(req.body.password, saltRounds);

  userData.userName = req.body.name;
  userData.userPassword = hash;
  userData.userEmail = req.body.email;
  userData.userCategory = parseInt(req.body.category, 10);
  userData.userOrganization = parseInt(req.body.organization, 10);
  userData.userPhone = parseInt(req.body.phone, 10);
  userData.roleId = parseInt(req.body.role, 10);
  userData.isVerified = false;
  userData.createdAt = new Date();
  userData.updatedAt = new Date();

  let usr;

  try {
    usr = await Model.User.create(userData);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Some error occurred while creating user'
    });
  }

  // delete user password from json sent to client
  const data = usr.dataValues;
  delete data.userPassword;

  // add token to data
  const privateKey = config.jwtsecret;
  const token = jwt.sign(data, privateKey, {
    expiresIn: '1h'
  });
  data.token = token;

  // update audit
  const auditData = {};

  auditData.action = 'register';
  auditData.actionStatus = 'success';
  auditData.performedBy = data.userId;
  auditData.actionTime = data.createdAt;

  try {
    await Model.Audit.create(auditData);
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message || 'User registered, but there are errors generating audit data'
    });
  }

  // send email
  const source = fs.readFileSync(path.join(__dirname, '/../../templates/verifyUrl.hbs'), 'utf-8');
  const template = Handlebars.compile(source);

  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass
    },
    debug: true,
    logger: true
  });

  const host = req.get('host');
  const verifyUrl = `http://${host}/api/v1/user/verify?token=${token}&email=${data.userEmail}`;

  const mailOptions = {
    from: 'vindication@ezSME.com',
    to: 'kachi.nwosu@gmail.com',
    subject: 'Verify your email',
    html: template({ verifyUrl })
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info(`Email sent:  + ${info.response}`);
    }
  });

  const organizationData = {};

  organizationData.userId = data.userId;
  organizationData.userCatId = data.userCategory;
  organizationData.companyName = req.body.companyName || 'default';
  organizationData.RCNumber = req.body.rcnumber;
  organizationData.email = req.body.companyEmail || data.userEmail;
  organizationData.BVN = req.body.BVN;
  organizationData.address = req.body.address;
  organizationData.dateIncorporated = new Date(req.body.dateIncorporated);

  try {
    await Model.Organization.create(organizationData);
  } catch (error) {
    logger.warn(error.message || 'error creating user organization');
  }
  return res.status(200).json({
    status: 'success',
    message: 'You have registered successfully',
    data
  });
};

/**
 * User Login
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.login = async (req, res) => {
  // verify user email exists
  const user = await Model.User.findOne({ where: { userEmail: req.body.email } });
  if (!user) return res.status(400).json({ status: 'error', message: 'user email does not exist' });

  const userData = user.dataValues;

  // verify if user password matches
  let match;
  try {
    match = await bcrypt.compare(req.body.password, userData.userPassword);
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message || 'error while encrypting password' });
  }
  if (!match) return res.status(400).json({ status: 'error', message: 'incorrect password' });

  delete userData.userPassword;

  // check if user email have been verified
  if (!userData.isVerified) return res.status(400).json({ status: 'error', message: 'registered but not verified' });

  // create session
  const sessionData = {};
  sessionData.userId = parseInt(userData.userId, 10);
  sessionData.userIP = req.connection.remoteAddress || req.ipInfo.ip;
  sessionData.timeLoggedIn = new Date();
  sessionData.timeLoggedOut = new Date();
  sessionData.sessionState = true;

  // generate token
  const privateKey = config.jwtsecret;
  const token = jwt.sign(userData, privateKey, {
    expiresIn: '1h'
  });
  sessionData.userToken = token;

  // update session variables
  if (!req.session.isLoggedIn) req.session.isLoggedIn = true;
  if (!req.session.data) req.session.data = sessionData;

  // save session to database;
  try {
    const session = await Model.Session.create(sessionData);
    sessionData.sessionId = session.dataValues.sessionId;
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message || 'error saving session data' });
  }
  const auditData = {};

  auditData.action = 'status';
  auditData.actionStatus = 'success';
  auditData.performedBy = userData.userId;

  try {
    await Model.Audit.create(auditData);
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message || 'error saving audit data' });
  }

  // update session variables
  if (!req.session.isLoggedIn) req.session.isLoggedIn = true;
  if (!req.session.data) req.session.data = sessionData;

  return res.status(200).json({ status: 'success', message: 'you have successfully logged in', token });
};

/**
 * User Activate
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.activate = async (req, res) => {
  // get user token
  const { token, email } = req.query;

  // verify token
  let userInToken;
  try {
    userInToken = jwt.verify(token, config.jwtsecret);
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error.message || 'could not verify your token' });
  }

  // fetch database user
  const userInDatabase = await Model.User.findOne({ where: { userEmail: email } });
  if (!userInDatabase) return res.status(400).json({ status: 'error', message: 'user does not exist' });

  // check if user is already verified
  if (userInDatabase.dataValues.isVerified) return res.status(400).json({ status: 'error', message: 'user already activated' });

  // validate user
  if (
    email !== userInToken.userEmail
    && userInToken.userId !== userInDatabase.dataValues.userId
    && userInToken.userEmail !== userInDatabase.dataValues.userId
  ) return res.status(400).json({ status: 'error', message: 'could not verify this user' });

  // activate user
  userInDatabase.isVerified = true;
  await userInDatabase.save();

  return res.status(200).json({ status: 'success', message: 'congratulations, you have been verified' });
};

/**
 * User Assign Role
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return {json} res.json
 */
module.exports.assign = async (req, res) => {
  const { userId, creatorId, newRole } = req.body;

  const user = await Model.User.findByPk(userId);
  if (!user) return res.status(400).json({ status: 'error', message: 'user does not exist' });

  // check if the creator has this role privileges;
  const creator = (await Model.User.findByPk(creatorId)).get({ plain: true });
  const userRoles = await Model.Role.findByPk(creator.roleId, { include: ['privileges'] });

  const userPrivileges = userRoles.get({ plain: true }).privileges;

  const privilege = userPrivileges.filter((element) => element.privilegeId === 2);

  if (!privilege || privilege.length < 1) return res.status(400).json({ status: 'error', message: 'you don\'t have this privilege' });

  // check if user has that role before
  if (user.get({ plain: true }).roleId === parseInt(newRole, 10)) return res.status(400).json({ status: 'error', message: 'same as the previous user role' });

  // update user role
  user.roleId = newRole;
  await user.save();
  return res.status(200).json({ status: 'success', message: 'a new role has been assigned for this user' });
};
