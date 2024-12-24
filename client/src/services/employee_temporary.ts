import instance from "./instance";

export function getEmployeeTemporaryApi() {
    return instance.get(`/api/get-employee-temporary`);
}
