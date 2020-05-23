import express from 'express';

import userRoutes from '../controllers/Users/routes';
import projCatRoutes from '../controllers/ProjectCategory/routes';


const router = express.Router();

router.use('/user', userRoutes);
router.use('/project_category', projCatRoutes);

module.exports = router;
