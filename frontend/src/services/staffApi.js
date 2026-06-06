import api from "./api";

export const getStaffList = (params) => api.get("/staff", { params });
export const createStaff = (data) => api.post("/staff", data);
export const updateStaff = (id, data) => api.put(`/staff/${id}`, data);
export const deleteStaff = (id) => api.delete(`/staff/${id}`);
export const getStaffPerformance = () => api.get("/staff/performance");
export const getStaffSales = (id) => api.get(`/staff/${id}/sales`);
export const getStaffActivity = (id) => api.get(`/staff/${id}/activity`);
