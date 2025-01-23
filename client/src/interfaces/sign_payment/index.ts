export interface ISignPayment {
    id: number;
    name?: string;
    payment_contract: string;
    payment_bill: string;
    amount: number;
    date?: Date;
    sea_sign_document_id: (number | string)[];
    payment_request_id?: (number | string)[];
}