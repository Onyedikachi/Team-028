import express from 'express';
import * as projCatCtrl from '../index';
import { catchErrors } from '../../../helpers';

const router = express.Router();

router.post('/', catchErrors(projCatCtrl.create));

module.exports = router;
