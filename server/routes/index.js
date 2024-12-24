import express from 'express';
import authRouter from './authRoute.js'
import assetRouter from './assetRoute.js'
import auditRouter from './auditRoute.js'
import signRoute from './signRoute.js';
import employeeMultiCompanyRoute from './employeeMultiCompanyRoute.js'

const router = express.Router();
router.stack = [
    ...router.stack,
    ...authRouter,
    ...assetRouter,
    ...auditRouter,
    ...signRoute,
    ...employeeMultiCompanyRoute
]

export default router;