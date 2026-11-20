import apiClient from "./apiClient";

const resource = "/categories/";

export const categoryService = {
  async list() {
    const { data } = await apiClient.get(resource);
    return data;
  },

  async get(id) {
    const { data } = await apiClient.get(`${resource}${id}/`);
    return data;
  },

  async create(payload) {
    const { data } = await apiClient.post(resource, payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await apiClient.patch(`${resource}${id}/`, payload);
    return data;
  },

  async remove(id) {
    await apiClient.delete(`${resource}${id}/`);
  },
};
