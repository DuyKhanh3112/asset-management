export interface ISignDocument {
    id: number;
    name: string;
    name_seq: string;
    employee_creator: (number | string)[];
    employee_request: (number | string)[];
    user_creator: (number | string)[];
    company_id: (number | string)[];
    document_detail: (number | string)[];
    document_stages: number[];
    stage_actions: number[];
    current_stage: (number | string)[];
    partner_id?: (number | string)[];
    sent_date: string;
    status: string;
    department_employee_request: (number | string)[];
    job_position_employee_request: (number | string)[];
    current_stage_actions: number[]

}