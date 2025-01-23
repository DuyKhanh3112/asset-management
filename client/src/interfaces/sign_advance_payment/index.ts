export interface ISignAdvancePayment {
    id: number;
    name: string;
    amount: number;
    date?: Date;
    payment_request_id?: (number | string)[];
    sea_sign_document_id: (number | string)[];
}