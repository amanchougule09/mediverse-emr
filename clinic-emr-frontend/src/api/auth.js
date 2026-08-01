import axiosInstance from "./axiosInstance";

export const forgotPassword = async (data) =>
  (await axiosInstance.post("/api/auth/forgot-password", data)).data;

export const resetPassword = async (data) =>
  (await axiosInstance.post("/api/auth/reset-password", data)).data;
