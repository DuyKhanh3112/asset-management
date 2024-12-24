import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { confirmActionApi, getDocumentStageActionApi } from "services/sign_document";

const getDocumentStageAction = actionCreator("GET_DOCUMENT_STAGE_ACTION");

export const get_document_stage_action = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getDocumentStageAction.request());
        try {
            const response = await getDocumentStageActionApi(id);
            if (response.status !== 200) {
                dispatch(getDocumentStageAction.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getDocumentStageAction.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getDocumentStageAction.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}


export const confirm_action = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getDocumentStageAction.request());
        try {
            const response = await confirmActionApi(id);
            if (response.status !== 200) {
                dispatch(getDocumentStageAction.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getDocumentStageAction.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getDocumentStageAction.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}