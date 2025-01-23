import instance from "./instance";

export function createAdvancePaymentsApi(
    name: string,
    date: string,
    amount: number,
    sea_sign_document_id: number,
) {
    return instance.post("/api/create-advance-payments", {
        "name": name,
        "date": date,
        "amount": amount,
        "sea_sign_document_id": sea_sign_document_id
    });
}

export function updateAdvancePaymentsApi(
    id: number,
    name: string,
    date: string,
    amount: number,
) {
    return instance.post("/api/update-advance-payments", {
        "id": id,
        "name": name,
        "date": date,
        "amount": amount
    });
}

export function deleteAdvancePaymentsApi(id: number) {
    return instance.get(`/api/delete-advance-payments/${id}`);
}

export function getAdvancePaymentsApi(id: number) {
    return instance.get(`/api/get-sign-advance-payment/${id}`);
}