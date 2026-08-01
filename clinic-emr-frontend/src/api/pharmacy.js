import axiosInstance from "./axiosInstance";

const API = "/api/pharmacy";

export const getMedicines = async () => (await axiosInstance.get(API)).data;
export const getMedicineById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createMedicine = async (data) => (await axiosInstance.post(API, data)).data;
export const updateMedicine = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deleteMedicine = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
