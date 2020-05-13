import express from 'express';

import userCtl from '..';


const router = express.Router();

router.use('/register', userCtl.register);

module.exports = router;
