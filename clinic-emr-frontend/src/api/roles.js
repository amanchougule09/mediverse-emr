import axiosInstance from "./axiosInstance";

const API = "/api/roles";

export const getRoles = async () => (await axiosInstance.get(API)).data;
export const getRoleById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const createRole = async (data) => (await axiosInstance.post(API, data)).data;
export const updateRole = async (id, data) => (await axiosInstance.put(`${API}/${id}`, data)).data;
export const updateRolePermissions = async (id, permissionIds) =>
    (await axiosInstance.put(`${API}/${id}/permissions`, { permissionIds })).data;
export const deleteRole = async (id) => (await axiosInstance.delete(`${API}/${id}`)).data;
