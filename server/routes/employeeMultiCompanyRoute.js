import express from "express";
import { authenticateUser } from '../middleWare.js'
import { employeeMultiCompanyCtrl } from "../controllers/employeeMultiCompanyController.js";
const router = express.Router();

router.get("/get-employee-multi-base-uid", authenticateUser, employeeMultiCompanyCtrl.getEmployeeBasedOnUserId);
router.get("/get-employee-multi", authenticateUser, employeeMultiCompanyCtrl.getEmployeeMultiCompany);
router.get("/get-partner", authenticateUser, employeeMultiCompanyCtrl.getResPartner);

export default router.stack;