import axiosInstance from "./axiosInstance";

const API = "/api/users";

export const getUsers = async () => (await axiosInstance.get(API)).data;
export const getUserById = async (id) => (await axiosInstance.get(`${API}/${id}`)).data;
export const updateUserRoles = async (id, roleIds) =>
    (await axiosInstance.put(`${API}/${id}/roles`, { roleIds })).data;
