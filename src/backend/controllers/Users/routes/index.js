import express from 'express';

import userCtl from '../index';


const router = express.Router();

router.post('/register', userCtl.register);
router.post('/login', userCtl.login);

module.exports = router;
