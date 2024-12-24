import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getTemporaryLeaveApi, updateTemporaryLeaveApi } from "services/sign_document";

const getTemporaryLeaves = actionCreator("GET_TEMPORARY_LEAVE");

export const get_temporary_leave = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getTemporaryLeaves.request());
        try {
            const response = await getTemporaryLeaveApi(id);
            if (response.status !== 200) {
                dispatch(getTemporaryLeaves.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getTemporaryLeaves.success(response.data?.data || []));
            return { success: true, message: response.data?.msg, data: response.data?.data };
        } catch (e) {
            dispatch(getTemporaryLeaves.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}


export const update_temporary_leave = (id: number, reason_leaving: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getTemporaryLeaves.request());
        try {
            const response = await updateTemporaryLeaveApi(id, reason_leaving);
            if (response.status !== 200) {
                // dispatch(getTemporaryLeaves.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getTemporaryLeaves.success(response.data?.data || []));
            return { success: true, message: response.data?.msg, data: response.data?.data };
        } catch (e) {
            dispatch(getTemporaryLeaves.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}