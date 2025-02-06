import instance from "./instance";

export function createPaymentsApi(
    payment_contract: string,
    payment_bill: string,
    date: string,
    amount: number,
    sea_sign_document_id: number,
    payment_request_id: number
) {
    return instance.post("/api/create-payments", {
        "payment_contract": payment_contract,
        "payment_bill": payment_bill,
        "date": date,
        "amount": amount,
        "sea_sign_document_id": sea_sign_document_id,
        "payment_request_id": payment_request_id
    });
}

export function updatePaymentsApi(
    id: number,
    payment_contract: string,
    payment_bill: string,
    date: string,
    amount: number,
) {
    return instance.post("/api/update-payments", {
        "id": id,
        "payment_contract": payment_contract,
        "payment_bill": payment_bill,
        "date": date,
        "amount": amount
    });
}

export function deletePaymentApi(id: number) {
    return instance.get(`/api/delete-payments/${id}`);
}

export function getPaymentsApi(id: number) {
    return instance.get(`/api/get-sign-payment/${id}`);
}