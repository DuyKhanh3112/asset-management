export interface IAccountPaymentResFile {
    id: number;
    name: string;
    code: string;
    partner_id: (number | string)[];
    description: string;
    company_id: (number | string)[];
}