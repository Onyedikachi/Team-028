import express from 'express';
import { catchErrors } from '../../../helpers';
import * as projCtl from '../index';

const router = express.Router();

router.post('/', catchErrors(projCtl.create));

module.exports = router;
