import { getEmployeeBasedOnUserId, getEmployeeMultiCompany } from "../utils/getOdooUserData.js";
export const employeeMultiCompanyCtrl = {
    getEmployeeBasedOnUserId: async (req, res) => {
        try {
            const data = await getEmployeeBasedOnUserId(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getEmployeeMultiCompany: async (req, res) => {
        try {
            const data = await getEmployeeMultiCompany(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }
}