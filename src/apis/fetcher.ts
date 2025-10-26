import axios from "axios";

// TMS API를 위한 axios 인스턴스 생성
export const wasApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_FRONT_URL + "/api",
});

// 요청 인터셉터
wasApi.interceptors.request.use(
  (request) => {
    console.log("[API] REQ", request.url);
    return request;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
wasApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API] RES ERROR", error);
    return Promise.reject(error);
  }
);
