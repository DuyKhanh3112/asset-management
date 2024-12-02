import { ILoginData } from "interfaces";
import instance from "./instance";

export function authLoginApi(data: ILoginData) {
  return instance.post("/api/login", data); 
}

export function checkAuthApi() {
  return instance.get("/api/check-auth"); 
}