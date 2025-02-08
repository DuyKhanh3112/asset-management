import user from "../models/user.js";
import { getSignDocumentAway, getSignDocumentArrive, getSignDocumentById, getSignDocumentStage, getCurrentStageAction, getSignDocumentStageAction, getSignDocumentArriveDone, getSignDocumentArriveProcess, getSignDocumentArriveAwait, confirmActionDocument, getTemporaryLeaveType, getSignDetailModelLink, getTemporaryLeave, getTemporaryLeaveLine, createSignDocument, createTemporaryLeaveLine, deleteTemporaryLeaveLine, updateTemporaryLeaveLine, updateTemporaryLeave, getAdvancePaymentRequest, updateAdvancePaymentRequest, getAccountPaymentResFile, getResPartnerBank, createAdvancePayments, createSignPayments, getPaymentRequest, getSignPayments, getSignAdvancePayments, updatePaymentRequest, deleteSignPayments, updateSignPayments, updateAdvancePayments, deleteAdvancePayments } from "../utils/getOdooUserData.js";

export const signDocumentCtl = {
    getSignDocumentById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getSignDocumentById(req.odoo, req.user, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDocumentAway: async (req, res) => {
        try {
            const data = await getSignDocumentAway(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDocumentArrive: async (req, res) => {
        try {
            const data = await getSignDocumentArrive(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDocumentArriveDone: async (req, res) => {
        try {
            const data = await getSignDocumentArriveDone(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDocumentArriveProcess: async (req, res) => {
        try {
            const data = await getSignDocumentArriveProcess(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDocumentArriveAwait: async (req, res) => {
        try {
            const data = await getSignDocumentArriveAwait(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDocumentStage: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getSignDocumentStage(req.odoo, req.user, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDocumentStageAction: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getSignDocumentStageAction(req.odoo, req.user, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getCurrentStageAction: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getCurrentStageAction(req.odoo, req.user, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    confirmActionDocument: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await confirmActionDocument(req.odoo, req.user, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    getTemporaryLeaveType: async (req, res) => {
        try {
            const data = await getTemporaryLeaveType(req.odoo);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignDetailModelLink: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getSignDetailModelLink(req.odoo);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getTemporaryLeave: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getTemporaryLeave(req.odoo, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getAdvancePaymentRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getAdvancePaymentRequest(req.odoo, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    getTemporaryLeaveLine: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getTemporaryLeaveLine(req.odoo, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    createDocument: async (req, res) => {
        try {
            // //console.log(req)
            const { name, employee_request, document_detail, reason_leaving,
                partner_id, amount, advance_payment_description, advance_payment_method, advance_file_id,
                payment_content, expire_date, bank_id, remaining_amount, payment_proposal_purpose, pr_payments, pr_advance_payments } = req.body;
            const data = await createSignDocument(req.odoo, req.user, name, employee_request, document_detail,
                reason_leaving,
                partner_id, amount, advance_payment_description, advance_payment_method, advance_file_id,
                payment_content, expire_date, bank_id, remaining_amount, payment_proposal_purpose, pr_payments, pr_advance_payments);
            res.status(200).json({ data })
        } catch (error) {
            //console.log(error)
            res.status(500).json({ msg: error.message })
        }
    },
    createTemporaryLeaveLine: async (req, res) => {
        try {
            const { leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type, temporary_leave_id, sea_sign_document_id } = req.body;
            const data = await createTemporaryLeaveLine(req.odoo, leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type, temporary_leave_id, sea_sign_document_id);
            res.status(200).json({ data })
        } catch (error) {
            //console.log(error)
            res.status(500).json({ msg: error.message })
        }
    },

    deleteTemporaryLeaveLine: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await deleteTemporaryLeaveLine(req.odoo, id);
            res.status(200).json({ data })
        } catch (error) {
            //console.log(error)
            res.status(500).json({ msg: error.message })
        }
    },

    updateTemporaryLeaveLine: async (req, res) => {
        try {
            const { id, leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type } = req.body;
            const data = await updateTemporaryLeaveLine(req.odoo, id, leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type);
            res.status(200).json({ data })
        } catch (error) {
            //console.log(error)
            res.status(500).json({ msg: error.message })
        }
    },
    updateTemporaryLeave: async (req, res) => {
        try {
            const { id, reason_leaving } = req.body;
            const data = await updateTemporaryLeave(req.odoo, id, reason_leaving);
            res.status(200).json({ data })
        } catch (error) {
            //console.log(error)
            res.status(500).json({ msg: error.message })
        }
    },
    updateAdvancePaymentRequest: async (req, res) => {
        try {
            const { id, amount, advance_payment_description, advance_payment_method, partner_id, advance_file_id } = req.body;
            const data = await updateAdvancePaymentRequest(req.odoo, id, amount, advance_payment_description, advance_payment_method, partner_id, advance_file_id);
            res.status(200).json({ data })
        } catch (error) {
            //console.log(error)
            res.status(500).json({ msg: error.message })
        }
    },
    getAccountPaymentResFile: async (req, res) => {
        try {
            const data = await getAccountPaymentResFile(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getResPartnerBank: async (req, res) => {
        try {
            const data = await getResPartnerBank(req.odoo, req.user);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    createPayments: async (req, res) => {
        try {
            const { payment_contract, payment_bill, amount, date, sea_sign_document_id, payment_request_id } = req.body;
            // const data = await createPayments(req.odoo, payment_contract, payment_bill, amount, date, sea_sign_document_id)
            const data = await createSignPayments(req.odoo, payment_contract, payment_bill, amount, date, sea_sign_document_id, payment_request_id)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    deletePayments: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await deleteSignPayments(req.odoo, id);
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    updatePayments: async (req, res) => {
        try {
            const { id, payment_contract, payment_bill, amount, date } = req.body;
            const data = await updateSignPayments(req.odoo, id, payment_contract, payment_bill, amount, date)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    createAdvancePayments: async (req, res) => {
        try {
            const { name, amount, date, sea_sign_document_id, payment_request_id } = req.body;
            const data = await createAdvancePayments(req.odoo, name, amount, date, sea_sign_document_id, payment_request_id)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    updateAdvancePayments: async (req, res) => {
        try {
            const { id, name, amount, date } = req.body;
            const data = await updateAdvancePayments(req.odoo, id, name, amount, date)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    deleteAdvancePayments: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await deleteAdvancePayments(req.odoo, id)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },


    getPaymentRequest: async (req, res) => {
        try {
            const { id } = req.params

            //console.log('id', id)
            const data = await getPaymentRequest(req.odoo, id)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    getSignPayments: async (req, res) => {
        try {
            const { id } = req.params
            const data = await getSignPayments(req.odoo, id)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    getSignAdvancePayments: async (req, res) => {
        try {
            const { id } = req.params
            const data = await getSignAdvancePayments(req.odoo, id)
            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },


    updatePaymentRequest: async (req, res) => {
        try {
            const { id, advance_file_id, remaining_amount, pay_content, payment_method, expire_date, bank_ids, partner_id, payment_proposal_purpose } = req.body;
            const data = await updatePaymentRequest(req.odoo, id, advance_file_id, remaining_amount, pay_content, payment_method, expire_date, bank_ids, partner_id, payment_proposal_purpose);
            res.status(200).json({ data })
        } catch (error) {
            //console.log(error)
            res.status(500).json({ msg: error.message })
        }
    },
}

export default signDocumentCtl