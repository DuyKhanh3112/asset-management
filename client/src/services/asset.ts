import instance from "./instance";

export function postAssetApi(value: string) {
    return instance.post("/api/get-asset", { text: value, isCodeAndName: true })
}