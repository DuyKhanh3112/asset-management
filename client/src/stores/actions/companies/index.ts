import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { changeCompanyApi, getCompaniesApi } from "services/company";
import { getErrorMessage } from "helpers/getErrorMessage";

const getCompanies = actionCreator("GET_COMPANIES");
const changeCompany = actionCreator("CHANGE_COMPANY");

export const get_company = () => {
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

export const change_company = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(changeCompany.request());
        try {
            const response = await changeCompanyApi(id);
            if (response.status !== 200) {
                dispatch(changeCompany.failure(null));
                return { success: false, message: response.data?.msg };
            }

            dispatch(changeCompany.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(changeCompany.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}