import axiosInstance from "./axiosInstance";

const API = "/api/billing";

export const getBills = async () => (await axiosInstance.get(API)).data;
export const getBillById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createBill = async (data) => (await axiosInstance.post(API, data)).data;
export const updateBill = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deleteBill = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
