import apiClient from "./apiClient";

const resource = "/products/";

function toFormData(payload) {
  if (payload instanceof FormData) return payload;

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  return formData;
}

export const productService = {
  async list({ category } = {}) {
    const params = category ? { category } : {};
    const { data } = await apiClient.get(resource, { params });
    return data;
  },

  async get(id) {
    const { data } = await apiClient.get(`${resource}${id}/`);
    return data;
  },

  async create(payload) {
    const { data } = await apiClient.post(resource, toFormData(payload));
    return data;
  },

  async update(id, payload) {
    const { data } = await apiClient.patch(`${resource}${id}/`, toFormData(payload));
    return data;
  },

  async remove(id) {
    await apiClient.delete(`${resource}${id}/`);
  },
};
