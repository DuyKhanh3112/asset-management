import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getPartnerApi } from "services/partner";

const gerResPartner = actionCreator("GET_RES_PARTNER");

export const get_res_partner = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(gerResPartner.request());
        try {
            const response = await getPartnerApi();
            if (response.status !== 200) {
                dispatch(gerResPartner.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(gerResPartner.success(response.data?.data ?? []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(gerResPartner.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}