import instance from "./instance";

export function getPartnerBankApi() {
    return instance.get("/api/get-partner-bank")
}