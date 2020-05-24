import express from 'express';
import { catchErrors } from '../../../helpers';
import * as projCtl from '../index';

const router = express.Router();

router.post('/', catchErrors(projCtl.create));
router.patch('/', catchErrors(projCtl.update));
router.delete('/', catchErrors(projCtl.delete));
router.get('/', catchErrors(projCtl.findAll));
router.get('/:projectId', catchErrors(projCtl.findOne));

module.exports = router;
