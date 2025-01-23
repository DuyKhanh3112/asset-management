import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getPartnerBankApi } from "services/partner_bank";

const getResPartnerBanks = actionCreator("GET_RES_PARTNER_BANK");

export const get_partner_bank = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(getResPartnerBanks.request());
        try {
            const response = await getPartnerBankApi();
            if (response.status !== 200) {
                dispatch(getResPartnerBanks.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getResPartnerBanks.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getResPartnerBanks.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}