import axiosInstance from "./axiosInstance";

const API = "/api/appointments";

export const getAppointments = async () => (await axiosInstance.get(API)).data;
export const getAppointmentById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createAppointment = async (data) => (await axiosInstance.post(API, data)).data;
export const updateAppointment = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deleteAppointment = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
