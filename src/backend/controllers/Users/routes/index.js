import express from 'express';

import userCtl from '../index';
import { catchErrors } from '../../../helpers';

const router = express.Router();

router.post('/register', catchErrors(userCtl.register));
router.post('/login', catchErrors(userCtl.login));

module.exports = router;
