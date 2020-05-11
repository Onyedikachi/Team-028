import express from 'express';

import userRoutes from '../controllers/Users/routes';


const router = express.Router();

router.use('/user', userRoutes);

module.exports = router;
