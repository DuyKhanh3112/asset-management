import express from "express";
import { signDocumentCtl } from "../controllers/signDocumentController.js";
import { authenticateUser } from '../middleWare.js'
const router = express.Router();

router.get("/get-document/:id", authenticateUser, signDocumentCtl.getSignDocumentById);
router.get("/get-document-away", authenticateUser, signDocumentCtl.getSignDocumentAway);
router.get("/get-document-arrive", authenticateUser, signDocumentCtl.getSignDocumentArrive);
router.get("/get-document-arrive-done", authenticateUser, signDocumentCtl.getSignDocumentArriveDone);
router.get("/get-document-arrive-process", authenticateUser, signDocumentCtl.getSignDocumentArriveProcess);
router.get("/get-document-arrive-await", authenticateUser, signDocumentCtl.getSignDocumentArriveAwait);
router.get("/get-document-stage/:id", authenticateUser, signDocumentCtl.getSignDocumentStage);
router.get("/get-document-stage-action/:id", authenticateUser, signDocumentCtl.getSignDocumentStageAction);
router.get("/get-current-stage-action/:id", authenticateUser, signDocumentCtl.getCurrentStageAction);
router.get("/confirm-action/:id", authenticateUser, signDocumentCtl.confirmActionDocument);
router.get("/temporary-leave-type", authenticateUser, signDocumentCtl.getTemporaryLeaveType);
router.get("/get-sign-detail", authenticateUser, signDocumentCtl.getSignDetailModelLink);
router.get("/get-temporary-leave/:id", authenticateUser, signDocumentCtl.getTemporaryLeave);
router.get("/get-temporary-leave-line/:id", authenticateUser, signDocumentCtl.getTemporaryLeaveLine);
router.get("/get-advance-payment-request/:id", authenticateUser, signDocumentCtl.getAdvancePaymentRequest);
router.post("/create-document", authenticateUser, signDocumentCtl.createDocument);
router.post("/create-leave-line", authenticateUser, signDocumentCtl.createTemporaryLeaveLine);
router.post("/delete-leave-line", authenticateUser, signDocumentCtl.deleteTemporaryLeaveLine);
router.post("/update-leave-line", authenticateUser, signDocumentCtl.updateTemporaryLeaveLine);
router.post("/update-temporary-leave", authenticateUser, signDocumentCtl.updateTemporaryLeave);
router.post("/update-advance-payment-request", authenticateUser, signDocumentCtl.updateAdvancePaymentRequest);
router.get("/get-account-payment-res-file", authenticateUser, signDocumentCtl.getAccountPaymentResFile);
router.get("/get-partner-bank", authenticateUser, signDocumentCtl.getResPartnerBank);

router.post("/create-payments", authenticateUser, signDocumentCtl.createPayments);
router.post("/update-payments", authenticateUser, signDocumentCtl.updatePayments);
router.get("/delete-payments/:id", authenticateUser, signDocumentCtl.deletePayments);

router.post("/create-advance-payments", authenticateUser, signDocumentCtl.createAdvancePayments)
router.post("/update-advance-payments", authenticateUser, signDocumentCtl.updateAdvancePayments);
router.get("/delete-advance-payments/:id", authenticateUser, signDocumentCtl.deleteAdvancePayments);

router.get('/get-sign-payment/:id', authenticateUser, signDocumentCtl.getSignPayments)
router.get('/get-sign-advance-payment/:id', authenticateUser, signDocumentCtl.getSignAdvancePayments)
router.get('/get-payment-request/:id', authenticateUser, signDocumentCtl.getPaymentRequest)
router.post('/update-payment-request', authenticateUser, signDocumentCtl.updatePaymentRequest)

export default router.stack;