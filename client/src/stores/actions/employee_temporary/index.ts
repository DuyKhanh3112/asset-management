import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getEmployeeTemporaryApi } from "services/employee_temporary";

const getEmployeeTemporary = actionCreator("GET_EMPLOYEE_TEMPORARY");



export const get_employee_temporary = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getEmployeeTemporary.request());
        try {
            const response = await getEmployeeTemporaryApi();
            if (response.status !== 200) {
                dispatch(getEmployeeTemporary.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getEmployeeTemporary.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getEmployeeTemporary.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}