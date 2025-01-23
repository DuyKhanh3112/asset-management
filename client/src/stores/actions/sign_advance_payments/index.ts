import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { createAdvancePaymentsApi, deleteAdvancePaymentsApi, getAdvancePaymentsApi, updateAdvancePaymentsApi } from "services/sign_advance_payments";

const getSignAdvancePayments = actionCreator("GET_SIGN_ADVANCE_PAYMENTS");

export const create_advance_payments = (
    name: string,
    date: string,
    amount: number,
    sea_sign_document_id: number,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignAdvancePayments.request());
        try {
            const response = await createAdvancePaymentsApi(name, date, amount, sea_sign_document_id);
            if (response.status !== 200) {
                dispatch(getSignAdvancePayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getSignAdvancePayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignAdvancePayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const update_advance_payments = (
    id: number,
    name: string,
    date: string,
    amount: number,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignAdvancePayments.request());
        try {
            const response = await updateAdvancePaymentsApi(id, name, date, amount);
            if (response.status !== 200) {
                dispatch(getSignAdvancePayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getSignAdvancePayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignAdvancePayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}


export const delete_advance_payments = (
    id: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignAdvancePayments.request());
        try {
            const response = await deleteAdvancePaymentsApi(id);
            if (response.status !== 200) {
                dispatch(getSignAdvancePayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getSignAdvancePayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignAdvancePayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const get_advance_payments = (
    id: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignAdvancePayments.request());
        try {
            const response = await getAdvancePaymentsApi(id);
            if (response.status !== 200) {
                dispatch(getSignAdvancePayments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignAdvancePayments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignAdvancePayments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}