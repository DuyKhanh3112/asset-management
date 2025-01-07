import { combineReducers } from "redux";
import authReducer from './auth';
import companyReducer from "./companies";
import departmentReducer from "./departments";
import userReducer from "./user";
import signDocumentReducer from "./sign_document";
import documentStageReducer from "./document_stage";
import employeeTemporaryReducer from "./employee_temporary";
import currentStageActionReducer from "./current_stage_action";
import documentStageActionReducer from "./document_stage_action";
import employeeMultiReducer from "./employee_multi_company";
import temporaryLeaveTypeReducer from "./temporary_leave_type";
import signDetailReducer from "./sign_detail";
import temporaryLeaveReducer from "./temporary_leave";
import temporaryLeaveLineReducer from "./temporary_leave_line";
import resPartnerReducer from "./res_partner";
import advancePaymentRequestReducer from "./advance_payment_request";

// Định nghĩa rootReducer bằng cách kết hợp tất cả các reducer, ví dụ như authReducer, thành một reducer gốc duy nhất
export const rootReducer = combineReducers({
  auth: authReducer, // Kết hợp authReducer vào rootReducer với khóa là 'auth'
  companies: companyReducer,
  departments: departmentReducer,
  users: userReducer,
  sign_document: signDocumentReducer,
  document_stage: documentStageReducer,
  document_stage_action: documentStageActionReducer,
  employeeTemporary: employeeTemporaryReducer,
  currentStageAction: currentStageActionReducer,
  employee_multi_company: employeeMultiReducer,
  temporary_leave_type: temporaryLeaveTypeReducer,
  sign_detail: signDetailReducer,
  temporary_leave: temporaryLeaveReducer,
  temporary_leave_line: temporaryLeaveLineReducer,
  res_partner: resPartnerReducer,
  advance_payment_request: advancePaymentRequestReducer
});

// Định nghĩa kiểu RootState bằng cách sử dụng ReturnType để suy luận kiểu từ rootReducer,
// để TypeScript biết được cấu trúc của trạng thái trong store Redux của chúng ta
export type RootState = ReturnType<typeof rootReducer>; // Định nghĩa kiểu trạng thái của store dựa trên rootReducer
