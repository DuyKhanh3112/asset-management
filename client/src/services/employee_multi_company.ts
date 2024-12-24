import instance from "./instance";

export function getEmployeeMultiApi() {
    return instance.get("/api/get-employee-multi");
}