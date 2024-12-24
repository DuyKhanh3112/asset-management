import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getSignDetailApi } from "services/sign_document";

const getSignDetails = actionCreator("GET_SIGN_DETAIL");

export const get_sign_detail = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getSignDetails.request());
        try {
            const response = await getSignDetailApi();
            if (response.status !== 200) {
                dispatch(getSignDetails.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getSignDetails.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getSignDetails.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}