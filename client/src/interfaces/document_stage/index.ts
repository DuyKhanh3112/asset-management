export interface IDocumentStage {
    id: number;
    name: string;
    stage_status: boolean;
    status: string;
    sea_sign_document_id: (number | string)[];
    process_list_employee: number[];
    actions: number[];
    user_do_action: (number | string)[];
    is_complete: boolean;
    confirm_date: boolean;
    comment: string;
}