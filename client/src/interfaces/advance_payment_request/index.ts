export interface IAdvancePaymentRequest {
    id: number;
    payment_date: string;
    amount: number;
    partner_id: (number | string)[];
    advance_payment_description: string;
    advance_payment_method: string;
    sea_sign_document_id: (number | string)[];
}