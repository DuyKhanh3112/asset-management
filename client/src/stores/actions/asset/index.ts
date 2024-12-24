import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { postAssetApi } from "services/asset";
import { getErrorMessage } from "helpers/getErrorMessage";

const getAssets = actionCreator("GET_ASSETS");

export const post_asset = (value: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getAssets.request());
        try {
            const response = await postAssetApi(value);
            if (response.status !== 200) {
                dispatch(getAssets.failure(null));
                return { success: false, message: response.data?.msg };
            }

            dispatch(getAssets.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getAssets.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}