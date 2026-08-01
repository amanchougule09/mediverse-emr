import axiosInstance from "./axiosInstance";

const API = "/api/files";

export const getFiles = async (params) =>
  (await axiosInstance.get(API, { params })).data;

export const getFileById = async (id) =>
  (await axiosInstance.get(`${API}/${id}`)).data;

export const uploadFile = async (formData, onProgress) =>
  (await axiosInstance.post(API, formData, {
    onUploadProgress: onProgress
      ? (e) => onProgress(Math.round((e.loaded / e.total) * 100))
      : undefined,
  })).data;

export const deleteFile = async (id) =>
  (await axiosInstance.delete(`${API}/${id}`)).data;

export const deleteFiles = async (ids) =>
  (await axiosInstance.post(`${API}/batch-delete`, { ids })).data;

export const downloadFile = async (id) =>
  await axiosInstance.get(`${API}/${id}/download`, {
    responseType: "blob",
  });

export const getFileDownloadUrl = (id) => {
  const base = axiosInstance.defaults.baseURL;
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  return `${base}${API}/${id}/download?authorization=${encodeURIComponent(`${tokenType} ${token}`)}`;
};
