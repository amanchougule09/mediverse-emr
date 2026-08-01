import axiosInstance from "./axiosInstance";

const API = "/api/audits";

export const getAudits = async () => (await axiosInstance.get(API)).data;
export const getAuditById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const deleteAudit = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
