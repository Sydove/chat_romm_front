// 对于axios的封装
import axios from "axios";
import local from "@/utils/local";
export const contentType = (con) => {
  switch (con) {
    case "json":
      return "application/json";
    case "formdata":
      return "multipart/form-data";
    case "urlencoded":
      return "application/x-www-form-urlencoded";
  }
};
const request = axios.create({
  // 是否带跨域请求头
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 拦截请求
request.interceptors.request.use((config) => {
  //携带token
  if (config.url.indexOf("/onlineBill/download") != -1) {
    config.responseType = "blob";
  }
  if (
    config.url.indexOf("register") != -1 ||
    (config.url.indexOf("details") != -1 && config.method == "get")
  ) {
    const token = local.getLocal("token");
    config.headers.Authorization = token;
  }
  return config;
});

// 拦截响应
request.interceptors.response.use(
  (response) => {
    if (response.data.code === 9000) {
      return Promise.reject(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

// 暴露方法
export default {
  get(url, parms, con) {
    return new Promise((resolve, reject) => {
      request({
        method: "get",
        url: process.env.VUE_APP_BASE_API + url,
        params: parms,
        headers: {
          "Content-Type": contentType(con),
        },
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  post(url, parms, con) {
    return new Promise((resolve, reject) => {
      request({
        method: "post",
        url: process.env.VUE_APP_BASE_API + url,
        data: parms,
        headers: {
          "Content-Type": contentType(con),
        },
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
