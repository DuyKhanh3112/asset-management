import instance from "./instance";

// export function getSignDocumentApi() {
//     return instance.get("/api/get-sign-document");
// }
export function getDocumentByIdApi(id: number) {
    return instance.get(`/api/get-document/${id}`);
}

export function getDocumentAwayApi() {
    return instance.get("/api/get-document-away");
}


export function getDocumentArriveApi() {
    return instance.get("/api/get-document-arrive");
}

export function getDocumentArriveDoneApi() {
    return instance.get("/api/get-document-arrive-done");
}

export function getDocumentArriveProcessApi() {
    return instance.get("/api/get-document-arrive-process");
}

export function getDocumentArriveAwaitApi() {
    return instance.get("/api/get-document-arrive-await");
}

export function getDocumentStageApi(id: number) {
    return instance.get(`/api/get-document-stage/${id}`);
}
export function getDocumentStageActionApi(id: number) {
    return instance.get(`/api/get-document-stage-action/${id}`);
}

export function getCurrentStageActionApi(id: number) {
    return instance.get(`/api/get-current-stage-action/${id}`);
}

export function confirmActionApi(id: number) {
    return instance.get(`/api/confirm-action/${id}`)
}

export function getTemporaryLeaveTypeAPI() {
    return instance.get(`/api/temporary-leave-type`)
}
export function getSignDetailApi() {
    return instance.get(`/api/get-sign-detail`)
}

export function getTemporaryLeaveApi(id: number) {
    return instance.get(`/api/get-temporary-leave/${id}`)
}

export function getTemporaryLeaveLineApi(id: number) {
    return instance.get(`/api/get-temporary-leave-line/${id}`)
}

export function createSignDocumentApi(
    name_doc: string,
    employee_request_id: number,
    document_detail_id: number,
    reason_leaving?: string) {
    return instance.post("/api/create-document", {
        "name": name_doc,
        "employee_request": employee_request_id,
        "document_detail": document_detail_id,
        "reason_leaving": reason_leaving ? reason_leaving : '',
    })
}


export function createTemporaryLeaveLineApi(
    leave_date_from: string,
    leave_date_to: string,
    num_leave_date_to: number,
    leave_reason_type: number,
    leave_date_type: string,
    temporary_leave_id: number,
    sea_sign_document_id: number
) {
    return instance.post("/api/create-leave-line", {
        "leave_date_from": leave_date_from,
        "leave_date_to": leave_date_to,
        "num_leave_date_to": num_leave_date_to,
        "leave_reason_type": leave_reason_type,
        "leave_date_type": leave_date_type,
        "temporary_leave_id": temporary_leave_id,
        "sea_sign_document_id": sea_sign_document_id
    })
}

export function updateTemporaryLeaveLineApi(
    id: number,
    leave_date_from: string,
    leave_date_to: string,
    num_leave_date_to: number,
    leave_reason_type: number,
    leave_date_type: string,
) {
    return instance.post("/api/update-leave-line", {
        "id": id,
        "leave_date_from": leave_date_from,
        "leave_date_to": leave_date_to,
        "num_leave_date_to": num_leave_date_to,
        "leave_reason_type": leave_reason_type,
        "leave_date_type": leave_date_type
    })
}

export function deleteTemporaryLeaveLineApi(id: number) {
    return instance.post("/api/delete-leave-line", { "id": id })
}

export function updateTemporaryLeaveApi(
    id: number,
    reason_leaving: string) {
    return instance.post("/api/update-temporary-leave", {
        "id": id,
        "reason_leaving": reason_leaving
    })
}