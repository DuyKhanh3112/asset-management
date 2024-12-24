import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getEmployeeMultiApi } from "services/employee_multi_company";

const getEmployeeMulti = actionCreator("GET_EMPLOYEE_MULTI");

export const get_employee_multi = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getEmployeeMulti.request());
        try {
            const response = await getEmployeeMultiApi();
            if (response.status !== 200) {
                dispatch(getEmployeeMulti.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getEmployeeMulti.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getEmployeeMulti.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}