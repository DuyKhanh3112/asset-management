import instance from "./instance";

export function getCompaniesApi() {
    return instance.get("/api/get-companies");
}