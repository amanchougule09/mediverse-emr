import axiosInstance from "./axiosInstance";

const API = "/api/notifications";

export const getNotifications = async () => (await axiosInstance.get(API)).data;
export const getNotificationById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createNotification = async (data) => (await axiosInstance.post(API, data)).data;
export const updateNotification = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const deleteNotification = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
