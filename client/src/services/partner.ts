import instance from "./instance";

export function getPartnerApi() {
    return instance.get("/api/get-partner");
}