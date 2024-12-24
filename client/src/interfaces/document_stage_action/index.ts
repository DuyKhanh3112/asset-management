export interface IDocumentStageAction {
    id: number;
    name: string;
    order: string;
    description: string;
    next_stage_id: (number | string)[];
    sea_sign_document_id: (number | string)[];
    employee_do_action: (number | string)[];
    sea_sign_document_stage: (number | string)[];
    send_to_list_employee: number[];
    confirm: boolean;
    status: string;

}