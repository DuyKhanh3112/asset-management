export interface IEmployeeMultiCompany {
    id: number;
    name: (number | string)[];
    user_id: (number | string)[];
    s_identification_id: string;
    department_id: (number | string)[];
    job_id: (number | string)[];
    company_id: (number | string)[];
}