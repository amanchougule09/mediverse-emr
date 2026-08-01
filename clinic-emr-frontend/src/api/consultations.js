import axiosInstance from "./axiosInstance";

const API = "/api/consultations";

export const getConsultations = async () => (await axiosInstance.get(API)).data;
export const getConsultationById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createConsultation = async (data) => (await axiosInstance.post(API, data)).data;
export const updateConsultation = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deleteConsultation = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
