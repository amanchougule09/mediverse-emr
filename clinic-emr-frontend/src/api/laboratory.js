import axiosInstance from "./axiosInstance";

const API = "/api/laboratory";

export const getLabTests = async () => (await axiosInstance.get(API)).data;
export const getLabTestById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createLabTest = async (data) => (await axiosInstance.post(API, data)).data;
export const updateLabTest = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deleteLabTest = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
