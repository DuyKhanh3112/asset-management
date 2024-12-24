export interface ITemporaryLeave {
    id: number;
    name: string;
    leave_days: number;
    reason_leaving: string;
    leave_date_from: boolean;
    leave_date_to: boolean;
    sea_sign_document_id: (number | string)[];
    temporary_leave_line: any[];
}