import { AppDispatch } from "stores/store";
import { actionCreator } from "../common";
import { getErrorMessage } from "helpers/getErrorMessage";
import { getDocumentStageApi } from "services/sign_document";

const getDocumentStages = actionCreator("GET_DOCUMENT_STAGE");



export const get_document_stage = (id: number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(getDocumentStages.request());
        try {
            const response = await getDocumentStageApi(id);
            if (response.status !== 200) {
                dispatch(getDocumentStages.failure(null));
                return { success: false, message: response.data?.msg };
            }
            dispatch(getDocumentStages.success(response.data?.data || []));
            return { success: true, message: response.data?.msg };
        } catch (e) {
            dispatch(getDocumentStages.failure(null));
            const message = getErrorMessage(e);
            return { success: false, message: message }
        }
    }
}