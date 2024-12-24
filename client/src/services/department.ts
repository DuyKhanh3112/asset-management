import instance from "./instance";

export function getDepartmentApi() {
    return instance.get("/api/get-departments");
}