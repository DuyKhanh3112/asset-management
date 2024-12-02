import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getCompaniesApi } from "services/company";
import { getErrorMessage } from "helpers/getErrorMessage";

const getCompanies = actionCreator("GET_COMPANIES");

export const getCompany = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getCompanies.request());
        try {
            const response = await getCompaniesApi();
            if (response.status !== 200) {
                dispatch(getCompanies.failure(null));
                return { success: false, message: response.data?.msg };
            }

            dispatch(getCompanies.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getCompanies.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}