export interface ITemporaryLeaveLine {
    id: number;
    name: string;
    leave_date_from: string;
    leave_date_to: string;
    num_leave_date_to: number;
    leave_date_type: string;
    leave_reason_type: (number | string)[];
    temporary_leave_id: (number | string)[];
    sea_sign_document_id: boolean;
}