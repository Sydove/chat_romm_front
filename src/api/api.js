import request from "@/utils/request";
export const register = (params) =>
  request.post("/api/user/register", params, "", "json");
export const userList = (params) =>
  request.get("/api/user/register", params, "", "json");
export const login = (params) =>
  request.post("/api/user/login", params, "", "json");
export const userDetail = (params) =>
  request.get("/api/user/details", params, "", "json");
