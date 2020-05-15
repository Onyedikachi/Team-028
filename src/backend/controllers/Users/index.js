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

  // hash the password
  const saltRounds = 10;
  const hash = await bcrypt.hash(req.body.password, saltRounds);

  userData.userName = req.body.name;
  userData.userPassword = hash;
  userData.userEmail = req.body.email;
  userData.userCategory = parseInt(req.body.category, 10);
  userData.userOrganization = parseInt(req.body.organization, 10);
  userData.userPhone = parseInt(req.body.phone, 10);
  userData.userRole = parseInt(req.body.role, 10);
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
  auditData.performedBy = data.userID;
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
  // verify if user password
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
  sessionData.userId = parseInt(userData.userID, 10);
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
  auditData.performedBy = userData.userID;

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
    && userInToken.userID !== userInDatabase.dataValues.userID
    && userInToken.userEmail !== userInDatabase.dataValues.userID
  ) return res.status(400).json({ status: 'error', message: 'could not verify this user' });

  // activate user
  userInDatabase.isVerified = true;
  await userInDatabase.save();

  return res.status(200).json({ status: 'success', message: 'congratulations, you have been verified' });
};
