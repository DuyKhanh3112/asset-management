import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getTemporaryLeaveTypeAPI } from "services/sign_document";

const getTemporaryLeaveType = actionCreator("GET_TEMPORARY_LEAVE_TYPE");

export const get_temporary_leave_type = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getTemporaryLeaveType.request());
        try {
            const response = await getTemporaryLeaveTypeAPI();
            if (response.status !== 200) {
                dispatch(getTemporaryLeaveType.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getTemporaryLeaveType.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getTemporaryLeaveType.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}