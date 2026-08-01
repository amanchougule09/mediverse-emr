import axiosInstance from "./axiosInstance";

const API = "/api/patients";

export const getPatients = async () => (await axiosInstance.get(API)).data;
export const getPatientById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const searchPatients = async (keyword) => (await axiosInstance.get(`${API}/search`, { params: { keyword } })).data;
export const getPatientsPage = async (page = 0, size = 10) => (await axiosInstance.get(`${API}/page`, { params: { page, size } })).data;
export const createPatient = async (data) => (await axiosInstance.post(API, data)).data;
export const updatePatient = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deletePatient = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
