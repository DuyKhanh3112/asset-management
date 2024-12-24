import instance from "./instance";

export function getUserApi() {
    return instance.get("/api/get-user");
}

