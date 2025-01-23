import instance from "./instance";

export function getPaymentRequestApi(id: number) {
    return instance.get(`/api/get-payment-request/${id}`);
}

export function updatePaymentRequestApi(
    id: number,
    partner_id: number,
    remaining_amount: number,
    payment_method: string,
    advance_file_id?: number,
    pay_content?: string,
    expire_date?: string,
    bank_ids?: number
) {
    return instance.post("/api/update-payment-request", {
        "id": id,
        "advance_file_id": advance_file_id,
        "remaining_amount": remaining_amount,
        "pay_content": pay_content,
        "payment_method": payment_method,
        "expire_date": expire_date,
        "bank_ids": bank_ids,
        "partner_id": partner_id
    })
}