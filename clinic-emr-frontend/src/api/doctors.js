import axiosInstance from "./axiosInstance";

const API = "/api/doctors";

export const getDoctors = async () => (await axiosInstance.get(API)).data;
export const getDoctorById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createDoctor = async (data) => (await axiosInstance.post(API, data)).data;
export const updateDoctor = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deleteDoctor = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
