export interface IResPartnerBank {
    id: number;
    acc_number: string;
    sanitized_acc_number: string;
    acc_holder_name?: string;
    partner_id: (number | string)[];
    bank_id: (number | string)[];
    company_id: (number | string)[];
}