import axiosInstance from "./axiosInstance";

const API = "/api/permissions";

export const getPermissions = async () => (await axiosInstance.get(API)).data;
