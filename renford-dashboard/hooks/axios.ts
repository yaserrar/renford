"use client";

import { API_BASE_URL } from "@/lib/env";
import { tokenExp } from "@/lib/token-exp";
import useSession from "@/stores/session-store";
import axios from "axios";

const useAxios = () => {
  const { session, logout } = useSession();

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${session?.token}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    // withCredentials: true,
  });

  axiosInstance.interceptors.request.use((req) => {
    const tokenIsExpired = tokenExp(session?.token);
    if (!tokenIsExpired) {
      return req;
    }

    logout();
    return req;
  });

  axiosInstance.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;

export const config = { headers: { "Content-Type": "multipart/form-data" } };
