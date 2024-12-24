import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getDepartmentApi } from "services/department";
import { getErrorMessage } from "helpers/getErrorMessage";

const getDepartments = actionCreator("GET_DEPARTMENTS");

export const get_department = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getDepartments.request());
        try {
            const response = await getDepartmentApi();
            if (response.status !== 200) {
                dispatch(getDepartments.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getDepartments.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getDepartments.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}