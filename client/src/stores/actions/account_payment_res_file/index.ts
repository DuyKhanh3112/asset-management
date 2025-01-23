import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getAccountPaymentResFileApi } from "services/account_payment_res_file";

const getAccountPaymentResFile = actionCreator("GET_ACCOUNT_PAYMENT_RES_FILE");

export const get_account_payment_res_file = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getAccountPaymentResFile.request());
        try {
            const response = await getAccountPaymentResFileApi();
            if (response.status !== 200) {
                dispatch(getAccountPaymentResFile.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getAccountPaymentResFile.success(response.data?.data || []));
            return { success: true, data: response.data?.data };
        } catch (e) {
            dispatch(getAccountPaymentResFile.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}