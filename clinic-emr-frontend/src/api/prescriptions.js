import axiosInstance from "./axiosInstance";

const API = "/api/prescriptions";

export const getPrescriptions = async () => (await axiosInstance.get(API)).data;
export const getPrescriptionById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createPrescription = async (data) => (await axiosInstance.post(API, data)).data;
export const updatePrescription = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deletePrescription = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
