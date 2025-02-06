import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getPaymentRequestApi, updatePaymentRequestApi } from "services/sign_payment_request";

const getPaymentRequest = actionCreator("GET_PAYMENT_REQUEST");

export const get_payment_request = (
    id: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getPaymentRequest.request());
        try {
            const response = await getPaymentRequestApi(id);
            if (response.status !== 200) {
                dispatch(getPaymentRequest.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getPaymentRequest.success(response.data?.data || []));
            return { success: true, message: response.data?.msg, data: response.data?.data };
        } catch (e) {
            dispatch(getPaymentRequest.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}


export const update_payment_request = (
    id: number,
    partner_id: number,
    remaining_amount: number,
    payment_method: string,
    payment_proposal_purpose: string,
    advance_file_id?: number,
    pay_content?: string,
    expire_date?: string,
    bank_ids?: number,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getPaymentRequest.request());
        try {
            const response = await updatePaymentRequestApi(id, partner_id, remaining_amount, payment_method, payment_proposal_purpose, advance_file_id, pay_content, expire_date, bank_ids);
            if (response.status !== 200) {
                dispatch(getPaymentRequest.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getPaymentRequest.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getPaymentRequest.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}