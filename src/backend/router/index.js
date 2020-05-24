import express from 'express';

import userRoutes from '../controllers/Users/routes';
import projCatRoutes from '../controllers/ProjectCategory/routes';
import projRoutes from '../controllers/Project/routes';


const router = express.Router();

router.use('/user', userRoutes);
router.use('/project_category', projCatRoutes);
router.use('/projects', projRoutes);

module.exports = router;
