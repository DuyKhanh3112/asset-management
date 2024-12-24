import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { logoutApi } from "services/auth";
import { getUserApi } from "services/user";

const getUsers = actionCreator("GET_USERS");
const logout = actionCreator("LOGOUT");

export const get_users = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getUsers.request());
        try {
            const response = await getUserApi();
            if (response.status !== 200) {
                dispatch(getUsers.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getUsers.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getUsers.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}

export const logout_user = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(logout.request());
        try {
            const response = await logoutApi();
            if (response.status !== 200) {
                dispatch(logout.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(logout.success(response.data?.data || []));

            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(logout.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}