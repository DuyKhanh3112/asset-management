export interface IPaymentRequest {
    id: number;
    name?: string;
    advance_file_id?: (number | string)[];
    remaining_amount: number;
    sea_sign_document_id: (number | string)[];
    pay_content: string;
    payment_method: string;
    expire_date: Date;
    payment_date: string;
    acc_holder_name?: string;
    partner_account_address?: string;
    account_number?: string;
    bank_name?: string;
    bank_address?: string;
    bank_ids?: (number | string)[];
    payment_proposal_purpose: string;
}