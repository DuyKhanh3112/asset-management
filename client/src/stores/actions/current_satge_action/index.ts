import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getCurrentStageActionApi } from "services/sign_document";

const getCurrentStageAction = actionCreator("GET_CURRENT_STAGE_ACTION");

export const get_current_stage_action = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getCurrentStageAction.request());
        try {
            const response = await getCurrentStageActionApi(id);
            if (response.status !== 200) {
                dispatch(getCurrentStageAction.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getCurrentStageAction.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getCurrentStageAction.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}
