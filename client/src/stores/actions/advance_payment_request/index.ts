import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getAdvancePaymentRequestApi, updateAdvancePaymentRequestApi } from "services/sign_document";

const getAdvancePaymentRequest = actionCreator("GET_ADVANCE_PAYMENT_REQUEST");

export const get_advance_payment_request = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getAdvancePaymentRequest.request());
        try {
            const response = await getAdvancePaymentRequestApi(id);
            if (response.status !== 200) {
                dispatch(getAdvancePaymentRequest.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getAdvancePaymentRequest.success(response.data?.data || []));
            return { success: true, message: response.data?.msg, data: response.data?.data };
        } catch (e) {
            dispatch(getAdvancePaymentRequest.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const update_advance_payment_request = (
    id: number,
    partner_id: number,
    amount: number,
    advance_payment_description: string,
    advance_payment_method: string,
    advance_file_id?: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getAdvancePaymentRequest.request());
        try {
            const response = await updateAdvancePaymentRequestApi(id, partner_id, amount, advance_payment_description, advance_payment_method, advance_file_id);
            if (response.status !== 200) {
                dispatch(getAdvancePaymentRequest.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getAdvancePaymentRequest.success(response.data?.data || []));
            return { success: true, message: response.data?.msg, data: response.data?.data };
        } catch (e) {
            dispatch(getAdvancePaymentRequest.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}