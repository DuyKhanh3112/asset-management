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
interface DataTemporaryLeaveLine {
    leaveType?: ITemporaryLeaveType,
    rangeDate?: Date[],
    dateType?: string,
    num_date?: number
}
export const create_sign_document = (
    name: string,
    employee_request: number, document_detail: number,
    reason_leaving?: string,
    partner_id?: number,
    payment_amount?: number,
    advance_payment_description?: string,
    advance_payment_method?: string,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDocuments.request());
        try {
            const response = await createSignDocumentApi(name, employee_request, document_detail,
                reason_leaving,
                partner_id, payment_amount, advance_payment_description, advance_payment_method);
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
