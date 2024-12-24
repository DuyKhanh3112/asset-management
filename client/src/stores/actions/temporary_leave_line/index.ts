import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { createTemporaryLeaveLineApi, deleteTemporaryLeaveLineApi, getTemporaryLeaveLineApi, updateTemporaryLeaveLineApi } from "services/sign_document";

const getTemporaryLeaveLine = actionCreator("GET_TEMPORARY_LEAVE_LINE");

export const get_temporary_leave_line = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getTemporaryLeaveLine.request());
        try {
            const response = await getTemporaryLeaveLineApi(id);
            if (response.status !== 200) {
                dispatch(getTemporaryLeaveLine.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getTemporaryLeaveLine.success(response.data?.data || []));
            console.log(response.data?.data)
            return { success: true, message: response.data?.msg, data: response.data?.data };
        } catch (e) {
            dispatch(getTemporaryLeaveLine.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}


export const create_temporary_leave_line = (
    leave_date_from: string,
    leave_date_to: string,
    num_leave_date_to: number,
    leave_reason_type: number,
    leave_date_type: string,
    temporary_leave_id: number,
    sea_sign_document_id: number,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getTemporaryLeaveLine.request());
        try {
            const response = await createTemporaryLeaveLineApi(leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type, temporary_leave_id, sea_sign_document_id);
            if (response.status !== 200) {
                dispatch(getTemporaryLeaveLine.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getTemporaryLeaveLine.success(response.data?.data || []));
            return { success: true, data: response.data?.data, message: '' };
        } catch (e) {
            dispatch(getTemporaryLeaveLine.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const update_temporary_leave_line = (
    id: number,
    leave_date_from: string,
    leave_date_to: string,
    num_leave_date_to: number,
    leave_reason_type: number,
    leave_date_type: string,
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getTemporaryLeaveLine.request());
        try {
            const response = await updateTemporaryLeaveLineApi(id, leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type);
            if (response.status !== 200) {
                dispatch(getTemporaryLeaveLine.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getTemporaryLeaveLine.success(response.data?.data || []));
            return { success: true, data: response.data?.data, message: '' };
        } catch (e) {
            dispatch(getTemporaryLeaveLine.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}


export const delete_temporary_leave_line = (
    id: number
) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getTemporaryLeaveLine.request());
        try {
            const response = await deleteTemporaryLeaveLineApi(id);
            if (response.status !== 200) {
                dispatch(getTemporaryLeaveLine.failure(null));
                return { success: false, message: response.data?.msg };
            }
            // dispatch(getTemporaryLeaveLine.success(response.data?.data || []));
            return { success: true, data: response.data?.data, message: '' };
        } catch (e) {
            dispatch(getTemporaryLeaveLine.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}
