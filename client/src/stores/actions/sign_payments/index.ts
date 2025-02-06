import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { createPaymentsApi, deletePaymentApi, getPaymentsApi, updatePaymentsApi } from "services/sign_payments";

const getSignPayments = actionCreator("GET_SIGN_PAYMENTS");

export const create_payments = (
    payment_contract: string,
    payment_bill: string,
    date: string,
    amount: number,
    sea_sign_document_id: number,
    payment_request_id: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignPayments.request());
        try {
            const response = await createPaymentsApi(payment_contract, payment_bill, date, amount, sea_sign_document_id, payment_request_id);
            if (response.status !== 200) {
                dispatch(getSignPayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getSignPayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignPayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const update_payments = (
    id: number,
    payment_contract: string,
    payment_bill: string,
    date: string,
    amount: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignPayments.request());
        try {
            const response = await updatePaymentsApi(id, payment_contract, payment_bill, date, amount);
            if (response.status !== 200) {
                dispatch(getSignPayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getSignPayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignPayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const delete_payments = (
    id: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignPayments.request());
        try {
            const response = await deletePaymentApi(id);
            if (response.status !== 200) {
                dispatch(getSignPayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getSignPayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignPayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}


export const get_payments = (
    id: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignPayments.request());
        try {
            const response = await getPaymentsApi(id);
            if (response.status !== 200) {
                dispatch(getSignPayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignPayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignPayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}