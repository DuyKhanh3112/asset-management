import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { createSignDocumentApi, getDocumentArriveApi, getDocumentArriveAwaitApi, getDocumentArriveDoneApi, getDocumentArriveProcessApi, getDocumentAwayApi, getDocumentByIdApi } from "services/sign_document";
import { message } from "antd";
import { ITemporaryLeaveType } from "interfaces";

const getSignDocuments = actionCreator("GET_SIGN_DOCUMENT");

// export const get_sign_document = () => {
//     return async (dispatch: AppDispatch) => {
//         dispatch(getSignDocuments.request());
//         try {
//             const response = await getSignDocumentApi();
//             if (response.status !== 200) {
//                 dispatch(getSignDocuments.failure(null));
//                 return { success: false, message: response.data?.msg };
//             }
//             dispatch(getSignDocuments.success(response.data?.data || []));
//             return { success: true, message: response.data?.msg };
//         } catch (e) {
//             dispatch(getSignDocuments.failure(null));
//             const message = getErrorMessage(e);
//             return { success: false, message: message }
//         }
//     }
// }
export const get_document_by_id = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await getDocumentByIdApi(id);
            if (response.status !== 200) {
                dispatch(getSignDocuments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignDocuments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignDocuments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const get_document_away = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await getDocumentAwayApi();
            if (response.status !== 200) {
                dispatch(getSignDocuments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignDocuments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignDocuments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const get_document_arrive = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await getDocumentArriveApi();
            if (response.status !== 200) {
                dispatch(getSignDocuments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignDocuments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignDocuments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const get_document_arrive_done = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await getDocumentArriveDoneApi();
            if (response.status !== 200) {
                dispatch(getSignDocuments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignDocuments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignDocuments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const get_document_arrive_process = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await getDocumentArriveProcessApi();
            if (response.status !== 200) {
                dispatch(getSignDocuments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignDocuments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignDocuments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const get_document_arrive_await = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await getDocumentArriveAwaitApi();
            if (response.status !== 200) {
                dispatch(getSignDocuments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignDocuments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignDocuments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const create_sign_document = (
    name: string,
    employee_request: number, document_detail: number,
    reason_leaving?: string,
    partner_id?: number,
    ap_amount?: number,
    advance_payment_description?: string,
    payment_method?: string,
    account_payment_res_file?: number,
    payment_content?: string,
    expire_date?: string,
    bank_id?: number,
    remaining_amount?: number,
    payment_proposal_purpose?: string,
    pr_payments?: any[],
    pr_advance_payments?: any[]

) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await createSignDocumentApi(name, employee_request, document_detail,
                reason_leaving,
                partner_id, ap_amount, advance_payment_description, payment_method, account_payment_res_file,
                payment_content, expire_date, bank_id, remaining_amount, payment_proposal_purpose, pr_payments, pr_advance_payments);
            if (response.status !== 200) {
                dispatch(getSignDocuments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getSignDocuments.success(response.data?.data || []));
            return { success: true, data: response.data?.data, message: '' };
        } catch (e) {
            dispatch(getSignDocuments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}
